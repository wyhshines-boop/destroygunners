export const rewardCategories={weapon:'武器',shield:'护盾',upgrade:'强化零件',support:'支援消耗品',ticket:'入场券',unknown:'待确认'};
export const rewardEvidence={device:'实机已确认',data:'数据已确认',unverified:'待实测'};
export function filterRewards(items,{query='',category='',evidence='confirmed'}={}){
 const q=query.trim().toLowerCase();return items.filter(c=>(!category||c.category===category)&&(evidence==='all'||evidence==='confirmed'?(evidence==='all'||c.sendable):c.verification===evidence)&&(!q||[c.name_zh,c.name_en,c.label,c.code,c.hex,c.native_id,c.shop_sku].some(v=>String(v??'').toLowerCase().includes(q))));
}
export function displayReward(c){return c?(c.name_zh||c.label||String(c.code))+(c.quantity>1?' ×'+c.quantity:''):'未知物品';}
export function csvRewards(items){
 const fields=[['名称','name_zh'],['英文名','name_en'],['分类','category'],['礼物码','code'],['十六进制','hex'],['数量','quantity_label'],['确认状态','verification'],['原生物品ID','native_id'],['商店商品号','shop_sku'],['说明','effect_zh']];
 const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';
 return '\ufeff'+[fields.map(f=>cell(f[0])).join(','),...items.map(c=>fields.map(([,k])=>cell(k==='category'?rewardCategories[c[k]]:k==='verification'?rewardEvidence[c[k]]:c[k])).join(','))].join('\r\n');
}
