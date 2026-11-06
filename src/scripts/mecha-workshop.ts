import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { assemble, defaultSettings, releaseAssembly, bounds } from '../lib/workshop-core.mjs';

let cleanup: (() => void) | undefined;
function setupWorkshop() {
 const root = document.querySelector<HTMLElement>('[data-workshop]'); if (!root || root.dataset.bound) return;
 root.dataset.bound = 'true'; cleanup?.();
 const models = JSON.parse(root.dataset.models!); const copy = JSON.parse(root.dataset.copy!);
 const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
 const mount=$<HTMLDivElement>('[data-canvas]'), status=$<HTMLParagraphElement>('[data-status]'), editor=$<HTMLFieldSetElement>('[data-editor]');
 const base=$<HTMLSelectElement>('[data-base]'), edit=$<HTMLSelectElement>('[data-edit]'), tint=$<HTMLInputElement>('[data-tint]'), output=$<HTMLButtonElement>('[data-export]'), retry=$<HTMLButtonElement>('[data-retry]'), frame=$<HTMLButtonElement>('[data-frame]');
 const abort=new AbortController();const signal=abort.signal; const templates=new Map<string, THREE.Group>();let settings=defaultSettings(models[0].id), assembly:THREE.Group | undefined, disposed=false, busy=false;
 let renderer:THREE.WebGLRenderer;
 try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'default'}); } catch { status.textContent=copy.unsupported;return; }
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;mount.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.01,100);scene.add(new THREE.HemisphereLight(0xd7f5ff,0x35434c,2.1));
 const key=new THREE.DirectionalLight(0xffefdd,3);key.position.set(4,6,5);scene.add(key);const rim=new THREE.DirectionalLight(0x7ab7ee,2);rim.position.set(-4,3,-3);scene.add(rim);
 const grid=new THREE.GridHelper(8,20,0x336572,0x1e3a44);grid.position.y=-1.5;scene.add(grid);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=true;controls.minDistance=1;controls.maxDistance=14;controls.maxPolarAngle=Math.PI*.94;
 renderer.domElement.setAttribute('aria-hidden','true');
 const render=()=>{controls.update();renderer.render(scene,camera);};renderer.setAnimationLoop(render);
 const navbar=document.querySelector<HTMLElement>('.global-navbar');
 const resize=new ResizeObserver(()=>{if(navbar)root.style.setProperty('--workshop-nav-height',navbar.getBoundingClientRect().height+'px');const r=mount.getBoundingClientRect();if(!r.width||!r.height)return;camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);});resize.observe(mount);if(navbar)resize.observe(navbar);
 function center() {if(!assembly)return;const box=bounds(assembly),size=box.getSize(new THREE.Vector3()),target=box.getCenter(new THREE.Vector3());const distance=Math.max(size.y,size.x/camera.aspect)*1.9;controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(.55,.2,1).normalize().multiplyScalar(distance));grid.position.y=box.min.y-.015;controls.update();}
 function syncAdjust() {const config=settings[edit.value];tint.value=config.color;root.querySelectorAll<HTMLInputElement>('[data-axis]').forEach(input=>{const k=input.dataset.axis!;input.value=String(config[k]);$<HTMLOutputElement>(`[data-value="${k}"]`).value=k==='scale'?Math.round(config[k]*100)+'%':Number(config[k]).toFixed(2);});}
 function rebuild() {if(disposed||!templates.size)return;const next=assemble(templates,models,settings);if(assembly){scene.remove(assembly);releaseAssembly(assembly);}assembly=next;scene.add(next);$('[data-combination]').textContent=new Set(Object.values(settings).map((c:any)=>c.source).filter(id=>id!=='none')).size===1?models.find((m:any)=>m.id===settings.torso.source).name:'CUSTOM';}
 function resetAll() {settings=defaultSettings(base.value);root.querySelectorAll<HTMLSelectElement>('[data-part]').forEach(select=>select.value=base.value);rebuild();syncAdjust();center();}
 base.addEventListener('change',resetAll,{signal});edit.addEventListener('change',syncAdjust,{signal});
 root.querySelectorAll<HTMLSelectElement>('[data-part]').forEach(select=>select.addEventListener('change',()=>{settings[select.dataset.part!].source=select.value;edit.value=select.dataset.part!;rebuild();syncAdjust();},{signal}));
 function applyTint(value:string){settings[edit.value].color=value;tint.value=value;rebuild();}
 tint.addEventListener('input',()=>applyTint(tint.value),{signal});$('[data-original]').addEventListener('click',()=>applyTint('#ffffff'),{signal});
 root.querySelectorAll<HTMLButtonElement>('[data-swatch]').forEach(button=>button.addEventListener('click',()=>applyTint(button.dataset.swatch!),{signal}));
 root.querySelectorAll<HTMLInputElement>('[data-axis]').forEach(input=>input.addEventListener('input',()=>{settings[edit.value][input.dataset.axis!]=Number(input.value);syncAdjust();rebuild();},{signal}));
 $('[data-reset-part]').addEventListener('click',()=>{Object.assign(settings[edit.value],{x:0,y:0,z:0,scale:1});syncAdjust();rebuild();},{signal});
 $('[data-reset]').addEventListener('click',resetAll,{signal});frame.addEventListener('click',center,{signal});
 mount.addEventListener('keydown',event=>{if(event.key==='Home'){event.preventDefault();center();}},{signal});controls.listenToKeyEvents(mount);
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();renderer.setAnimationLoop(null);status.textContent=copy.unsupported;editor.disabled=true;},{signal});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{if(disposed)return;renderer.setAnimationLoop(render);editor.disabled=templates.size!==models.length;status.textContent=templates.size===models.length?copy.ready:copy.loading;},{signal});
 output.addEventListener('click',async()=>{if(!assembly||busy)return;busy=true;output.disabled=true;output.textContent=copy.exporting;
  // Snapshot the current assembly so later edits cannot change the file being exported.
  const snapshot=assemble(templates,models,structuredClone(settings));
  try{const data=await new GLTFExporter().parseAsync(snapshot,{binary:true,onlyVisible:true});if(disposed)return;const url=URL.createObjectURL(new Blob([data as ArrayBuffer],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download='DGZZ_Custom.glb';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent=copy.ready;}
  catch(error){if(!disposed){console.error('GLB export failed',error);status.textContent=copy.exportError;}}
  finally{releaseAssembly(snapshot);if(!disposed){busy=false;output.disabled=false;output.textContent=copy.exportLabel+' ↓';}}
 },{signal});
 let loadGeneration=0;
 async function load() {const generation=++loadGeneration;status.textContent=copy.loading;retry.hidden=true;editor.disabled=true;frame.disabled=true;const loader=new GLTFLoader();
  try {for(const model of models){if(templates.has(model.id))continue;const gltf=await loader.loadAsync(model.url);if(disposed||generation!==loadGeneration){disposeTemplate(gltf.scene);return;}templates.set(model.id,gltf.scene);}if(disposed)return;resetAll();editor.disabled=false;frame.disabled=false;status.textContent=copy.ready;}
  catch(error){if(!disposed&&generation===loadGeneration){console.error('Model load failed',error);status.textContent=copy.error;retry.hidden=false;}}
 }
 retry.addEventListener('click',()=>void load(),{signal});
 function disposeTemplate(template:THREE.Group){const textures=new Set<THREE.Texture>();template.traverse((node:any)=>{if(!node.isMesh)return;node.geometry.dispose();const materials=Array.isArray(node.material)?node.material:[node.material];for(const material of materials){if(material.map)textures.add(material.map);material.dispose();}});textures.forEach(t=>{t.source.data?.close?.();t.dispose();});}
 cleanup=()=>{disposed=true;loadGeneration++;abort.abort();resize.disconnect();renderer.setAnimationLoop(null);controls.dispose();if(assembly)releaseAssembly(assembly);templates.forEach(disposeTemplate);templates.clear();grid.geometry.dispose();(grid.material as THREE.Material).dispose();renderer.dispose();mount.replaceChildren();};
 void load();
}
setupWorkshop();document.addEventListener('astro:page-load',setupWorkshop);document.addEventListener('astro:before-swap',()=>{cleanup?.();cleanup=undefined;});
