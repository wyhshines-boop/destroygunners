export function initChatAdmin(api,toast){
 const $=id=>document.getElementById(id);
 const text=(tag,value)=>{const el=document.createElement(tag);el.textContent=String(value??'');return el;};
 async function load(){
  const result=await api('ChatAdminList',{}),rows=$('chat-admin-messages');rows.replaceChildren();
  for(const message of [...result.messages].reverse()){
   const tr=document.createElement('tr');
   tr.append(text('td',new Date(message.created_at).toLocaleString()),text('td',message.nickname||'—'),text('td',message.uid),text('td',message.content));
   const actions=document.createElement('td'),remove=text('button','删除'),mute=text('button','禁言1小时');
   remove.type=mute.type='button';remove.onclick=async()=>{remove.disabled=true;try{await api('ChatAdminDelete',{id:message.id});await load();}catch{remove.disabled=false;}};
   mute.onclick=async()=>{mute.disabled=true;try{await api('ChatAdminMute',{uid:message.uid,minutes:60});toast('已禁言','ok');await load();}catch{mute.disabled=false;}};
   actions.append(remove,mute);tr.append(actions);rows.append(tr);
  }
  if(!result.messages.length){const row=document.createElement('tr'),cell=text('td','暂无消息');cell.colSpan=5;row.append(cell);rows.append(row);}
  const mutes=$('chat-admin-mutes');mutes.replaceChildren();
  for(const mute of result.mutes){const row=document.createElement('p'),release=text('button','解除禁言');row.append(text('span',mute.uid+' · '+new Date(mute.muted_until).toLocaleString()+' '));release.type='button';release.onclick=async()=>{try{await api('ChatAdminMute',{uid:mute.uid,minutes:0});await load();}catch{}};row.append(release);mutes.append(row);}
 }
 $('chat-admin-refresh').onclick=()=>load().catch(()=>{});
 $('chat-mute-form').onsubmit=async event=>{event.preventDefault();try{await api('ChatAdminMute',{uid:$('chat-mute-uid').value.trim(),minutes:Number($('chat-mute-minutes').value)});toast('已保存','ok');await load();}catch{}};
 return load;
}
