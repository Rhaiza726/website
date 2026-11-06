"use strict";
/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const TODAY=iso(new Date());
const addDays=(s,n)=>{const [y,m,d]=s.split('-').map(Number);return iso(new Date(y,m-1,d+n))};
const fmtDate=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})};
const dayName=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).toLocaleDateString('en-US',{weekday:'short'})};
const hl=h=>(h%12||12)+':00 '+(h>=12?'PM':'AM');
const rng=(s,d)=>hl(s)+' – '+hl(s+d);
const peso=n=>'₱'+Number(n).toLocaleString('en-PH');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const HOURS=Array.from({length:16},(_,i)=>i+6); // 6 AM – 10 PM
const NOWH=new Date().getHours();
const ADDON={paddle:{label:'Paddle set (2 paddles)',price:60},balls:{label:'Ball set (3 balls)',price:40}};
const STATUS_LABEL={pending:'Pending',confirmed:'Confirmed',cancelled:'Cancelled',completed:'Completed'};
const badge=s=>`<span class="badge b-${s}">${STATUS_LABEL[s]||s}</span>`;

