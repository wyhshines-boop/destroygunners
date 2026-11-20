let cleanup:(()=>void)|undefined;
function setup(){
 const guide=document.querySelector<HTMLElement>('[data-handcraft-guide]');if(!guide||guide.dataset.bound)return;cleanup?.();guide.dataset.bound='true';
 const root=guide.closest<HTMLElement>('[data-parts-reference]')!,height=root.querySelector<HTMLSelectElement>('[data-height]')!,part=root.querySelector<HTMLSelectElement>('[data-part]')!,scope=guide.querySelector<HTMLSelectElement>('[data-print-scope]')!;
 const abort=new AbortController(),{signal}=abort;
 function update(){
  const selected=part.value,scale=Number(height.value)/180;let count=0;
  guide.querySelectorAll<HTMLElement>('[data-sheet]').forEach(sheet=>{sheet.hidden=scope.value==='leg'?!['left-thigh','left-shin','left-foot'].includes(sheet.dataset.sheet!):scope.value==='selected'?sheet.dataset.sheet!==selected:false;if(!sheet.hidden)count++;});
  guide.querySelector<HTMLElement>('[data-no-sheets]')!.hidden=count!==0;guide.querySelector<HTMLButtonElement>('[data-print]')!.disabled=count===0;
  guide.querySelectorAll<SVGGElement>('[data-pattern-shape]').forEach(g=>g.setAttribute('transform',`scale(${scale})`));
  guide.querySelectorAll('[data-sheet-height]').forEach(n=>n.textContent=height.value+' mm');guide.querySelectorAll<SVGElement>('[data-sheet-dims]').forEach(n=>n.textContent=n.dataset.originalSize!.split(',').map(Number).map(v=>(v*Number(height.value)/120).toFixed(1)).join(' × ')+' mm');
 }
 guide.querySelectorAll<HTMLButtonElement>('[data-focus-part]').forEach(button=>button.addEventListener('click',()=>{if(root.querySelector<HTMLFieldSetElement>('[data-editor]')!.disabled)return;part.value=button.dataset.focusPart!;root.querySelector<HTMLInputElement>('[data-isolate]')!.checked=true;part.dispatchEvent(new Event('change'));root.querySelector<HTMLElement>('.stage')!.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});},{signal}));
 scope.addEventListener('change',update,{signal});height.addEventListener('change',update,{signal});part.addEventListener('change',update,{signal});root.addEventListener('reference:change',update,{signal});
 guide.querySelector('[data-print]')!.addEventListener('click',()=>window.print(),{signal});update();cleanup=()=>abort.abort();
}
setup();document.addEventListener('astro:page-load',setup);document.addEventListener('astro:before-swap',()=>{cleanup?.();cleanup=undefined;});
