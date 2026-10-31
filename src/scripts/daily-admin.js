export function initDailyAdmin(api,getCodes){
 const $=s=>document.querySelector(s),root=$('#daily-admin-days'),status=$('#daily-admin-status'),fields=$('#daily-admin-fields');let revision=0,busy=false;
 const names=['周一','周二','周三','周四','周五','周六','周日'];
 function element(tag,text){const el=document.createElement(tag);if(text!=null)el.textContent=String(text);return el;}
 function quantity(value,max=1000000){const el=document.createElement('input');el.type='number';el.min='0';el.max=String(max);el.step='1';el.required=true;el.value=String(value);return el;}
 function label(text,input){const el=element('label',text);el.appendChild(input);return el;}
 function itemRow(list,value={code:20001,quantity:1}){
  if(list.children.length>=8)return;const row=element('div');row.className='daily-admin-item row';const select=document.createElement('select');select.className='grow';select.required=true;
  for(const c of getCodes().filter(c=>c.sendable&&!c.blocked)){const text=(c.name_zh||c.label)+' ×'+(c.quantity||1)+'（码 '+c.code+'）';select.appendChild(new Option(text,String(c.code)));}
  select.value=String(value.code);const count=quantity(value.quantity,10);count.min='1';count.setAttribute('aria-label','发放份数');select.setAttribute('aria-label','道具');const remove=element('button','删除');remove.type='button';remove.className='text-button';remove.onclick=()=>row.remove();row.append(select,count,remove);list.appendChild(row);
 }
 function renderDay(day,i){
  const detail=element('details');detail.className='daily-admin-day';detail.open=i===0;detail.appendChild(element('summary',names[i]));
  const toggle=document.createElement('input');toggle.type='checkbox';toggle.checked=day.enabled;toggle.dataset.enabled='';detail.appendChild(label('启用当天奖励 ',toggle));
  const grid=element('div');grid.className='form-grid';const coins=quantity(day.coins),points=quantity(day.points);coins.dataset.coins='';points.dataset.points='';grid.append(label('金币',coins),label('Points',points));detail.appendChild(grid);
  const list=element('div');list.className='daily-admin-items';for(const item of day.items||[])itemRow(list,item);detail.appendChild(list);
  const add=element('button','添加道具');add.type='button';add.className='text-button';add.onclick=()=>itemRow(list);detail.appendChild(add);root.appendChild(detail);
 }
 async function history(){
  const tbody=$('#daily-admin-history');try{const r=await api('DailyRewardHistory',{uid:$('#daily-history-uid').value.trim()});tbody.replaceChildren();for(const item of r.records||[]){const row=element('tr'),rewards=[];if(item.coins)rewards.push(item.coins+' 金币');if(item.points)rewards.push(item.points+' Points');for(const v of item.items||[])rewards.push(v.name_zh+' ×'+v.quantity*(v.units||1));for(const text of [item.claim_day,item.uid,rewards.join(' · '),{pending:'待下次登录下发',prepared:'已生成下发数据',posted:'金币已入账'}[item.delivery_status]])row.appendChild(element('td',text));tbody.appendChild(row);}if(!tbody.children.length){const row=element('tr'),cell=element('td','暂无领取记录');cell.colSpan=4;row.appendChild(cell);tbody.appendChild(row);}}catch(e){status.textContent=e.message||'记录读取失败';}
 }
 async function load(){if(busy)return;status.textContent='正在读取…';try{const r=await api('DailyRewardAdminGet',{});revision=r.revision;$('#daily-admin-enabled').checked=r.enabled;root.replaceChildren();r.days.forEach(renderDay);fields.disabled=false;status.textContent=r.enabled?'已开启':'已关闭';await history();}catch(e){status.textContent=e.message||'读取失败';}}
 $('#daily-admin-refresh').onclick=load;$('#daily-history-refresh').onclick=history;
 $('#daily-admin-form').onsubmit=async e=>{e.preventDefault();if(busy||!e.currentTarget.reportValidity())return;const days=[...root.children].map(card=>({enabled:card.querySelector('[data-enabled]').checked,coins:Number(card.querySelector('[data-coins]').value),points:Number(card.querySelector('[data-points]').value),items:[...card.querySelectorAll('.daily-admin-item')].map(row=>({code:Number(row.querySelector('select').value),quantity:Number(row.querySelector('input').value)}))}));busy=true;fields.disabled=true;status.textContent='正在保存…';try{const r=await api('DailyRewardAdminSet',{enabled:$('#daily-admin-enabled').checked,revision,days});revision=r.revision;status.textContent='已保存';}catch(e){status.textContent=e.message||'保存失败，请重试';}finally{busy=false;fields.disabled=false;}};
 return load;
}
