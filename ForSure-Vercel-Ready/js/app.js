/* ---------- render ---------- */
const PAGES={home:pgHome,courts:pgCourts,detail:pgDetail,book:pgBook,confirm:pgConfirm,mybookings:pgMy,sms:pgSms,info:pgInfo,openplay:pgOpenPlay};
const ADM={dashboard:admDash,calendar:admCal,reservations:admRes,courts:admCourts,smslog:admSms,openplay:admOpenPlay};
function render(scroll){
 const adm=S.role==='admin';
 $('#app').innerHTML=header()+(adm?adminShell(ADM[S.adminView]()):`<main>${PAGES[S.view]()}</main>${footer()}`)+modal();
 if(scroll)window.scrollTo(0,0);
}
function go(v,scroll=true){S.view=v;S.navOpen=false;S.errors={};render(scroll)}
function startBooking(cid,date){const d=S.draft;d.courtId=cid;d.date=date||d.date;d.start=null;d.dur=1;S.step=1;S.errors={};go('book')}
const setStatus=(ref,st,sms)=>{const b=S.bookings.find(x=>x.ref===ref);b.status=st;if(sms)sendSms(sms,b);S.modal=null;toast(`${ref} ${st}. Sample SMS added to the log (simulated).`);render(false)};

/* ---------- events ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t)return;
 const a=t.dataset.a,v=t.dataset.v,d=S.draft;
 switch(a){
  case 'go':S.role='customer';go(v);break;
  case 'burger':S.navOpen=!S.navOpen;render(false);break;
  case 'role':S.role=v;S.navOpen=false;render(true);break;
  case 'book':S.role='customer';startBooking(d.courtId);break;
  case 'quick':S.role='customer';startBooking(+v);break;
  case 'daypick':startBooking(+t.dataset.c,v);break;
  case 'detail':S.detailId=+v;go('detail');break;
  case 'filter':S.filter=v;render(false);break;
  case 'date':d.date=v;d.start=null;render(false);break;
  case 'pick':d.courtId=+t.dataset.c;d.start=+t.dataset.h;d.dur=1;S.errors={};render(false);break;
  case 'dur':d.dur=+v;render(false);break;
  case 'back':S.step--;S.errors={};render(true);break;
  case 'next':if(validate(S.step)){S.step++;render(true)}else render(false);break;
  case 'submit':submit();break;
  case 'tab':S.tab=v;render(false);break;
  case 'askcancel':S.modal={type:'cancel',ref:v};render(false);break;
  case 'cancelnow':setStatus(v,'cancelled','cancelled');break;
  case 'closem':S.modal=null;render(false);break;
  case 'smsev':S.smsEvent=v;render(false);break;
  case 'adm':S.adminView=v;render(true);break;
  case 'caldate':S.adminDate=v==='0'?TODAY:addDays(S.adminDate,+v);render(false);break;
  case 'viewbk':S.modal={type:'view',ref:v};render(false);break;
  case 'rf':S.rf=v;render(false);break;
  case 'approve':setStatus(v,'confirmed','confirmed');break;
  case 'decline':setStatus(v,'cancelled','cancelled');break;
  case 'complete':setStatus(v,'completed');break;
  case 'remind':{const b=S.bookings.find(x=>x.ref===v);sendSms('reminder',b);S.modal=null;toast('Reminder added to the SMS log (simulated).');render(false);break}
  case 'toggle':{const c=court(+v);c.open=!c.open;render(false);break}
  case 'opcreate':opCreate();break;
  case 'opbook':opBook(v);break;
  case 'opcancelbooking':opCancelBooking(v,t.dataset.p);break;
  case 'opcancel':opCancelSession(v);break;
 }
});
document.addEventListener('input',e=>{
 const f=e.target.dataset.f;if(!f)return;const d=S.draft;
 if(f==='q'){S.q=e.target.value;$('#resbody').innerHTML=resRows();return}
 if(f==='price'){court(+e.target.dataset.c).price=Math.max(0,+e.target.value||0);return}
 if(e.target.type==='checkbox'){d[f]=e.target.checked;if(f!=='agree')render(false);return}
 d[f]=f==='players'?+e.target.value:e.target.value;
});
function validate(step){
 const d=S.draft;const e={};
 if(step===1){if(d.start===null||!durOk(d.courtId,d.date,d.start,d.dur))e.slot='Choose an open time slot to continue.'}
 if(step===2){
  if(d.name.trim().length<2)e.name='Enter your full name.';
  if(!/^(09\d{9}|\+639\d{9})$/.test(d.phone.replace(/[\s-]/g,'')))e.phone='Enter a valid mobile number, like 0917 123 4567.';
  if(!(d.players>=1&&d.players<=4))e.players='Players must be between 1 and 4.';
 }
 S.errors=e;return !Object.keys(e).length;
}
function submit(){
 const d=S.draft;
 if(!d.agree){S.errors={agree:'Please confirm before submitting.'};render(false);return}
 if(!durOk(d.courtId,d.date,d.start,d.dur)){S.step=1;S.errors={slot:'That slot was just taken. Pick another time.'};render(true);return}
 const ref='PBR-'+String(S.next++).padStart(3,'0');
 const b={ref,courtId:d.courtId,date:d.date,start:d.start,dur:d.dur,name:d.name.trim(),phone:d.phone.trim(),status:'pending',mine:true,paddle:d.paddle,balls:d.balls,players:d.players};
 S.bookings.push(b);sendSms('received',b);S.lastRef=ref;
 d.start=null;d.agree=false;d.dur=1;S.step=1;go('confirm');
}
render(false);



