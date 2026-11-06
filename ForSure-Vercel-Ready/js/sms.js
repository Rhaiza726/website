/* ---------- SMS (simulated) ---------- */
const SMS_TPL={
 received:b=>`ForSure Courts: Your reservation request ${b.ref} for ${court(b.courtId).name} on ${fmtDate(b.date)}, ${rng(b.start,b.dur)} was received. Status: PENDING. Please wait for our confirmation text.`,
 confirmed:b=>`ForSure Courts: Booking ${b.ref} is CONFIRMED. ${court(b.courtId).name}, ${fmtDate(b.date)}, ${rng(b.start,b.dur)}. Please arrive 10 minutes early. Pay ${peso(total(b))} at the front desk.`,
 reminder:b=>`ForSure Courts: Reminder – your game on ${court(b.courtId).name} starts at ${hl(b.start)} (${b.date===TODAY?'today':fmtDate(b.date)}). Booking ${b.ref}. See you on the court!`,
 cancelled:b=>`ForSure Courts: Booking ${b.ref} (${court(b.courtId).name}, ${fmtDate(b.date)}, ${rng(b.start,b.dur)}) has been CANCELLED. You can book another slot anytime.`
};
const SMS_META={received:'Reservation received',confirmed:'Booking confirmed',reminder:'Upcoming reminder',cancelled:'Cancelled / declined'};
const stamp=()=>new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
function sendSms(type,b){S.sms.unshift({id:S.sms.length+1,time:stamp(),to:b.phone,type,ref:b.ref,text:SMS_TPL[type](b),status:'Simulated'});}
const sampleBooking=()=>({ref:'PBR-001',courtId:1,date:addDays(TODAY,1),start:17,dur:2,paddle:false,balls:false,phone:'0917 123 4567'});
// seed log
[['received','PBR-004'],['confirmed','PBR-001'],['reminder','PBR-001']].forEach(([t,r])=>sendSms(t,S.bookings.find(b=>b.ref===r)));

