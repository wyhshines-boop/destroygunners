import {rewardCategories,rewardEvidence,filterRewards,displayReward,csvRewards} from './reward-catalog.js';

const $ = (s) => document.querySelector(s);
let BASE = localStorage.getItem("dgzz_base") || "https://ttbuviubnrmjhhpsaygs.supabase.co/functions/v1/dgzz";
let TOKEN = localStorage.getItem("dgzz_token") || "";
let CODES = [], PRESETS = [];
const selected = new Set();   // 批量发放目标 uid 集合

$("#base").value = BASE; $("#token").value = TOKEN;

function toast(msg, kind){ const t=$("#toast"); t.textContent=msg; t.className="show "+(kind||""); setTimeout(()=>t.className="",2200); }
function setConn(on){ $("#conn").classList.toggle("on", !!on); $("#connection-status").textContent=on?"已连接":"未连接";$("#connection-settings").open=!on; }
async function api(ep, body){
  if(!BASE||!TOKEN){ toast("先填服务器地址和 Token","bad"); throw new Error("no config"); }
  const r = await fetch(BASE.replace(/\/$/,"")+"/"+ep, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ admin_token:TOKEN, ...body }),
  });
  const j = await r.json();
  if(j.status!=="OK"){ toast(ep+"："+(j.msg||"NG"),"bad"); throw new Error(j.msg||"NG"); }
  return j;
}
const hex = (n) => "0x"+((n>>>0).toString(16));
const esc = (s) => String(s??"").replace(/[&<>]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const ts = (s) => (s||"").slice(0,16).replace("T"," ");

$("#save").onclick = async () => {
  BASE=$("#base").value.trim(); TOKEN=$("#token").value.trim();
  localStorage.setItem("dgzz_base",BASE); localStorage.setItem("dgzz_token",TOKEN);
  try{ await loadCodes(); await loadUsers(""); setConn(true); await loadDevilConfig(); if(!articleBusy)await loadEventArticle(); toast("已连接","ok"); }
  catch(e){ setConn(false); }
};

const selectedGiftCodes=new Set();
function rewardText(tag,text,className){const el=document.createElement(tag);el.textContent=String(text??'');if(className)el.className=className;return el;}
function rewardRowName(c){const group=rewardCategories[c.category]||'待确认';return group+' · '+displayReward(c);}
async function loadCodes(){
 const j=await api('GiftCodes',{});CODES=(j.codes||[]).map(c=>({...c,verification:c.verification||(c.verified?'device':'unverified'),sendable:c.sendable??c.verified,name_zh:c.name_zh||c.label}));PRESETS=j.presets||[];
 const rank=c=>!c.sendable?9:c.category==='support'?0:c.category==='ticket'?1:[31,41].includes(c.code)?2:c.category==='weapon'?3:c.category==='shield'?4:5;
 CODES.sort((a,b)=>rank(a)-rank(b)||a.code-b.code);
 const preset=$('#preset');preset.replaceChildren(new Option('选择礼包，或在下方逐项勾选',''));
 PRESETS.filter(p=>p.codes.every(code=>CODES.some(c=>c.code===code&&c.sendable))).forEach(p=>preset.appendChild(new Option(p.name+'（'+p.codes.length+' 项）',p.id)));
 renderRewardResults();renderRewardSelection();renderRewardReference();
 $('#reference-stats').textContent='共 '+CODES.length+' 条；'+CODES.filter(c=>c.sendable).length+' 条已确认可选，其中 '+CODES.filter(c=>c.verification==='device').length+' 条保留历史实机确认记录。';
}
function renderRewardResults(){
 const rows=filterRewards(CODES,{query:$('#item-search').value,category:$('#item-category').value,evidence:$('#item-evidence').value});
 $('#item-count').textContent=rows.length+' 项匹配 · 已选 '+selectedGiftCodes.size+' 项';const target=$('#item-results');target.replaceChildren();
 if(!rows.length){target.appendChild(rewardText('p','没有匹配物品','hint'));return;}
 rows.forEach(c=>{const row=document.createElement('div');row.className='reward-item';const label=document.createElement('label'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=selectedGiftCodes.has(c.code);checkbox.disabled=!!c.blocked;checkbox.setAttribute('aria-label','选择 '+displayReward(c));
  checkbox.onchange=()=>{if(checkbox.checked)selectedGiftCodes.add(c.code);else selectedGiftCodes.delete(c.code);$('#preset').value='';renderRewardSelection();$('#item-count').textContent=rows.length+' 项匹配 · 已选 '+selectedGiftCodes.size+' 项';};
  const copy=document.createElement('span');copy.className='reward-item-copy';copy.appendChild(rewardText('strong',displayReward(c)));copy.appendChild(rewardText('small',(c.name_en||'')+' · '+c.hex));label.append(checkbox,copy);row.appendChild(label);
  const meta=document.createElement('div');meta.className='reward-item-meta';const badge=rewardText('span',c.blocked?'无有效映射':rewardEvidence[c.verification]||'待实测','reward-badge '+c.verification);badge.title=c.evidence||c.context;meta.appendChild(badge);
  const detail=rewardText('button','详情','text-button');detail.type='button';detail.onclick=()=>renderRewardDetail(c);meta.appendChild(detail);row.appendChild(meta);target.appendChild(row);
 });
}
function renderRewardSelection(){
 const container=$('#reward-selection');container.hidden=selectedGiftCodes.size===0;$('#reward-selection-count').textContent='已选 '+selectedGiftCodes.size+' 项';const list=$('#reward-selected-items');list.replaceChildren();
 selectedGiftCodes.forEach(code=>{const c=CODES.find(r=>r.code===code),item=document.createElement('li');item.appendChild(rewardText('span',c?displayReward(c):'礼物码 '+code));const remove=rewardText('button','移除','text-button');remove.type='button';remove.onclick=()=>{selectedGiftCodes.delete(code);$('#preset').value='';renderRewardResults();renderRewardSelection();};item.appendChild(remove);list.appendChild(item);});
}
function renderRewardDetail(c){
 const target=$('#item-detail');target.hidden=false;target.replaceChildren();target.appendChild(rewardText('h4',displayReward(c)));if(c.name_en)target.appendChild(rewardText('p',c.name_en,'mut'));
 const info=[['分类',rewardCategories[c.category]||'待确认'],['礼物码',c.code+' / '+c.hex],['领取数量',c.quantity_label||'待确认'],['确认状态',rewardEvidence[c.verification]||'待实测']];
 if(c.level)info.push(['标称等级','Lv'+c.level]);if(c.native_id!=null)info.push(['原生物品 ID',c.native_id]);if(c.shop_sku!=null)info.push(['商店商品号',c.shop_sku]);
 const dl=document.createElement('dl');info.forEach(([key,value])=>{dl.appendChild(rewardText('dt',key));dl.appendChild(rewardText('dd',value));});target.appendChild(dl);
 if(c.effect_zh)target.appendChild(rewardText('p',c.effect_zh));if(c.effect_en)target.appendChild(rewardText('p',c.effect_en,'mut'));
 if(c.evidence)target.appendChild(rewardText('p',c.evidence,'hint'));if(c.warning)target.appendChild(rewardText('p',c.warning,'reward-warning'));
}
function renderRewardReference(){
 const rows=filterRewards(CODES,{query:$('#reference-search').value,evidence:'all'}),tbody=$('#table');tbody.replaceChildren();
 rows.forEach(c=>{const tr=document.createElement('tr');const name=document.createElement('td');name.appendChild(rewardText('strong',displayReward(c)));if(c.name_en)name.appendChild(rewardText('small',c.name_en));tr.appendChild(name);
  for(const value of [rewardCategories[c.category]||'待确认',c.code+' / '+c.hex,c.quantity_label||'待确认',c.blocked?'无有效映射':rewardEvidence[c.verification]||'待实测',c.native_id??'—',c.shop_sku??'—'])tr.appendChild(rewardText('td',value));tr.title=c.evidence||c.context||'';tbody.appendChild(tr);
 });
 if(!rows.length){const tr=document.createElement('tr'),td=rewardText('td','没有匹配物品','mut');td.colSpan=7;tr.appendChild(td);tbody.appendChild(tr);}
}
$('#item-search').oninput=renderRewardResults;$('#item-category').onchange=renderRewardResults;$('#item-evidence').onchange=renderRewardResults;
$('#reference-search').oninput=renderRewardReference;
$('#preset').onchange=()=>{const p=PRESETS.find(p=>p.id===$('#preset').value);if(!p)return;selectedGiftCodes.clear();p.codes.forEach(code=>selectedGiftCodes.add(code));renderRewardResults();renderRewardSelection();};
$('#reward-clear').onclick=()=>{selectedGiftCodes.clear();$('#preset').value='';renderRewardResults();renderRewardSelection();};
$('#export-rewards').onclick=()=>{const blob=new Blob([csvRewards(CODES)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='DGZZ物品对照表.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};

async function loadUsers(q){
  const j = await api("ListUsers",{q});
  const rows = j.users||[];
  $("#userCount").textContent = rows.length ? rows.length+" 名" : "";
  $("#users").innerHTML = rows.length ? rows.map(u=>
    `<tr class="click ${selected.has(u.uid)?'sel':''}" data-uid="${esc(u.uid)}">`+
    `<td class="pk"><input type="checkbox" class="pick" ${selected.has(u.uid)?'checked':''}></td>`+
    `<td><code>${esc(u.uid)}</code></td><td>${u.lv??1}</td><td>${esc(u.dgid)}</td><td class="mut">${ts(u.updated_at)}</td></tr>`
  ).join("") : '<tr><td colspan="5" class="mut">无结果</td></tr>';
  document.querySelectorAll("#users tr.click").forEach(tr=>{
    const uid=tr.dataset.uid, cb=tr.querySelector(".pick");
    cb.onclick=(e)=>{ e.stopPropagation(); toggle(uid, cb.checked); };
    tr.onclick=()=>{ const nv=!selected.has(uid); cb.checked=nv; toggle(uid, nv); };
  });
  syncCheckAll();
}
function toggle(uid, on){
  if(on) selected.add(uid); else selected.delete(uid);
  document.querySelectorAll("#users tr.click").forEach(tr=> tr.classList.toggle("sel", selected.has(tr.dataset.uid)));
  syncCheckAll(); refreshTarget();
}
function syncCheckAll(){
  const boxes=[...document.querySelectorAll("#users .pick")];
  const all=boxes.length && boxes.every(b=>b.checked);
  const some=boxes.some(b=>b.checked);
  const ca=$("#checkAll"); if(ca){ ca.checked=all; ca.indeterminate=!all&&some; }
}
function refreshTarget(){
  const el=$("#sel"), n=selected.size;
  if(n===0){ el.textContent="未选择"; el.className="target none"; }
  else if(n===1){ el.textContent=[...selected][0]; el.className="target"; }
  else { el.textContent=n+" 名玩家"; el.className="target"; }
  loadPending();
}
async function loadPending(){
  if(selected.size!==1){
    $("#pending").innerHTML='<tr><td colspan="5" class="mut">'+
      (selected.size>1 ? "已选 "+selected.size+" 名，逐个发放；单选可看队列" : "选择玩家后查看")+'</td></tr>';
    return;
  }
  const uid=[...selected][0];
  const j = await api("ListPresents",{uid});
  const p = j.pending||[];
  $("#pending").innerHTML = p.length ? p.map(r=>{
    const cash = r.kind==="cash";
    const tag = cash ? '<span class="kind">现金</span>' : '<span class="kind">道具</span>';
    const body = cash ? `<b>${r.code>0?"+":""}${r.code}</b>` : `<span>${esc(displayReward(CODES.find(c=>c.code===r.code))||"礼物码")}</span> <code>${hex(r.code)}</code>`;
    return `<tr><td class="mut">${r.id}</td><td>${tag}</td><td>${body}</td><td>${esc(r.note)}</td><td class="mut">${ts(r.created_at)}</td></tr>`;
  }).join("") : '<tr><td colspan="5" class="mut">队列为空</td></tr>';
}

$("#checkAll").onchange = (e) => {
  const on=e.target.checked;
  document.querySelectorAll("#users tr.click").forEach(tr=>{
    const uid=tr.dataset.uid, cb=tr.querySelector(".pick");
    cb.checked=on; if(on) selected.add(uid); else selected.delete(uid);
    tr.classList.toggle("sel", on);
  });
  refreshTarget();
};

$("#search").onclick = () => loadUsers($("#q").value.trim());
$("#q").addEventListener("keydown", e=>{ if(e.key==="Enter") loadUsers($("#q").value.trim()); });
$("#refresh").onclick = loadPending;
$("#revoke").onclick = async () => {
  if(!selected.size) return toast("先选玩家","bad");
  if(!confirm("清空 "+selected.size+" 名玩家的待发队列？")) return;
  for(const uid of selected){ await api("RevokePresents",{uid}); }
  toast("已清空 "+selected.size+" 名","ok"); loadPending();
};
function parseNum(s){s=String(s).trim();if(!/^(?:0x[0-9a-f]+|[0-9]+)$/i.test(s))return NaN;const n=Number(s);return Number.isInteger(n)&&n>=0&&n<=65535?n:NaN;}
function parseCodeList(str){const out=[];for(const token of String(str).split(',')){const v=token.trim();if(!v)continue;const pair=v.split('-');if(pair.length===2){const a=parseNum(pair[0]),b=parseNum(pair[1]);if(!Number.isFinite(a)||!Number.isFinite(b)||b<a||b-a>255)throw Error('礼物码范围无效，单段最多 256 个');for(let n=a;n<=b;n++)out.push(n);}else{const n=parseNum(v);if(!Number.isFinite(n))throw Error('无效礼物码：'+v);out.push(n);}}return out;}
function buildItemBody(){
 let codes;try{codes=[...new Set([...selectedGiftCodes,...parseCodeList($('#manual').value)])];}catch(e){toast(e.message,'bad');return null;}
 if(!codes.length){toast('先选择道具','bad');return null;}
 const blocked=codes.filter(code=>CODES.find(c=>c.code===code)?.blocked);if(blocked.length){toast('没有有效物品映射：'+blocked.join(', '),'bad');return null;}
 const unknown=codes.filter(code=>!CODES.find(c=>c.code===code)?.sendable);
 if(unknown.length&&!$('#allow-unverified').checked){$('#advanced-rewards').open=true;$('#allow-unverified').focus();toast('包含待确认物品，请先确认高级选码选项','bad');return null;}
 return {codes,note:$('#note').value.trim(),allow_unverified:unknown.length>0};
}
$("#grant").onclick = async () => {
  if(!selected.size) return toast("先选玩家","bad");
  const base=buildItemBody(); if(!base) return;
  if((selected.size>1||base.allow_unverified)&&!confirm('向 '+selected.size+' 名玩家发放 '+base.codes.length+' 项道具？'+(base.allow_unverified?'\n含待确认物品，请使用测试账号。':'')))return;
  const button=$('#grant');button.disabled=true;let ok=0,total=0;const failed=[];
  try{for(const uid of selected){try{const j=await api('GrantPresent',{uid,...base});ok++;total+=j.queued||0;}catch(e){failed.push(uid+': '+(e.message||'发放失败'));}}
   toast(ok===selected.size?'已加入 '+ok+' 名玩家礼物队列，共 '+total+' 项':'成功 '+ok+'/'+selected.size+' 名；'+failed.join('；'),ok===selected.size?'ok':'bad');loadPending();
  }finally{button.disabled=false;}

};
let coinBatch=null;
try{coinBatch=JSON.parse(localStorage.getItem('dgzz_pending_coins')||'null');}catch(_){}
function saveCoinBatch(){localStorage.setItem('dgzz_pending_coins',JSON.stringify(coinBatch));}
function coinRequestId(){return crypto.randomUUID?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,c=>(Number(c)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(c)/4).toString(16));}
$("#grantCash").onclick = async () => {
  if(!selected.size) return toast("先选玩家","bad");
  const amount=Number($("#cashAmt").value),note=$("#cashNote").value.trim();
  if(!Number.isSafeInteger(amount)||amount===0||Math.abs(amount)>1000000) return toast("数量须为整数，单次不超过 1000000","bad");
  if(selected.size>1 && !confirm("给 "+selected.size+" 名玩家各调整金币 "+amount+"？")) return;
  const button=$("#grantCash");button.disabled=true;
  const uids=[...selected].sort(),signature=JSON.stringify([BASE,uids,amount,note]);
  if(!coinBatch||coinBatch.signature!==signature){coinBatch={signature,entries:Object.fromEntries(uids.map(uid=>[uid,{id:coinRequestId(),done:false}]))};saveCoinBatch();}
  let ok=0,balance=null,error="";
  try{for(const uid of uids){
    const entry=coinBatch.entries[uid];
    if(entry.done){ok++;balance=entry.balance;continue;}
    try{const j=await api("GrantCoins",{uid,amount,note,request_id:entry.id});entry.done=true;entry.balance=j.balance;saveCoinBatch();ok++;balance=j.balance;}
    catch(e){error=e.message||"连接失败";}
  }
  if(ok===uids.length){coinBatch=null;saveCoinBatch();}
  toast(ok===uids.length?(uids.length===1?"已更新，账户金币 "+balance:"已更新 "+ok+" 名玩家"):"成功 "+ok+"/"+uids.length+"；"+error+"。可重试",ok===uids.length?"ok":"bad");
  }finally{button.disabled=false;}
};

/* 备注展开/收起 */
document.querySelectorAll(".notetog").forEach(a=>{
  a.onclick=()=>{
    const row=document.getElementById(a.dataset.row), show=row.hidden;
    row.hidden=!show; a.classList.toggle("on", show);
    if(show){ const inp=row.querySelector("input"); if(inp) inp.focus(); }
  };
});


let devilCover='',devilCoverUploading=false;
function setDevilCover(url){devilCover=url||'';const img=$('#devil-cover-preview');img.hidden=!devilCover;if(devilCover)img.src=devilCover;else img.removeAttribute('src');$('#devil-cover-empty').hidden=!!devilCover;$('#devil-cover-remove').hidden=!devilCover;}
$('#devil-cover-choose').onclick=()=>$('#devil-cover-file').click();
$('#devil-cover-remove').onclick=()=>{setDevilCover('');$('#devil-cover-message').textContent='保存活动设置后移除图片。';};
$('#devil-cover-file').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file||devilCoverUploading)return;devilCoverUploading=true;$('#devil-save').disabled=true;$('#devil-cover-choose').disabled=true;$('#devil-cover-remove').disabled=true;$('#devil-cover-message').textContent='正在上传图片…';
 try{const base64=await prepareEventImage(file),r=await api('EventImageUpload',{base64});setDevilCover(r.url);$('#devil-cover-message').textContent='图片已上传，保存活动设置后生效。';}catch(e){$('#devil-cover-message').textContent=e.message||'上传失败，请重试';}finally{devilCoverUploading=false;$('#devil-save').disabled=false;$('#devil-cover-choose').disabled=false;$('#devil-cover-remove').disabled=false;}
};
function localDateInput(iso){const d=new Date(iso);if(!Number.isFinite(d.getTime()))return '';return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);}
async function loadDevilConfig(){
  if(devilCoverUploading)return;
  const status=$("#devil-status");status.textContent="正在读取…";
  try{const r=await api("DevilAdminGet",{});$("#devil-enabled").checked=r.enabled;$("#devil-title").value=r.title;setDevilCover(r.cover_url);$("#devil-cover-message").textContent="建议使用横图，按原比例显示。上传后保存活动设置生效。";$("#devil-start").value=localDateInput(r.starts_at);$("#devil-end").value=localDateInput(r.ends_at);$("#devil-step").value=r.encounter_step;$("#devil-multiplier").value=r.multiplier;$("#devil-limit").value=r.daily_bonus_limit;$("#devil-fields").disabled=false;status.textContent=!r.enabled?"已关闭":r.active?"进行中":"未到活动时间";}catch(e){status.textContent="读取失败，请重试";}
}
$("#devil-timezone").textContent="输入时间使用本机时区："+Intl.DateTimeFormat().resolvedOptions().timeZone;
$("#devil-refresh").onclick=loadDevilConfig;
$("#devil-form").onsubmit=async e=>{
 e.preventDefault();if(devilCoverUploading||!e.currentTarget.reportValidity())return;
 const start=new Date($("#devil-start").value),end=new Date($("#devil-end").value);
 if(!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||start>=end)return toast("结束时间必须晚于开始时间","bad");
 const button=$("#devil-save");button.disabled=true;$("#devil-status").textContent="正在保存…";
 try{await api("DevilAdminSet",{enabled:$("#devil-enabled").checked,title:$("#devil-title").value.trim(),starts_at:start.toISOString(),ends_at:end.toISOString(),encounter_step:Number($("#devil-step").value),multiplier:Number($("#devil-multiplier").value),daily_bonus_limit:Number($("#devil-limit").value),cover_url:devilCover});await loadDevilConfig();toast("活动设置已保存","ok");}catch(e){$("#devil-status").textContent="保存失败，请重试";}finally{button.disabled=false;}
};

function renderEventArticle(target,article){
 target.replaceChildren();if(!article)return;
 const title=document.createElement('h2');title.textContent=article.title;target.appendChild(title);
 let line=document.createDocumentFragment(),list=null;
 function flush(a){let block;
  if(a&&['ordered','bullet'].includes(a.list)){const tag=a.list==='ordered'?'OL':'UL';if(!list||list.tagName!==tag){list=document.createElement(tag);target.appendChild(list);}block=document.createElement('li');list.appendChild(block);}
  else{list=null;block=document.createElement(a&&[1,2,3].includes(a.header)?'h'+(a.header+1):'p');target.appendChild(block);}
  if(!line.childNodes.length)line.appendChild(document.createElement('br'));block.appendChild(line);line=document.createDocumentFragment();
 }
 for(const op of article.ops||[]){const a=op.attributes||{};
  if(typeof op.insert==='string'){const parts=op.insert.split('\n');parts.forEach((part,i)=>{if(part){let el=document.createTextNode(part);for(const [attr,tag] of [['bold','strong'],['italic','em'],['underline','u']])if(a[attr]){const wrap=document.createElement(tag);wrap.appendChild(el);el=wrap;}line.appendChild(el);}if(i<parts.length-1)flush(a);});}
  else if(op.insert&&typeof op.insert.image==='string'){
   try{const url=new URL(op.insert.image);if(url.origin!=='https://ttbuviubnrmjhhpsaygs.supabase.co'||!/^\/storage\/v1\/object\/public\/event-media\/[0-9a-f-]{36}\.(png|jpg|webp)$/.test(url.pathname)||url.search||url.hash)continue;
   const img=document.createElement('img');img.src=url.href;img.alt='Activity image';img.loading='lazy';img.decoding='async';line.appendChild(img);}catch(_){}
  }
 }
 if(line.childNodes.length)flush({});
}

async function prepareEventImage(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20*1024*1024)throw Error('请选择 JPG、PNG 或 WebP，原图不超过 20 MB');
 const image=new Image(),url=URL.createObjectURL(file);
 try{await new Promise((ok,no)=>{image.onload=ok;image.onerror=()=>no(Error('无法读取图片'));image.src=url;});
  const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise(ok=>canvas.toBlob(ok,'image/webp',0.85));if(!blob||blob.size>2097152)throw Error('图片压缩后仍超过 2 MB，请缩小后重试');
  return await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(',')[1]);r.onerror=()=>no(Error('无法读取图片'));r.readAsDataURL(blob);});
 }finally{URL.revokeObjectURL(url);}
}
let articleCards=[],articleBusy=false,editingKind='notice',editingLocale='zh',editingDeleted=false;
const pendingCreates={};
const articleList=$('#article-list'),articleStatus=$('#article-status');
function contentName(kind=editingKind){return kind==='event'?'活动':'公告';}
function updateEditingContext(){const name=contentName(),locale=editingLocale==='zh'?'中文':'English';$('#article-heading').textContent=name+'编辑';$('#article-add').textContent='新增'+name;$('#article-context').textContent='正在编辑：'+name+' · '+locale+'；发布后显示在游戏面板的“'+name+'”区域。';}
updateEditingContext();
function hasArticleChanges(){return articleCards.some(c=>c.dirty||c.busy);}
function updateArticleSummary(card){card.label.textContent=(card.row.draft?.title||card.row.published?.title||'未命名图文')+' · '+(card.row.deleted_at?'已删除':card.row.published?'已发布':'草稿');}
function makeArticleCard(row,deleted){
 const card={row,dirty:false,busy:false,editor:null,element:document.createElement('details')};const el=card.element;el.className='article-card';
 const summary=document.createElement('summary');card.label=document.createElement('span');summary.appendChild(card.label);el.appendChild(summary);updateArticleSummary(card);
 const message=document.createElement('p');message.className='hint';message.setAttribute('role','status');card.message=message;
 const deleteButton=document.createElement('button');deleteButton.type='button';deleteButton.className='article-delete';deleteButton.textContent=deleted?'恢复':'删除';summary.appendChild(deleteButton);
 deleteButton.onclick=async e=>{e.preventDefault();e.stopPropagation();if(card.busy||articleBusy)return;
  if(!confirm(deleted?'恢复本篇中英文内容及原有发布状态？':'删除本篇中英文内容？游戏中会停止显示，可从“已删除”恢复。'))return;
  card.busy=true;deleteButton.disabled=true;
  try{await api('EventAdminDelete',{id:row.id,kind:editingKind,locale:editingLocale,revision:card.row.revision,restore:deleted});card.dirty=false;el.remove();articleCards=articleCards.filter(c=>c!==card);articleStatus.textContent=deleted?'已恢复':'已删除，可在已删除列表恢复';}
  catch(e){message.textContent=e.message||'操作失败';el.open=true;}
  finally{card.busy=false;deleteButton.disabled=false;}
 };
 el.appendChild(message);
 if(deleted){message.textContent='恢复会保留删除前的草稿及发布状态。';return card;}
 const body=document.createElement('div');body.className='article-card-body';el.appendChild(body);
 el.ontoggle=()=>{if(el.open&&!card.editor)setupCard();};
 function setupCard(){
  if(typeof Quill==='undefined'){message.textContent='编辑器加载失败，请刷新';return;}
  const titleLabel=document.createElement('label');titleLabel.textContent='标题';const title=document.createElement('input');title.type='text';title.maxLength=80;title.value=row.draft?.title||'';title.placeholder=contentName(row.kind)+'标题';titleLabel.appendChild(title);body.appendChild(titleLabel);
  const host=document.createElement('div');body.appendChild(host);
  const editor=new Quill(host,{theme:'snow',placeholder:'输入正文…',formats:['bold','italic','underline','header','list','image'],modules:{toolbar:{container:[[{header:[1,2,3,false]}],['bold','italic','underline'],[{list:'ordered'},{list:'bullet'}],['image','clean']],handlers:{image:()=>upload.click()}}}});card.editor=editor;
  editor.root.setAttribute('aria-label','图文正文');editor.root.setAttribute('role','textbox');editor.root.setAttribute('aria-multiline','true');editor.setContents(row.draft?.ops||[{insert:'\n'}]);
  const hint=document.createElement('p');hint.className='hint';hint.textContent='发布位置：游戏面板 → '+contentName(row.kind)+' · '+(row.locale==='zh'?'中文':'English')+'。草稿仅后台可见，中英文分别发布。';body.appendChild(hint);
  const actions=document.createElement('div');actions.className='article-actions';body.appendChild(actions);const preview=document.createElement('article');preview.className='event-article';preview.hidden=true;body.appendChild(preview);
  const value=()=>({title:title.value.trim(),ops:editor.getContents().ops});
  const dirty=()=>{card.dirty=true;message.textContent='有未保存的修改';};title.oninput=dirty;editor.on('text-change',(_,__,source)=>{if(source==='user')dirty();});
  const buttons=[];
  function lock(on){card.busy=on;editor.enable(!on);title.disabled=on;buttons.forEach(b=>b.disabled=on);deleteButton.disabled=on;}
  function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;actions.appendChild(b);buttons.push(b);return b;}
  button('预览',()=>{preview.hidden=!preview.hidden;if(!preview.hidden)renderEventArticle(preview,value());});
  async function save(action){
   if(card.busy)return;if(action==='withdraw'&&!confirm('撤下当前语言的图文？草稿会保留。'))return;
   lock(true);message.textContent='正在保存…';
   try{const r=await api('EventAdminSave',{id:row.id,kind:editingKind,locale:editingLocale,revision:card.row.revision,action,article:value()});card.row=r;if(action!=='withdraw')card.dirty=false;updateArticleSummary(card);message.textContent=action==='publish'?'已发布':action==='draft'?'草稿已保存':'已撤下';}
   catch(e){message.textContent=e.message||'保存失败';}finally{lock(false);}
  }
  button('保存草稿',()=>save('draft'));button('发布到“'+contentName(row.kind)+'”',()=>save('publish'));button('撤下',()=>save('withdraw'));
  const upload=document.createElement('input');upload.type='file';upload.accept='image/jpeg,image/png,image/webp';upload.hidden=true;body.appendChild(upload);
  upload.onchange=async()=>{const file=upload.files[0];upload.value='';if(!file||card.busy)return;const index=editor.getSelection(true)?.index??Math.max(0,editor.getLength()-1);lock(true);message.textContent='正在上传图片…';
   try{const base64=await prepareEventImage(file),r=await api('EventImageUpload',{base64});editor.enable(true);editor.insertEmbed(index,'image',r.url,'user');editor.insertText(index+1,'\n','user');editor.setSelection(index+2,0);dirty();}catch(e){message.textContent=e.message||'图片上传失败';}finally{lock(false);}
  };
 }
 return card;
}
async function loadEventArticle(){
 if(articleBusy||articleCards.some(c=>c.busy)){$('#article-kind').value=editingKind;$('#article-locale').value=editingLocale;$('#article-deleted').checked=editingDeleted;return;}
 if(hasArticleChanges()&&!confirm('切换或重新读取会放弃未保存修改，继续吗？')){$('#article-kind').value=editingKind;$('#article-locale').value=editingLocale;$('#article-deleted').checked=editingDeleted;return;}
 const key={kind:$('#article-kind').value,locale:$('#article-locale').value},deleted=$('#article-deleted').checked;articleBusy=true;articleStatus.textContent='正在读取…';
 $('#article-add').disabled=true;$('#article-kind').disabled=true;$('#article-locale').disabled=true;$('#article-deleted').disabled=true;
 try{const r=await api('EventAdminList',{...key,deleted});editingKind=key.kind;editingLocale=key.locale;editingDeleted=deleted;updateEditingContext();articleList.replaceChildren();articleCards=(r.items||[]).map(row=>makeArticleCard(row,deleted));articleCards.forEach(c=>articleList.appendChild(c.element));articleStatus.textContent=articleCards.length+' 篇'+(deleted?'已删除':'');if(!articleCards.length){const empty=document.createElement('p');empty.className='hint';empty.textContent=deleted?'暂无已删除内容':'暂无'+contentName()+'，点击“新增'+contentName()+'”开始。';articleList.appendChild(empty);}}
 catch(e){articleStatus.textContent=e.message||'读取失败';$('#article-kind').value=editingKind;$('#article-locale').value=editingLocale;$('#article-deleted').checked=editingDeleted;}
 finally{articleBusy=false;$('#article-add').disabled=deleted;$('#article-kind').disabled=false;$('#article-locale').disabled=false;$('#article-deleted').disabled=false;}
}
$('#article-kind').onchange=loadEventArticle;$('#article-locale').onchange=loadEventArticle;$('#article-deleted').onchange=loadEventArticle;$('#article-reload').onclick=loadEventArticle;
$('#article-add').onclick=async()=>{
 if(articleBusy||articleCards.some(c=>c.busy))return;articleBusy=true;$('#article-add').disabled=true;
 const id=pendingCreates[editingKind]||(pendingCreates[editingKind]=crypto.randomUUID());
 try{await api('EventAdminCreate',{id,kind:editingKind,locale:editingLocale});const r=await api('EventAdminGet',{id,kind:editingKind,locale:editingLocale});delete pendingCreates[editingKind];const existing=articleCards.find(c=>c.row.id===id);if(existing){existing.element.open=true;}else{const card=makeArticleCard(r,false);if(!articleCards.length)articleList.replaceChildren();articleCards.push(card);articleList.appendChild(card.element);card.element.open=true;card.element.scrollIntoView({block:'nearest'});}articleStatus.textContent=articleCards.length+' 篇';}
 catch(e){articleStatus.textContent=e.message||'新增失败，可重试';}finally{articleBusy=false;$('#article-add').disabled=false;}
};
window.addEventListener('beforeunload',e=>{if(hasArticleChanges()){e.preventDefault();e.returnValue='';}});

