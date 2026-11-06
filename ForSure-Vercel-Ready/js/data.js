/* ---------- sample data (frontend only) ---------- */
const COURTS=[
 {id:1,name:'Court 1',type:'Covered',surface:'Hard court, covered outdoor',price:300,open:true,c1:'#2B6CB0',c2:'#1E4F8A'},
 {id:2,name:'Court 2',type:'Covered',surface:'Hard court, covered outdoor',price:300,open:true,c1:'#2F7D6B',c2:'#215C4E'},
 {id:3,name:'Court 3',type:'Indoor',surface:'Cushioned indoor court, LED lights',price:400,open:true,c1:'#4A5FB5',c2:'#344592'},
 {id:4,name:'Court 4',type:'Indoor',surface:'Cushioned indoor court, LED lights',price:400,open:true,c1:'#7A5AB5',c2:'#5A4090'}
];
const mk=(ref,courtId,off,start,dur,name,status,mine=false,paddle=false,balls=false)=>({ref,courtId,date:addDays(TODAY,off),start,dur,name,phone:mine?'0917 123 4567':'09'+(170000000+ref.slice(-3)*7311).toString().slice(0,9),status,mine,paddle,balls,players:4});
const S={
 role:'customer',view:'home',navOpen:false,adminView:'dashboard',
 filter:'all',step:1,errors:{},lastRef:null,smsEvent:'received',q:'',rf:'all',adminDate:TODAY,modal:null,
 draft:{courtId:1,date:TODAY,start:null,dur:1,name:'Ana Reyes',phone:'0917 123 4567',players:2,paddle:false,balls:false,notes:'',agree:false},
 detailId:1,tab:'upcoming',next:15,
 courts:COURTS,
 bookings:[
  mk('PBR-001',1,0,17,2,'Ana Reyes','confirmed',true,true),
  mk('PBR-002',2,0,18,1,'Marco Dizon','confirmed'),
  mk('PBR-003',3,0,9,2,'Liza Tan','confirmed'),
  mk('PBR-004',1,1,8,1,'Ana Reyes','pending',true),
  mk('PBR-005',4,1,19,2,'Joel Santos','confirmed'),
  mk('PBR-006',2,2,16,2,'Grace Lim','pending'),
  mk('PBR-007',3,3,18,1,'Ana Reyes','confirmed',true,false,true),
  mk('PBR-008',1,-3,17,2,'Ana Reyes','completed',true),
  mk('PBR-009',2,-6,19,1,'Ana Reyes','cancelled',true),
  mk('PBR-010',4,-2,7,2,'Ken Uy','completed'),
  mk('PBR-011',3,0,17,1,'Rina Cruz','pending'),
  mk('PBR-012',4,0,6,2,'Bea Navarro','confirmed'),
  mk('PBR-013',2,1,17,2,'Paolo Reyes','confirmed'),
  mk('PBR-014',3,2,7,2,'Dan Villar','confirmed')
 ],
 sms:[],
 openPlays:[]
};
// Restore Open Play sessions created in this browser.
try{S.openPlays=JSON.parse(localStorage.getItem('forsure_openplay_v1')||'[]')}catch{S.openPlays=[]}
const court=id=>S.courts.find(c=>c.id===id);
const total=b=>court(b.courtId).price*b.dur+(b.paddle?ADDON.paddle.price:0)+(b.balls?ADDON.balls.price:0);
const isPast=(date,h)=>date<TODAY||(date===TODAY&&h<=NOWH);
const bookingAt=(cid,date,h,all)=>S.bookings.find(b=>b.courtId===cid&&b.date===date&&(all?b.status!=='cancelled':['pending','confirmed'].includes(b.status))&&h>=b.start&&h<b.start+b.dur);
const slotState=(cid,date,h)=>{
  if(!court(cid).open)return 'blocked';
  if(isPast(date,h))return 'past';
  return bookingAt(cid,date,h)?'taken':'open';
};
const durOk=(cid,date,start,dur)=>{for(let h=start;h<start+dur;h++){if(h>21||slotState(cid,date,h)!=='open')return false}return true};
const openCount=(cid,date)=>HOURS.filter(h=>slotState(cid,date,h)==='open').length;
const nextOpen=(cid)=>{const h=HOURS.find(h=>slotState(cid,TODAY,h)==='open');return h===undefined?null:h};
const isUpcoming=b=>b.date>TODAY||(b.date===TODAY&&b.start+b.dur>NOWH);

