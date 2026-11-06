import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createCanvas, loadImage, ImageData} from '@napi-rs/canvas';
import {assemble, defaultSettings, bounds} from '../../src/lib/workshop-core.mjs';
const root=path.resolve(import.meta.dirname,'../..');const models=JSON.parse(await fs.readFile(path.join(root,'src/data/workshop.json'),'utf8'));
function chunks(bytes){const length=bytes.readUInt32LE(12);return {gltf:JSON.parse(bytes.subarray(20,20+length).toString()),bin:bytes.subarray(28+length)};}
const templates=new Map();assert.equal(models.length,23);assert.equal(new Set(models.map(m=>m.id)).size,23);
for(const model of models){
 const {gltf,bin}=chunks(await fs.readFile(path.join(root,'public',model.url)));const t=new THREE.Group();t.name=model.name;
 const view=i=>{const v=gltf.bufferViews[i];return bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength);};
 const textures=[];
 for(const def of gltf.images){const image=await loadImage(view(def.bufferView));const canvas=createCanvas(image.width,image.height);const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,image.width,image.height);const texture=new THREE.DataTexture(pixels.data,image.width,image.height);texture.colorSpace=THREE.SRGBColorSpace;texture.flipY=false;texture.needsUpdate=true;textures.push(texture);}

 for(const node of gltf.nodes){if(node.mesh===undefined)continue;const geometry=new THREE.BufferGeometry();const primitive=gltf.meshes[node.mesh].primitives[0];
  for(const [key,i] of Object.entries(primitive.attributes)){const a=gltf.accessors[i],v=view(a.bufferView);const values=new Float32Array(v.length/4);for(let j=0;j<values.length;j++)values[j]=v.readFloatLE(j*4);geometry.setAttribute({POSITION:'position',NORMAL:'normal',TEXCOORD_0:'uv'}[key],new THREE.BufferAttribute(values,key==='TEXCOORD_0'?2:3));}
  const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({map:textures[gltf.textures[gltf.materials[primitive.material].pbrMetallicRoughness.baseColorTexture.index].source],roughness:.82}));mesh.name=node.name;mesh.userData=node.extras;mesh.position.set(...node.translation);t.add(mesh);
 }
 templates.set(model.id,t);
 const originalId=model.originalId;const original=chunks(await fs.readFile(path.join(root,`public/models/${originalId}/DGZZ_${originalId}.glb`))).gltf;const originalCount=original.meshes.reduce((n,mesh)=>n+mesh.primitives.reduce((c,p)=>c+original.accessors[p.indices??p.attributes.POSITION].count/3,0),0);assert.equal(model.triangles,originalCount);
 const count=t.children.reduce((n,m)=>n+m.geometry.attributes.position.count/3,0);assert.equal(count,model.triangles);
 const rebuilt=assemble(templates,models,defaultSettings(model.id));const originalBox=bounds(t),box=bounds(rebuilt);assert.ok(box.min.distanceTo(originalBox.min)<1e-6);assert.ok(box.max.distanceTo(originalBox.max)<1e-6);
 for(const original of t.children){let match;rebuilt.traverse(m=>{if(m.geometry===original.geometry)match=m;});assert.ok(match);const a=new THREE.Vector3().setFromMatrixPosition(original.matrixWorld),b=new THREE.Vector3().setFromMatrixPosition(match.matrixWorld);assert.ok(a.distanceTo(b)<1e-6);}
 console.log(model.name+': all '+model.triangles+' triangles and source assembly preserved');
}
for(const body of models)for(const donor of models){const config=defaultSettings(donor.id);config.torso.source=body.id;const combo=assemble(templates,models,config);const box=bounds(combo);assert.ok([...box.min,...box.max].every(Number.isFinite));assert.equal(combo.children.length,5);}
console.log('All 529 torso/donor combinations assemble with finite bounds.');
const settings=defaultSettings('rd10');settings.torso.source='rd04';settings.head.source='rd12';settings.arms.source='rd12';settings.head.color='#e86863';settings.arms.x=.12;settings.arms.scale=1.1;
const mixed=assemble(templates,models,settings);assert.equal(mixed.children.length,5);assert.equal(mixed.children.find(c=>c.userData.part==='arms').scale.x,1.1);
const head=mixed.children.find(c=>c.userData.part==='head');assert.equal(head.children[0].material.color.getHexString(),'e86863');assert.equal(templates.get('rd12').children[0].material.color.getHexString(),'ffffff');
settings.back.source='none';assert.equal(assemble(templates,models,settings).children.length,4);
// The same GLTFExporter used by the webpage; canvas/FileReader supplied for this Node check.
globalThis.ImageData=ImageData;
globalThis.OffscreenCanvas=class {constructor(w,h){const c=createCanvas(w,h);c.convertToBlob=async()=>new Blob([c.toBuffer('image/png')],{type:'image/png'});return c;}};
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(data=>{this.result=data;this.onloadend?.();});}};
const data=await new GLTFExporter().parseAsync(mixed,{binary:true,onlyVisible:true});const exported=chunks(Buffer.from(data));assert.equal(exported.gltf.images.length,3);assert.ok(exported.gltf.images.every(i=>i.bufferView!==undefined && !i.uri));assert.ok(exported.gltf.nodes.some(n=>n.name==='head_rd12'));assert.ok(exported.gltf.materials.some(m=>Math.abs(m.pbrMetallicRoughness.baseColorFactor?.[0]-new THREE.Color('#e86863').r)<1e-5));
await fs.mkdir('/tmp/dgzz-workshop',{recursive:true});await fs.writeFile('/tmp/dgzz-workshop/DGZZ_Custom.glb',Buffer.from(data));console.log('Mixed parts, hidden equipment, alignment, tint and embedded-texture GLB export passed.');

const extra=defaultSettings('mecha-09');extra.torso.source='mecha-18';extra.head.source='mecha-23';const second=await new GLTFExporter().parseAsync(assemble(templates,models,extra),{binary:true,onlyVisible:true});assert.ok(chunks(Buffer.from(second)).gltf.images.every(i=>i.bufferView!==undefined));console.log('Expanded roster textured export passed.');
