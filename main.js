
const header=document.getElementById('header');
const modal=document.getElementById('modal');
const progress=document.getElementById('pageProgress');
const glow=document.getElementById('cursorGlow');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScroll(){
  header.classList.toggle('scrolled',window.scrollY>24);
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=max>0?`${(window.scrollY/max)*100}%`:'0%';
}
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('show');io.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

function openContact(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')}
function closeContact(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.querySelectorAll('.open-contact').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openContact()}));
document.getElementById('closeModal').addEventListener('click',closeContact);
modal.addEventListener('click',e=>{if(e.target===modal)closeContact()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeContact()});
document.getElementById('year').textContent=new Date().getFullYear();

if(!reduce){
  window.addEventListener('pointermove',e=>{
    glow.style.opacity='1';glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`;
  },{passive:true});
  document.addEventListener('pointerleave',()=>glow.style.opacity='0');

  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width; const y=(e.clientY-r.top)/r.height;
      const rx=(.5-y)*5; const ry=(x-.5)*6;
      card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}
