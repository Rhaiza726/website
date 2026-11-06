/* ---------- customer shell ---------- */
const NAV=[['home','Home'],['courts','Courts'],['mybookings','My bookings'],['openplay','Open Play'],['sms','SMS preview'],['info','Info']];
function header(){
 const adm=S.role==='admin';
 return `<header class="hdr"><div class="wrap">
 <button class="brand" data-a="go" data-v="${adm?'admin':'home'}" aria-label="ForSure Courts home"><i></i><span>ForSure Courts${adm?' · Admin':''}</span></button>
 ${adm?'':`<nav class="nav ${S.navOpen?'open':''}" aria-label="Main">${NAV.map(([k,l])=>`<button data-a="go" data-v="${k}" ${isNav(k)?'aria-current="page"':''}>${l}</button>`).join('')}<button class="btn btn-primary btn-sm" style="margin-left:auto" data-a="book">Book a court</button></nav>`}
 <div class="tools" ${adm?'style="margin-left:auto"':''}>
  <div class="switch" role="group" aria-label="Prototype view"><button data-a="role" data-v="customer" aria-pressed="${!adm}">Customer</button><button data-a="role" data-v="admin" aria-pressed="${adm}">Admin</button></div>
  ${adm?'':`<button class="burger" data-a="burger" aria-label="Menu" aria-expanded="${S.navOpen}">Menu</button>`}
 </div></div></header>`;
}
const isNav=k=>S.view===k||(k==='courts'&&['detail','book'].includes(S.view))||(k==='mybookings'&&S.view==='confirm');
function footer(){return `<footer><div class="wrap"><div><div class="brand" style="margin-bottom:8px"><i></i><span>ForSure Courts</span></div><p class="small">Pickleball court rental with text-message updates. Prototype for a school software engineering project – built with sample data, no real bookings or SMS.</p></div><div><b style="color:#fff">Customers</b><button class="l" data-a="go" data-v="courts">Courts &amp; equipment</button><button class="l" data-a="go" data-v="mybookings">My bookings</button><button class="l" data-a="go" data-v="info">Policies &amp; FAQ</button></div><div><b style="color:#fff">Front desk</b><p class="small" style="margin-top:8px">Zamboanga City<br>Open daily, 6:00 AM – 10:00 PM<br>0917 000 0000 (sample)</p></div></div></footer>`}