if(BASE&&TOKEN){ loadCodes().then(()=>loadUsers("")).then(()=>{setConn(true);return Promise.all([loadDevilConfig(),articleBusy?Promise.resolve():loadEventArticle()]);}).catch(()=>{}); }

async function openWorkspace(name){
 const article=name==='notice'||name==='event';
 if(article&&name!==editingKind){
  if(articleBusy||articleCards.some(c=>c.busy))return;
  if(BASE&&TOKEN){$('#article-kind').value=name;await loadEventArticle();if(editingKind!==name)return;}
  else{if(hasArticleChanges()&&!confirm('切换会放弃未保存修改，继续吗？'))return;editingKind=name;$('#article-kind').value=name;updateEditingContext();articleCards=[];articleList.replaceChildren();}
 }
 document.querySelectorAll('[data-workspace]').forEach(el=>{const on=el.dataset.workspace===name;el.classList.toggle('active',on);if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 document.querySelectorAll('[data-view]').forEach(el=>{el.hidden=el.dataset.view!==(article?'content':name);});
 const headings={rewards:'玩家与奖励',notice:'公告管理',event:'活动图文',devil:'Devil 活动'};
 $('#workspace-title').textContent=headings[name]||headings.rewards;
 history.replaceState(null,'','#'+name);
}
document.querySelectorAll('[data-workspace]').forEach(el=>el.onclick=()=>openWorkspace(el.dataset.workspace));
const initialWorkspace=location.hash.slice(1);if(['rewards','notice','event','devil'].includes(initialWorkspace))openWorkspace(initialWorkspace);
