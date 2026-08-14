
const D=window.NSJ_DATA;
const members=D.members;
const by=(arr,key)=>arr.reduce((a,x)=>{const k=x[key]||'미분류';a[k]=(a[k]||0)+1;return a},{});
const regionCounts=by(members,'지역'), corpsCounts=by(members,'영문'), roleCounts=by(members,'직분');
const officers=members.filter(x=>x['남서울지방정교회 임원']);
const unique=a=>[...new Set(a.filter(Boolean))];

function setText(id,v){document.getElementById(id).textContent=v}
function chart(el,obj){
  const max=Math.max(...Object.values(obj),1);
  el.innerHTML=Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(([k,v])=>
   `<div class="barrow"><span>${k}</span><div class="bar"><span style="width:${v/max*100}%"></span></div><b>${v}</b></div>`).join('');
}
function maskPhone(p){if(!p)return '-';return p.replace(/(\d{3})-\d{3,4}-(\d{4})/,'$1-****-$2')}
function show(page){
 document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
 document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
 document.getElementById(page).classList.add('active');
 document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.page));

setText('kMembers',members.length);
setText('kCorps',Object.keys(corpsCounts).length);
setText('kRegions',Object.keys(regionCounts).length);
setText('kOfficers',officers.length);
chart(document.getElementById('regionChart'),regionCounts);
chart(document.getElementById('corpsChart'),corpsCounts);
chart(document.getElementById('roleChart'),roleCounts);

const regionSummary=document.getElementById('regionSummary');
regionSummary.innerHTML=Object.entries(regionCounts).sort((a,b)=>b[1]-a[1]).map(([r,n])=>{
 const cs=unique(members.filter(x=>x['지역']===r).map(x=>x['영문']));
 return `<tr><td><b>${r}</b></td><td>${cs.length}</td><td>${n}</td><td>${cs.join(', ')}</td></tr>`
}).join('');

const corpsTable=document.getElementById('corpsTable');
corpsTable.innerHTML=Object.entries(corpsCounts).sort((a,b)=>b[1]-a[1]).map(([c,n],i)=>{
 const first=members.find(x=>x['영문']===c);
 return `<tr><td>${i+1}</td><td><b>${c}</b></td><td>${first['지역']}</td><td>${n}</td><td>${first['담임사관']||'-'}</td><td>${first['목양사관']||'-'}</td></tr>`
}).join('');

const officerList=document.getElementById('officerList');
officerList.innerHTML=officers.map(x=>`<div class="officer"><span class="role">${x['남서울지방정교회 임원']}</span><strong>${x['성명']}</strong><span class="muted">${x['영문']} · ${x['직분']}</span></div>`).join('');

const regionFilter=document.getElementById('regionFilter');
const corpsFilter=document.getElementById('corpsFilter');
unique(members.map(x=>x['지역'])).sort().forEach(x=>regionFilter.insertAdjacentHTML('beforeend',`<option>${x}</option>`));
unique(members.map(x=>x['영문'])).sort().forEach(x=>corpsFilter.insertAdjacentHTML('beforeend',`<option>${x}</option>`));

function renderMembers(){
 const q=document.getElementById('search').value.trim().toLowerCase();
 const r=regionFilter.value,c=corpsFilter.value;
 const filtered=members.filter(x=>(!r||x['지역']===r)&&(!c||x['영문']===c)&&(!q||Object.values(x).some(v=>String(v||'').toLowerCase().includes(q))));
 document.getElementById('memberCount').textContent=`${filtered.length}명`;
 document.getElementById('memberRows').innerHTML=filtered.map(x=>`<tr>
 <td>${x['번호']}</td><td>${x['지역']}</td><td><b>${x['영문']}</b></td><td>${x['직분']||'-'}</td><td>${x['성명']}</td>
 <td class="phone" data-phone="${x['연락처']||''}">${maskPhone(x['연락처'])}</td>
 <td>${x['남서울지방정교회 임원']?`<span class="tag">${x['남서울지방정교회 임원']}</span>`:'-'}</td></tr>`).join('');
}
['search','regionFilter','corpsFilter'].forEach(id=>document.getElementById(id).addEventListener(id==='search'?'input':'change',renderMembers));
document.getElementById('showPhones').onclick=()=>{
 document.querySelectorAll('.phone').forEach(td=>td.textContent=td.dataset.phone||'-');
};
renderMembers();

document.getElementById('businessList').innerHTML=D.business.map(e=>`<div class="event"><b>${e.month||'계속'}</b><div>${e.detail.replace(/\n/g,'<br>')}</div>${e.note?`<small>비고: ${e.note.replace(/\n/g,' · ')}</small>`:''}</div>`).join('');
document.getElementById('orgRows').innerHTML=D.organizations.map(o=>`<tr><td>${o['지역']}</td><td><b>${o['영문']}</b></td><td>${o['담임사관']||'-'}</td><td>${o['목양사관']||'-'}</td><td>${o['연락처']||'-'}</td></tr>`).join('');

document.getElementById('exportCsv').onclick=()=>{
 const cols=['번호','지역','영문','직분','성명','연락처','남서울지방정교회 임원','담임사관','목양사관'];
 const csv=[cols.join(','),...members.map(x=>cols.map(k=>`"${String(x[k]||'').replaceAll('"','""')}"`).join(','))].join('\n');
 const b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
 a.href=URL.createObjectURL(b);a.download='남서울지방정교회_회원명단.csv';a.click();URL.revokeObjectURL(a.href);
};

if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{})}
