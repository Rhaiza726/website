/* ---------- ui bits ---------- */
function courtSvg(c1='#2B6CB0',c2='#1E4F8A',ball=true){
 return `<svg class="courtfig" viewBox="0 0 560 300" role="img" aria-label="Top-down pickleball court"><rect width="560" height="300" fill="#16345A"/><rect x="16" y="30" width="528" height="240" fill="${c1}"/><rect x="190" y="30" width="180" height="240" fill="${c2}"/><g fill="none" stroke="#fff" stroke-width="3"><rect x="16" y="30" width="528" height="240"/><line x1="190" y1="30" x2="190" y2="270"/><line x1="370" y1="30" x2="370" y2="270"/><line x1="16" y1="150" x2="190" y2="150"/><line x1="370" y1="150" x2="544" y2="150"/></g><rect x="277" y="22" width="6" height="256" fill="#fff" opacity=".9"/><rect x="277" y="22" width="6" height="256" fill="none" stroke="#10243E" stroke-dasharray="4 4" opacity=".5"/>${ball?'<g transform="translate(110 92)"><circle r="16" fill="#DDEB3C" stroke="#10243E" stroke-width="2"/><g fill="#10243E"><circle cx="-5" cy="-5" r="2.4"/><circle cx="5" cy="-4" r="2.4"/><circle cx="0" cy="5" r="2.4"/></g></g>':''}</svg>`;
}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>t.style.display='none',3200)}
function phone(msgs,label='Sample messages – nothing is actually sent'){
 return `<div class="phone"><div class="scr"><div class="top"><b>ForSure Courts</b><span>Text message</span></div><div class="msgs"><div class="samp">${label}</div>${msgs.map(m=>`<div class="bub">${esc(m.text)}<time>${m.time}</time></div>`).join('')}</div></div></div>`;
}
function summary(b,withTotal=true){
 const c=court(b.courtId);
 return `<dl class="kv"><dt>Court</dt><dd>${c.name} (${c.type})</dd><dt>Date</dt><dd>${fmtDate(b.date)}</dd><dt>Time</dt><dd>${rng(b.start,b.dur)}</dd><dt>Duration</dt><dd>${b.dur} hour${b.dur>1?'s':''}</dd>${b.name?`<dt>Name</dt><dd>${esc(b.name)}</dd>`:''}${b.phone?`<dt>Mobile</dt><dd>${esc(b.phone)}</dd>`:''}<dt>Add-ons</dt><dd>${[b.paddle&&'Paddles',b.balls&&'Balls'].filter(Boolean).join(', ')||'None'}</dd>${withTotal?`<dt>Total (pay at venue)</dt><dd>${peso(total(b))}</dd>`:''}</dl>`;
}
function slotGrid(date,mode){
 const d=S.draft;
 const head=`<tr><th class="rh"></th>${HOURS.map(h=>`<th>${hl(h).replace(':00','')}</th>`).join('')}</tr>`;
 const rows=S.courts.map(c=>{
  let tds='';
  if(mode==='admin'){
   for(let i=0;i<HOURS.length;){
    const h=HOURS[i];const b=bookingAt(c.id,date,h,true);
    if(!c.open){tds+=`<td><button class="cell blocked" disabled>Closed</button></td>`;i++;continue}
    if(b&&b.start===h){const span=Math.min(b.dur,22-h);tds+=`<td colspan="${span}"><button class="cell a-${b.status}" data-a="viewbk" data-v="${b.ref}">${esc(b.name)}<br><span class="cap">${STATUS_LABEL[b.status]}</span></button></td>`;i+=span;continue}
    if(b){i++;continue}
    tds+=`<td><button class="cell ${isPast(date,h)?'past':'open'}" disabled>${isPast(date,h)?'':'Open'}</button></td>`;i++;
   }
  }else{
   tds=HOURS.map(h=>{
    const st=slotState(c.id,date,h);const sel=d.courtId===c.id&&d.date===date&&d.start!==null&&h>=d.start&&h<d.start+d.dur;
    if(sel)return `<td><button class="cell sel" data-a="pick" data-c="${c.id}" data-h="${h}" aria-label="${c.name} ${hl(h)} selected">✓</button></td>`;
    const txt={open:'Open',taken:'Reserved',past:'',blocked:'Closed'}[st];
    return `<td><button class="cell ${st}" ${st==='open'?`data-a="pick" data-c="${c.id}" data-h="${h}"`:'disabled'} aria-label="${c.name} ${hl(h)} ${st}">${txt}</button></td>`;
   }).join('');
  }
  return `<tr><th class="rh" scope="row">${c.name}</th>${tds}</tr>`;
 }).join('');
 return `<div class="sg" tabindex="0" aria-label="Court availability grid, scrolls sideways"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
}
function dateStrip(sel,action){
 return `<div class="chips">${Array.from({length:7},(_,i)=>addDays(TODAY,i)).map(d=>`<button class="chip" aria-pressed="${d===sel}" data-a="${action}" data-v="${d}">${i0(d)}</button>`).join('')}</div>`;
}
const i0=d=>d===TODAY?'Today':fmtDate(d);

