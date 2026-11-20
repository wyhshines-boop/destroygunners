import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let cleanup: (()=>void)|undefined;
function setup(){
 const root=document.querySelector<HTMLElement>('[data-parts-reference]');if(!root||root.dataset.bound)return;
 cleanup?.();root.dataset.bound='true';
 const q=<T extends HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
 const copy=JSON.parse(root.dataset.copy!),parts=JSON.parse(root.dataset.parts!);const handcraft=root.dataset.handcraft==='true';const heightInput=root.querySelector<HTMLSelectElement>('[data-height]');let scale=handcraft?1.5:1,legOnly=false;
 const mount=q<HTMLDivElement>('[data-canvas]'),status=q('[data-status]'),editor=q<HTMLFieldSetElement>('[data-editor]');
 const select=q<HTMLSelectElement>('[data-part]'),explode=q<HTMLInputElement>('[data-explode]'),isolate=q<HTMLInputElement>('[data-isolate]'),wire=q<HTMLInputElement>('[data-wire]');
 const abort=new AbortController(),{signal}=abort;let disposed=false,model:THREE.Group|undefined;
 let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{status.textContent=copy.error;return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.domElement.setAttribute('aria-hidden','true');mount.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,3000);
 scene.add(new THREE.HemisphereLight(0xe6faff,0x334951,2.8));
 const light=new THREE.DirectionalLight(0xffffff,2.5);light.position.set(100,200,140);scene.add(light);
 const rim=new THREE.DirectionalLight(0x90d6ed,1.5);rim.position.set(-120,80,-140);scene.add(rim);
 const grid=new THREE.GridHelper(260,26,0x437984,0x23454e);scene.add(grid);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=10;controls.maxDistance=900;controls.listenToKeyEvents(mount);
 let meshes:THREE.Mesh[]=[],selected='',view='front';let fullDimensions='';const original=new Map<THREE.Mesh,THREE.Vector3>(),directions=new Map<THREE.Mesh,THREE.Vector3>();
 function frame(direction=view){
  view=direction;const shown=meshes.filter(m=>m.visible);if(!shown.length)return;
  const box=new THREE.Box3();shown.forEach(m=>box.expandByObject(m));const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
  const vectors:{[k:string]:THREE.Vector3}={front:new THREE.Vector3(0,0,-1),back:new THREE.Vector3(0,0,1),left:new THREE.Vector3(-1,0,0),right:new THREE.Vector3(1,0,0),iso:new THREE.Vector3(.65,.25,-1)};
  const d=Math.max(size.length()*.55,size.y/2/Math.tan(THREE.MathUtils.degToRad(18)),size.x/2/Math.tan(THREE.MathUtils.degToRad(18))/camera.aspect)*1.3;
  controls.target.copy(center);camera.position.copy(center).add(vectors[direction].clone().normalize().multiplyScalar(Math.max(d,25)));controls.update();
 }
 function refresh(){
  const amount=Number(explode.value)/100;q<HTMLOutputElement>('[data-distance]').value=`${explode.value}%`;
  for(const mesh of meshes){
   mesh.position.copy(original.get(mesh)!).addScaledVector(directions.get(mesh)!,amount*55);
   const chosen=legOnly?['left-thigh','left-shin','left-foot'].includes(mesh.name):!selected||mesh.name===selected;mesh.visible=legOnly?chosen:!isolate.checked||!selected||chosen;
   const material=mesh.material as THREE.MeshStandardMaterial;material.color.set(selected&&chosen?0x7de7ed:0xc1cbd2);material.transparent=!!selected&&!chosen;material.opacity=selected&&!chosen ? .18 : 1;material.depthWrite=!material.transparent;material.wireframe=wire.checked;
  }
  const row=parts.find((p:any)=>p.file===selected);q('[data-name]').textContent=legOnly?(document.documentElement.lang==='zh-CN'?'左腿':document.documentElement.lang==='ja-JP'?'左脚':'Left leg'):row?select.selectedOptions[0].textContent:copy.all;
  // Source X/Y/Z dimensions stay fixed when the display is exploded.
  q('[data-size]').textContent=row?row.size_mm.map((n:number)=>(n*scale).toFixed(1)).join(' × '):fullDimensions;
  if(handcraft&&!row&&model){const saved=meshes.map(m=>m.position.clone());meshes.forEach(m=>m.position.copy(original.get(m)!));const box=new THREE.Box3();meshes.filter(m=>!legOnly||['left-thigh','left-shin','left-foot'].includes(m.name)).forEach(m=>box.expandByObject(m));const size=box.getSize(new THREE.Vector3());q('[data-size]').textContent=`${size.x.toFixed(1)} × ${size.z.toFixed(1)} × ${size.y.toFixed(1)}`;meshes.forEach((m,i)=>m.position.copy(saved[i]));}
  q('[data-mesh-note]').hidden=!row?.non_manifold_edges;
  const link=q<HTMLAnchorElement>('[data-stl]');link.hidden=handcraft||!row;if(row&&!handcraft){link.href=`/reference/da01/stl/${row.file}.stl`;link.download=row.file+'.stl';}
 }
 function pick(name:string){legOnly=false;selected=name;select.value=name;refresh();if(isolate.checked)frame();root.dispatchEvent(new CustomEvent('reference:change',{detail:{selected,scale}}));}
 select.addEventListener('change',()=>pick(select.value),{signal});
 explode.addEventListener('input',()=>{refresh();frame();},{signal});
 isolate.addEventListener('change',()=>{refresh();frame();},{signal});wire.addEventListener('change',refresh,{signal});
 root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.addEventListener('click',()=>frame(b.dataset.view!),{signal}));
 q('[data-reset]').addEventListener('click',()=>{legOnly=false;selected='';select.value='';isolate.checked=false;explode.value='0';wire.checked=false;refresh();frame('iso');},{signal});
 heightInput?.addEventListener('change',()=>{scale=Number(heightInput.value)/120;if(model){model.scale.setScalar(scale);model.updateMatrixWorld(true);grid.scale.setScalar(scale);grid.position.y=new THREE.Box3().setFromObject(model).min.y-.3;refresh();frame();}root.dispatchEvent(new CustomEvent('reference:change',{detail:{selected,scale}}));},{signal});
 root.querySelector('[data-leg]')?.addEventListener('click',()=>{if(!model)return;legOnly=true;selected='';select.value='';explode.value='0';refresh();frame('iso');},{signal});
 root.querySelector('[data-whole]')?.addEventListener('click',()=>{if(!model)return;legOnly=false;selected='';select.value='';isolate.checked=false;explode.value='0';refresh();frame('iso');},{signal});
 const ray=new THREE.Raycaster();let down:{x:number;y:number}|undefined;
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};},{signal});
 renderer.domElement.addEventListener('pointercancel',()=>{down=undefined;},{signal});
 renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6){down=undefined;return;}down=undefined;const r=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=ray.intersectObjects(meshes.filter(m=>m.visible),false)[0];if(hit)pick(hit.object.name);},{signal});
 const resize=new ResizeObserver(()=>{const r=mount.getBoundingClientRect();if(!r.width||!r.height)return;camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);if(model)frame();});resize.observe(mount);
 const render=()=>{controls.update();renderer.render(scene,camera);};renderer.setAnimationLoop(render);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);editor.disabled=true;status.textContent=copy.error;},{signal});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{if(!disposed){renderer.setAnimationLoop(render);editor.disabled=!model;status.textContent=model?copy.ready:copy.loading;}},{signal});
 function release(group:THREE.Group){group.traverse(node=>{const mesh=node as THREE.Mesh;if(!mesh.isMesh)return;mesh.geometry.dispose();(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>m.dispose());});}
 cleanup=()=>{disposed=true;abort.abort();resize.disconnect();controls.dispose();renderer.setAnimationLoop(null);if(model)release(model);grid.geometry.dispose();(grid.material as THREE.Material).dispose();renderer.dispose();mount.replaceChildren();};
 new GLTFLoader().loadAsync('/reference/da01/model.glb').then(gltf=>{
  if(disposed){release(gltf.scene);return;}model=gltf.scene;scene.add(model);model.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());fullDimensions=`${size.x.toFixed(1)} × ${size.z.toFixed(1)} × ${size.y.toFixed(1)}`;
  model.traverse(node=>{const mesh=node as THREE.Mesh;if(!mesh.isMesh)return;
   // Blender's glTF exporter preserves each source part as one named node.
   const match=parts.find((p:any)=>p.file===mesh.name||p.files?.includes(mesh.name));if(!match)throw new Error('Unknown part '+mesh.name);if(handcraft)mesh.name=match.file;
   const previous=Array.isArray(mesh.material)?mesh.material:[mesh.material];previous.forEach(m=>m.dispose());mesh.material=new THREE.MeshStandardMaterial({color:0xc1cbd2,roughness:.85,side:THREE.DoubleSide});
   meshes.push(mesh);original.set(mesh,mesh.position.clone());const mid=new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());let direction=mid.sub(center);if(direction.length()<1)direction.set(0,1,0);direction.normalize();mesh.parent!.updateWorldMatrix(true,false);direction.transformDirection(mesh.parent!.matrixWorld.clone().invert());directions.set(mesh,direction);
  });
  if(meshes.length!==parts.reduce((n:number,p:any)=>n+(p.files?.length||1),0))throw new Error('Incomplete model');if(handcraft){model.scale.setScalar(scale);model.updateMatrixWorld(true);grid.scale.setScalar(scale);}grid.position.y=box.min.y*scale-.3;refresh();frame('iso');editor.disabled=false;root.querySelectorAll<HTMLButtonElement>('.view-tools button').forEach(b=>b.disabled=false);status.textContent=copy.ready;
 }).catch(error=>{if(!disposed){console.error(error);status.textContent=copy.error;}});
}
setup();document.addEventListener('astro:page-load',setup);document.addEventListener('astro:before-swap',()=>{cleanup?.();cleanup=undefined;});
