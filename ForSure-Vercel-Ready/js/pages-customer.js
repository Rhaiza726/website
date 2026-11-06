/* ---------- customer pages ---------- */
function pgHome(){
 return `<section class="hero"><div class="wrap"><div><h1>Book a court. We'll text you the rest.</h1><p class="lead">Pick an open hour, send your request, and get a text when it's confirmed and again before you play. No more double-bookings or forgotten slots.</p><div class="ctas"><button class="btn btn-primary" data-a="book">Book a rental</button><button class="btn btn-secondary" data-a="go" data-v="courts">View availability</button></div></div><div>${courtSvg()}</div></div></section>
 <section class="pad-sm wrap"><h3 style="margin-bottom:16px">Open today</h3><div class="quick">${S.courts.map(c=>{const n=nextOpen(c.id);return `<button data-a="quick" data-v="${c.id}" ${n===null?'disabled':''}><b>${c.name}</b><span class="small muted">${c.type} · ${peso(c.price)}/hr</span><br><span class="badge ${n===null?'b-cancelled':'b-open'}" style="margin-top:8px">${n===null?'Fully booked':'Next open '+hl(n)}</span></button>`}).join('')}</div></section>
 <section class="band"><div class="wrap pad"><h2 style="margin-bottom:32px">How a rental works</h2><div class="steps"><div><h4>Pick a time</h4><p class="muted">Choose an open hour on the court grid. Taken slots are locked, so two groups can't hold the same hour.</p></div><div><h4>We confirm</h4><p class="muted">Your request is pending until the front desk approves it. You get a text the moment it changes.</p></div><div><h4>Get reminded</h4><p class="muted">A reminder text arrives before your game. If anything changes, you'll hear about it by SMS.</p></div></div></div></section>
 <section class="wrap pad"><div class="grid g3"><div class="card"><h4>Real-time availability</h4><p class="muted" style="margin-top:8px">See every court and hour at once, then book in under a minute.</p></div><div class="card"><h4>Text updates</h4><p class="muted" style="margin-top:8px">Received, confirmed, reminder, cancelled – each step has its own message.</p></div><div class="card"><h4>Pay at the venue</h4><p class="muted" style="margin-top:8px">Reserve now and settle at the front desk. Paddle and ball rentals are available.</p></div></div></section>`;
}
function pgCourts(){
 const f=S.filter;const showC=f!=='equipment';
 const list=S.courts.filter(c=>f==='all'||f==='equipment'||c.type.toLowerCase()===f);
 return `<div class="wrap pad-sm stack" style="--s:24px"><div><h2>Courts &amp; equipment</h2><p class="muted" style="margin-top:8px">Hourly rates, pay at the venue.</p></div>
 <div class="chips" role="group" aria-label="Filter">${[['all','All courts'],['covered','Covered'],['indoor','Indoor'],['equipment','Equipment']].map(([k,l])=>`<button class="chip" aria-pressed="${f===k}" data-a="filter" data-v="${k}">${l}</button>`).join('')}</div>
 ${showC?`<div class="grid g2">${list.map(c=>{const n=openCount(c.id,TODAY);return `<article class="card ccard">${courtSvg(c.c1,c.c2,false)}<div class="body"><div class="row between"><h3>${c.name}</h3>${!c.open?'<span class="badge b-closed">Closed for maintenance</span>':n?`<span class="badge b-open">${n} open hours today</span>`:'<span class="badge b-cancelled">Fully booked today</span>'}</div><p class="muted">${c.surface}</p><div class="tags"><span class="tag">${c.type}</span><span class="tag">Max 4 players</span><span class="tag">1–3 hr bookings</span></div><div class="row between" style="margin-top:auto;padding-top:8px"><div class="price">${peso(c.price)}<small> / hour</small></div><div class="row"><button class="btn btn-ghost btn-sm" data-a="detail" data-v="${c.id}">Details</button><button class="btn btn-primary btn-sm" data-a="quick" data-v="${c.id}" ${c.open?'':'disabled'}>Reserve</button></div></div></div></article>`}).join('')}</div>`:''}
 ${f==='equipment'||f==='all'?`<h3>Rental equipment</h3><div class="grid g2">${Object.values(ADDON).map(a=>`<div class="card row between"><div><h4>${a.label}</h4><p class="muted small">Add to any court booking. Returned at the front desk.</p></div><div class="price">${peso(a.price)}<small> / booking</small></div></div>`).join('')}</div>`:''}</div>`;
}
function pgDetail(){
 const c=court(S.detailId);
 return `<div class="wrap pad-sm stack" style="--s:24px"><button class="btn btn-ghost btn-sm" data-a="go" data-v="courts">Back to courts</button>
 <div class="grid g2" style="align-items:start"><div class="stack">${courtSvg(c.c1,c.c2)}<div class="card"><h4>Rates</h4><table class="t" style="min-width:0;margin-top:8px"><tbody>${[1,2,3].map(n=>`<tr><td>${n} hour${n>1?'s':''}</td><td style="text-align:right"><b>${peso(c.price*n)}</b></td></tr>`).join('')}</tbody></table></div></div>
 <div class="stack"><div class="row between"><h2>${c.name}</h2>${c.open?'<span class="badge b-open">Available</span>':'<span class="badge b-closed">Closed</span>'}</div><p class="muted">${c.surface}. Net, lines and lighting included. Up to 4 players.</p>
 <div class="card"><h4>Rental conditions</h4><ul class="muted" style="padding-left:20px;margin:8px 0 0"><li>Arrive 10 minutes early with your booking reference.</li><li>Requests stay pending until the front desk confirms them.</li><li>Pay at the venue before play.</li><li>Cancel at least 2 hours before your start time.</li></ul></div>
 <div><h4 style="margin-bottom:8px">Open hours – next 7 days</h4><div class="chips">${Array.from({length:7},(_,i)=>addDays(TODAY,i)).map(d=>`<button class="chip" data-a="daypick" data-c="${c.id}" data-v="${d}" ${c.open?'':'disabled'}>${i0(d)}<br><span class="cap">${openCount(c.id,d)} open</span></button>`).join('')}</div></div>
 <button class="btn btn-primary" data-a="quick" data-v="${c.id}" ${c.open?'':'disabled'}>Reserve ${c.name}</button></div></div></div>`;
}
function pgBook(){
 const d=S.draft;const c=court(d.courtId);const e=S.errors;
 const stepper=`<div class="stepper" aria-label="Booking steps">${['Choose a time','Your details','Review & submit'].map((l,i)=>`<div class="${S.step===i+1?'on':S.step>i+1?'done':''}">${i+1}. ${l}</div>`).join('')}</div>`;
 let body='';
 if(S.step===1){
  const sel=d.start!==null;
  body=`<div class="stack"><div><div class="lbl" style="margin-bottom:8px">Date</div>${dateStrip(d.date,'date')}</div>
  <div class="legend"><span><i style="background:var(--ok-bg)"></i>Open</span><span><i style="background:var(--res-bg)"></i>Reserved</span><span><i style="background:var(--navy)"></i>Your pick</span><span><i style="background:var(--done-bg)"></i>Past / closed</span></div>
  ${slotGrid(d.date,'cust')}
  <div class="sumbar"><div><div class="cap muted">Selected</div><b style="font-size:18px">${sel?`${c.name} · ${hl(d.start)}`:'Tap an open slot'}</b></div>
  <div class="dur" role="group" aria-label="Duration">${[1,2,3].map(n=>`<button class="chip" aria-pressed="${d.dur===n}" data-a="dur" data-v="${n}" ${sel&&!durOk(d.courtId,d.date,d.start,n)?'disabled':''}>${n} hr</button>`).join('')}</div>
  <div class="row"><b class="price">${sel?peso(total(d)):'—'}</b><button class="btn btn-primary" data-a="next" ${sel?'':'disabled'}>Continue</button></div></div>${e.slot?`<p class="err" style="display:block">${e.slot}</p>`:''}</div>`;
 }else if(S.step===2){
  const f=(k,l,inp,hint='')=>`<div class="field ${e[k]?'bad':''}"><label for="f-${k}">${l}</label>${inp}<span class="err" id="e-${k}">${e[k]||''}</span>${hint?`<span class="small muted">${hint}</span>`:''}</div>`;
  body=`<div class="card stack" style="max-width:640px">${f('name','Full name',`<input type="text" id="f-name" data-f="name" value="${esc(d.name)}" autocomplete="name">`)}
  ${f('phone','Mobile number',`<input type="tel" id="f-phone" data-f="phone" value="${esc(d.phone)}" placeholder="09XX XXX XXXX" autocomplete="tel">`,'We send booking updates to this number by SMS.')}
  ${f('players','Number of players',`<input type="number" id="f-players" data-f="players" min="1" max="4" value="${d.players}">`)}
  <div class="stack" style="--s:8px"><div class="lbl">Rental equipment (optional)</div>${Object.entries(ADDON).map(([k,a])=>`<label class="check"><input type="checkbox" data-f="${k}" ${d[k]?'checked':''}><span>${a.label}<br><span class="small muted">+${peso(a.price)}</span></span></label>`).join('')}</div>
  ${f('notes','Notes for the front desk (optional)',`<textarea id="f-notes" data-f="notes" rows="2">${esc(d.notes)}</textarea>`)}
  <div class="row between"><button class="btn btn-ghost" data-a="back">Back</button><button class="btn btn-primary" data-a="next">Review booking</button></div></div>`;
 }else{
  body=`<div class="grid g2" style="align-items:start"><div class="card stack"><h4>Review your request</h4>${summary(d)}</div><div class="card stack"><div class="note">This is a request. Your booking is <b>pending</b> until the front desk confirms it by SMS.</div>
  <label class="check ${e.agree?'bad':''}"><input type="checkbox" data-f="agree" ${d.agree?'checked':''}><span>I understand my slot is only held, not confirmed, and I will pay at the venue.</span></label>${e.agree?`<span class="err" style="display:block">${e.agree}</span>`:''}
  <div class="row between"><button class="btn btn-ghost" data-a="back">Back</button><button class="btn btn-primary" data-a="submit">Submit request</button></div></div></div>`;
 }
 return `<div class="wrap pad-sm"><h2 style="margin-bottom:16px">Book a court</h2>${stepper}${body}</div>`;
}
function pgConfirm(){
 const b=S.bookings.find(x=>x.ref===S.lastRef);if(!b)return pgHome();
 const m=S.sms.find(s=>s.ref===b.ref&&s.type==='received');
 return `<div class="wrap pad-sm stack" style="--s:24px"><div class="row between"><div><span class="badge b-${b.status}">${STATUS_LABEL[b.status]}</span><h2 style="margin-top:8px">Request received: ${b.ref}</h2><p class="muted" style="margin-top:6px">Keep this reference number. We'll text ${esc(b.phone)} when the status changes.</p></div></div>
 <div class="grid g2" style="align-items:start"><div class="stack"><div class="card">${summary(b)}</div>
 <div class="card"><h4>What happens next</h4><div class="flow" style="margin-top:12px"><span>Pending (now)</span><em>→ front desk approves →</em><span>Confirmed</span></div><p class="muted small" style="margin-top:12px">A pending request holds your slot but is not a guaranteed booking. Only a confirmed booking comes with a confirmation text.</p></div>
 <div class="row"><button class="btn btn-primary" data-a="go" data-v="mybookings">View my bookings</button><button class="btn btn-ghost" data-a="book">Book another</button><button class="btn btn-ghost" data-a="role" data-v="admin">Switch to admin to approve</button></div></div>
 <div class="stack"><h4 style="text-align:center">Text you'd receive</h4>${phone(m?[m]:[])}</div></div></div>`;
}
function pgMy(){
 const mine=S.bookings.filter(b=>b.mine);const up=mine.filter(b=>isUpcoming(b)&&b.status!=='cancelled'&&b.status!=='completed').sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));
 const past=mine.filter(b=>!up.includes(b)).sort((a,b)=>(b.date+b.start).localeCompare(a.date+a.start));
 const list=S.tab==='upcoming'?up:past;
 return `<div class="wrap pad-sm stack" style="--s:24px"><div class="row between"><div><h2>My bookings</h2><p class="muted small">Signed in as Ana Reyes · 0917 123 4567 (sample customer)</p></div><button class="btn btn-primary" data-a="book">Book a court</button></div>
 <div class="chips"><button class="chip" aria-pressed="${S.tab==='upcoming'}" data-a="tab" data-v="upcoming">Current (${up.length})</button><button class="chip" aria-pressed="${S.tab==='past'}" data-a="tab" data-v="past">Previous (${past.length})</button></div>
 ${list.length?`<div class="grid g2">${list.map(b=>`<article class="card stack" style="--s:12px"><div class="row between"><h4>${b.ref}</h4>${badge(b.status)}</div>${summary(b)}${b.status==='pending'||b.status==='confirmed'?`<div class="row"><button class="btn btn-danger btn-sm" data-a="askcancel" data-v="${b.ref}">Cancel booking</button></div>`:''}</article>`).join('')}</div>`:`<div class="card" style="text-align:center"><h4>Nothing here yet</h4><p class="muted" style="margin:8px 0 16px">Reserve a court and it will show up here.</p><button class="btn btn-primary" data-a="book">Book a court</button></div>`}
 <p class="muted small">To change a schedule, cancel and rebook, or call the front desk.</p></div>`;
}
function pgSms(){
 const ev=S.smsEvent;const b=sampleBooking();
 const trig={received:'Customer submits a reservation request.',confirmed:'Admin approves a pending reservation.',reminder:'Scheduled before the start time (for example 2 hours before), or sent manually by admin.',cancelled:'Customer cancels, or admin declines or cancels.'};
 return `<div class="wrap pad-sm stack" style="--s:24px"><div><h2>SMS notifications</h2><p class="muted" style="margin-top:8px">Sample messages for each booking event. This prototype only simulates them – no text is sent.</p></div>
 <div class="grid g2" style="align-items:start"><div class="stack"><div class="chips" role="group" aria-label="Message type">${Object.entries(SMS_META).map(([k,l])=>`<button class="chip" aria-pressed="${ev===k}" data-a="smsev" data-v="${k}">${l}</button>`).join('')}</div>
 <div class="card stack" style="--s:8px"><h4>${SMS_META[ev]}</h4><p class="muted"><b>Sent when:</b> ${trig[ev]}</p><p class="small muted">Message text uses booking details: reference, court, date, time${ev==='confirmed'?', amount due':''}.</p></div>
 <div class="tw"><table class="t" style="min-width:0"><thead><tr><th>Event</th><th>Triggered by</th></tr></thead><tbody>${Object.keys(SMS_META).map(k=>`<tr><td><b>${SMS_META[k]}</b></td><td class="small">${trig[k]}</td></tr>`).join('')}</tbody></table></div></div>
 <div>${phone([{text:SMS_TPL[ev](b),time:stamp()}],'Sample message')}</div></div></div>`;
}
function pgInfo(){
 const faq=[['How do I reserve a court?','Pick an open hour on the Book a court screen, enter your details, and submit. Your request is pending until the front desk confirms it.'],['Will I get a text message?','Yes. You get an SMS when your request is received, when it is confirmed, before your game, and if it is cancelled.'],['How do I pay?','Pay at the front desk before play. Online payment is not part of this prototype.'],['Can I cancel?','Yes, from My bookings. Please cancel at least 2 hours before your start time so others can use the slot.'],['What if my slot is taken?','Reserved slots are locked in the grid, so you can only pick open hours. If a pending request is declined, you will get a text.']];
 return `<div class="wrap pad-sm stack" style="--s:24px"><h2>Information</h2><div class="grid g2" style="align-items:start"><div class="card stack" style="--s:12px"><h4>Contact</h4><dl class="kv"><dt>Location</dt><dd>Zamboanga City</dd><dt>Hours</dt><dd>6:00 AM – 10:00 PM daily</dd><dt>Phone</dt><dd>0917 000 0000</dd><dt>Email</dt><dd>courts@example.com</dd></dl><p class="small muted">Sample details for the prototype.</p></div>
 <div class="card"><h4>Rental policies</h4><ul class="muted" style="padding-left:20px;margin:8px 0 0"><li>Bookings run 1 to 3 hours, on the hour.</li><li>Maximum of 4 players per court.</li><li>Non-marking court shoes only.</li><li>Late cancellations may be recorded as no-shows.</li></ul></div></div>
 <div class="card"><h4>Frequently asked questions</h4>${faq.map(([q,a])=>`<details><summary>${q}</summary><p class="muted" style="margin-top:8px">${a}</p></details>`).join('')}</div></div>`;
}

