/* ---------- admin ---------- */
function adminShell(inner){
 const items=[['dashboard','Dashboard'],['calendar','Calendar'],['reservations','Reservations'],['courts','Courts'],['openplay','Open Play'],['smslog','SMS log']];
 return `<div class="adm"><nav class="side" aria-label="Admin">${items.map(([k,l])=>`<button data-a="adm" data-v="${k}" ${S.adminView===k?'aria-current="page"':''}>${l}${k==='reservations'?` (${S.bookings.filter(b=>b.status==='pending').length})`:''}</button>`).join('')}</nav><main class="main stack" style="--s:24px">${inner}</main></div>`;
}
function admDash(){
 const B=S.bookings;const cnt=s=>B.filter(b=>b.status===s).length;const pend=B.filter(b=>b.status==='pending');
 const income=B.filter(b=>['confirmed','completed'].includes(b.status)).reduce((a,b)=>a+total(b),0);
 const cost=18500;
 const week=Array.from({length:7},(_,i)=>addDays(TODAY,i));
 const cap=S.courts.length*HOURS.length*7;
 const used=B.filter(b=>week.includes(b.date)&&['pending','confirmed'].includes(b.status)).reduce((a,b)=>a+b.dur,0);
 const stats=['confirmed','pending','completed','cancelled'];const colors={confirmed:'#1F9D63',pending:'#E5A100',completed:'#6C7F9C',cancelled:'#D64545'};
 let acc=0;const seg=stats.map(s=>{const p=cnt(s)/B.length*100;const r=`${colors[s]} ${acc}% ${acc+p}%`;acc+=p;return r}).join(',');
 const util=[['Mon',48],['Tue',55],['Wed',50],['Thu',62],['Fri',74],['Sat',92],['Sun',70]];
 return `<div><h2>Dashboard</h2><p class="muted small">KPIs update from the sample bookings. Utilization chart and operating cost are sample figures.</p></div>
 <div class="grid g4"><div class="card kpi"><span class="muted small">Total bookings</span><b>${B.length}</b><span class="d">${cnt('confirmed')} confirmed</span></div><div class="card kpi"><span class="muted small">Pending approvals</span><b>${pend.length}</b><span class="small muted">Need a decision</span></div><div class="card kpi"><span class="muted small">Court use, next 7 days</span><b>${Math.round(used/cap*100)}%</b><span class="small muted">${used} of ${cap} court-hours</span></div><div class="card kpi"><span class="muted small">Income (confirmed + done)</span><b>${peso(income)}</b><span class="small muted">Sample cost ${peso(cost)} · Net ${peso(income-cost)}</span></div></div>
 <div class="grid g2"><div class="card"><h4>Court utilization by weekday (sample)</h4><div class="bars">${util.map(([d,v])=>`<div class="${d==='Sat'?'hi':''}"><span style="height:${v}%"></span>${d}</div>`).join('')}</div></div>
 <div class="card"><h4>Bookings by status</h4><div class="row" style="margin-top:16px;gap:24px"><div class="donut" style="background:conic-gradient(${seg})" role="img" aria-label="Bookings by status"></div><div class="stack" style="--s:6px">${stats.map(s=>`<div class="row" style="gap:8px"><i style="width:12px;height:12px;border-radius:3px;background:${colors[s]}"></i>${STATUS_LABEL[s]}: <b>${cnt(s)}</b></div>`).join('')}</div></div></div></div>
 <div class="card stack"><div class="row between"><h4>Needs approval</h4><button class="btn btn-ghost btn-sm" data-a="adm" data-v="reservations">See all</button></div>${pend.length?`<div class="tw"><table class="t"><tbody>${pend.slice(0,4).map(b=>`<tr><td><b>${b.ref}</b></td><td>${esc(b.name)}</td><td>${court(b.courtId).name} · ${fmtDate(b.date)} · ${rng(b.start,b.dur)}</td><td style="text-align:right"><button class="btn btn-primary btn-sm" data-a="approve" data-v="${b.ref}">Approve</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">All caught up. No pending requests.</p>'}</div>`;
}
function admCal(){
 return `<div class="row between"><div><h2>Unified calendar</h2><p class="muted small">All courts in one view. Select a booking for details.</p></div><div class="row"><button class="btn btn-ghost btn-sm" data-a="caldate" data-v="-1">Previous day</button><b>${fmtDate(S.adminDate)}</b><button class="btn btn-ghost btn-sm" data-a="caldate" data-v="1">Next day</button><button class="btn btn-ghost btn-sm" data-a="caldate" data-v="0">Today</button></div></div>
 <div class="legend"><span><i style="background:var(--pend-bg)"></i>Pending</span><span><i style="background:var(--ok-bg)"></i>Confirmed</span><span><i style="background:var(--done-bg)"></i>Completed</span><span><i style="background:repeating-linear-gradient(45deg,var(--done-bg),var(--done-bg) 3px,var(--bg) 3px,var(--bg) 6px)"></i>Closed</span></div>${slotGrid(S.adminDate,'admin')}`;
}
function resRows(){
 const q=S.q.trim().toLowerCase();
 const rows=S.bookings.filter(b=>(S.rf==='all'||b.status===S.rf)&&(!q||(b.ref+b.name+b.phone).toLowerCase().includes(q))).sort((a,b)=>(b.date+b.start).localeCompare(a.date+a.start));
 if(!rows.length)return `<tr><td colspan="7" style="text-align:center" class="muted">No reservations match. Clear the search or choose another status.</td></tr>`;
 return rows.map(b=>`<tr><td><b>${b.ref}</b></td><td>${esc(b.name)}<br><span class="small muted">${esc(b.phone)}</span></td><td>${court(b.courtId).name}</td><td>${fmtDate(b.date)}<br><span class="small muted">${rng(b.start,b.dur)}</span></td><td>${peso(total(b))}</td><td>${badge(b.status)}</td><td><div class="row" style="gap:6px;flex-wrap:nowrap">${b.status==='pending'?`<button class="btn btn-primary btn-sm" data-a="approve" data-v="${b.ref}">Approve</button><button class="btn btn-danger btn-sm" data-a="decline" data-v="${b.ref}">Decline</button>`:''}${b.status==='confirmed'?`<button class="btn btn-ghost btn-sm" data-a="remind" data-v="${b.ref}">Send reminder</button><button class="btn btn-danger btn-sm" data-a="decline" data-v="${b.ref}">Cancel</button><button class="btn btn-ghost btn-sm" data-a="complete" data-v="${b.ref}">Mark done</button>`:''}</div></td></tr>`).join('');
}
function admRes(){
 return `<div><h2>Reservations</h2><p class="muted small">Approving or cancelling a booking logs a simulated SMS.</p></div>
 <div class="row"><div style="flex:1;min-width:220px"><label class="lbl" for="q" style="position:absolute;left:-9999px">Search</label><input type="search" id="q" data-f="q" placeholder="Search name, mobile or reference" value="${esc(S.q)}"></div><div class="chips" role="group" aria-label="Status filter">${[['all','All'],['pending','Pending'],['confirmed','Confirmed'],['completed','Completed'],['cancelled','Cancelled']].map(([k,l])=>`<button class="chip" aria-pressed="${S.rf===k}" data-a="rf" data-v="${k}">${l}</button>`).join('')}</div></div>
 <div class="tw"><table class="t" style="min-width:980px"><thead><tr><th>Ref</th><th>Customer</th><th>Court</th><th>Schedule</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody id="resbody">${resRows()}</tbody></table></div>`;
}
function admCourts(){
 return `<div><h2>Courts &amp; availability</h2><p class="muted small">Closing a court blocks it in the customer grid right away.</p></div><div class="grid g2">${S.courts.map(c=>`<div class="card stack" style="--s:12px"><div class="row between"><h4>${c.name}</h4><span class="badge ${c.open?'b-open':'b-closed'}">${c.open?'Open for booking':'Closed'}</span></div><p class="muted small">${c.surface}</p><div class="row between"><label for="p${c.id}">Rate per hour</label><div class="row" style="gap:6px"><span>₱</span><input type="number" id="p${c.id}" style="width:100px" min="0" step="50" value="${c.price}" data-f="price" data-c="${c.id}"></div></div><div class="row between"><span id="tl${c.id}">Available for booking</span><button class="toggle" role="switch" aria-checked="${c.open}" aria-labelledby="tl${c.id}" data-a="toggle" data-v="${c.id}"></button></div></div>`).join('')}</div>`;
}
function admSms(){
 return `<div><h2>SMS notification log</h2><div class="info" style="margin-top:8px">Simulated. These rows show what the system would send. No message leaves this prototype.</div></div><div class="tw"><table class="t" style="min-width:860px"><thead><tr><th>Time</th><th>To</th><th>Event</th><th>Ref</th><th>Message</th><th>Status</th></tr></thead><tbody>${S.sms.map(m=>`<tr><td>${m.time}</td><td>${esc(m.to)}</td><td>${SMS_META[m.type]}</td><td>${m.ref}</td><td class="small" style="max-width:420px">${esc(m.text)}</td><td><span class="badge b-pending">${m.status}</span></td></tr>`).join('')}</tbody></table></div>`;
}
function modal(){
 const m=S.modal;if(!m)return '';
 const b=S.bookings.find(x=>x.ref===m.ref);if(!b)return '';
 if(m.type==='cancel')return `<div class="ov"><div class="modal stack" role="dialog" aria-modal="true" aria-labelledby="mt"><h3 id="mt">Cancel ${b.ref}?</h3>${summary(b,false)}<p class="muted small">The slot becomes available to others and you'll get a cancellation text.</p><div class="row between"><button class="btn btn-ghost" data-a="closem">Keep booking</button><button class="btn btn-danger" data-a="cancelnow" data-v="${b.ref}">Cancel booking</button></div></div></div>`;
 return `<div class="ov"><div class="modal stack" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="row between"><h3 id="mt">${b.ref}</h3>${badge(b.status)}</div>${summary(b)}<div class="row">${b.status==='pending'?`<button class="btn btn-primary btn-sm" data-a="approve" data-v="${b.ref}">Approve</button><button class="btn btn-danger btn-sm" data-a="decline" data-v="${b.ref}">Decline</button>`:''}${b.status==='confirmed'?`<button class="btn btn-ghost btn-sm" data-a="remind" data-v="${b.ref}">Send reminder</button><button class="btn btn-danger btn-sm" data-a="decline" data-v="${b.ref}">Cancel</button>`:''}<button class="btn btn-ghost btn-sm" data-a="closem" style="margin-left:auto">Close</button></div></div></div>`;
}

