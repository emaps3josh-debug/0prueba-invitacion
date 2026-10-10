(() => {
'use strict';

/* =========================================================
   CONFIGURACIÓN — edita aquí los datos del evento
   ========================================================= */
const CONFIG = {
  fechaEvento: '2026-10-24T16:00:00-06:00', // ← ajusta la HORA real del evento
  mapa: 'https://www.google.com/maps/search/?api=1&query=Temixco%2C%20Morelos', // ← pega aquí el link exacto del lugar
  whatsapp: '527776242702',
  mensajeWhatsapp: '¡Hola! 🕷️ Confirmo mi asistencia al cumpleaños del 24 de octubre en Temixco, Morelos. Seremos __ personas.',
  musica: 'musica/cancion.mp3' // si no existe, suena una pista sintetizada original
};

const NS = 'http://www.w3.org/2000/svg';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ---------- Generador de telarañas ---------- */
function tela(svg, tipo){
  const corner = tipo === 'corner';
  let r, a0, a1, spokes, rings;
  if (corner){ svg.setAttribute('viewBox','0 0 100 100'); r=100; a0=0; a1=Math.PI/2; spokes=6; rings=6; }
  else { svg.setAttribute('viewBox','-100 -100 200 200'); r=96; a0=-Math.PI/2; a1=a0+Math.PI*2; spokes=12; rings=7; }
  const angs = [];
  for (let i=0;i<spokes;i++) angs.push(corner ? a0+(a1-a0)*i/(spokes-1) : a0+(a1-a0)*i/spokes);
  const f = n => n.toFixed(2);
  let dR='', dA='';
  angs.forEach(a => { dR += `M0 0L${f(Math.cos(a)*r)} ${f(Math.sin(a)*r)}`; });
  const segs = corner ? angs.length-1 : angs.length;
  for (let k=1;k<=rings;k++){
    const rr = r*Math.pow(k/rings,1.15), sag = rr*.82;
    for (let i=0;i<segs;i++){
      const p = angs[i];
      const q = angs[(i+1)%angs.length] + (!corner && i===angs.length-1 ? Math.PI*2 : 0);
      const m = (p+q)/2;
      dA += `M${f(Math.cos(p)*rr)} ${f(Math.sin(p)*rr)}Q${f(Math.cos(m)*sag)} ${f(Math.sin(m)*sag)} ${f(Math.cos(q)*rr)} ${f(Math.sin(q)*rr)}`;
    }
  }
  svg.innerHTML = '';
  [['radiales',dR],['anillos',dA]].forEach(([c,d]) => {
    const p = document.createElementNS(NS,'path');
    p.setAttribute('d',d); p.setAttribute('class',c); p.setAttribute('pathLength','1');
    svg.appendChild(p);
  });
}
$$('[data-web]').forEach(s => tela(s, s.dataset.web));

/* ---------- Mascota (si no hay imagen propia en img/) ---------- */
function svgUse(id,cls){ const s=document.createElementNS(NS,'svg'); s.setAttribute('class',cls); s.setAttribute('aria-hidden','true'); const u=document.createElementNS(NS,'use'); u.setAttribute('href','#'+id); s.appendChild(u); return s; }
$$('.colgante img, .personaje-flota img').forEach(img=>{
  // Prueba img/personaje-N con varias extensiones: .png, .gif, .webp, .jpg
  const base=img.getAttribute('src').replace(/\.[a-z0-9]+$/i,'');
  const exts=['png','gif','webp','jpg','jpeg'];
  let i=0;
  const mascota=()=>{
    const cont=img.parentNode; if(!cont) return;
    img.replaceWith(svgUse('mascota','mascota'));
    if(cont.closest('.cierre')){ cont.prepend(svgUse('globos','globos izq')); cont.append(svgUse('globos','globos')); }
  };
  const siguiente=()=>{ i++; if(i<exts.length) img.src=base+'.'+exts[i]; else mascota(); };
  img.addEventListener('error',siguiente);
  if(img.complete && !img.naturalWidth) siguiente();
});

/* ---------- Letras animadas ---------- */
const seg = window.Intl && Intl.Segmenter ? new Intl.Segmenter('es',{granularity:'grapheme'}) : null;
const grafemas = t => seg ? Array.from(seg.segment(t),x=>x.segment) : Array.from(t);
function partirLetras(el, claseExtra){
  let i=0;
  const nodos=[]; const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); while(w.nextNode()) nodos.push(w.currentNode);
  nodos.forEach(n=>{
    const frag=document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(parte=>{
      if(!parte) return;
      if(/^\s+$/.test(parte)){ frag.appendChild(document.createTextNode(' ')); return; }
      const pal=document.createElement('span'); pal.className='palabra';
      grafemas(parte).forEach(g=>{ const l=document.createElement('span'); l.className='letra'+(claseExtra?' '+claseExtra:''); l.style.setProperty('--i',i++); l.textContent=g; pal.appendChild(l); });
      frag.appendChild(pal);
    });
    n.replaceWith(frag);
  });
  if(!el.getAttribute('aria-label')) el.setAttribute('aria-label',el.textContent);
}
$$('.feliz .grad').forEach(el=>{ el.classList.remove('grad'); partirLetras(el,'grad'); });
$$('.letras').forEach(el=>partirLetras(el));

/* ---------- Arañita que camina sobre los títulos ---------- */
const BICHO = `<svg viewBox="0 0 40 34" aria-hidden="true"><g fill="none" stroke="#141726" stroke-width="2.2" stroke-linecap="round">
<g class="pA"><path d="M20 14 Q15 5 9 4"/><path d="M25 13 Q29 4 33 2"/><path d="M23 20 Q22 30 18 33"/><path d="M26 20 Q33 26 38 26"/></g>
<g class="pB"><path d="M23 14 Q22 4 18 1"/><path d="M26 14 Q33 8 38 8"/><path d="M20 20 Q15 29 9 30"/><path d="M25 21 Q29 30 33 32"/></g></g>
<g class="cuerpo"><ellipse cx="16" cy="17" rx="9" ry="7" fill="#141726"/><circle cx="28" cy="17" r="5.2" fill="#141726"/>
<path d="M14 15 L18 15 L16 17.5 Z M14 19 L18 19 L16 16.5 Z" fill="#e11d2e"/><circle cx="30.5" cy="15.4" r="1.4" fill="#fff"/><circle cx="30.5" cy="18.6" r="1.4" fill="#fff"/></g></svg>`;
$$('.con-arana').forEach(el=>{
  const c=document.createElement('span'); c.className='camina'; c.setAttribute('aria-hidden','true');
  const b=document.createElement('span'); b.className='bicho'; b.innerHTML=BICHO;
  b.style.setProperty('--dur',(8+Math.random()*5).toFixed(1)+'s'); b.style.setProperty('--del',(-Math.random()*8).toFixed(1)+'s');
  c.appendChild(b); el.appendChild(c);
});

/* ---------- Ciudad nocturna ---------- */
const ciudad = $('#ciudad'), cc = ciudad.getContext('2d');
function rng(seed){ return () => ((seed = (seed*16807) % 2147483647) - 1) / 2147483646; }
function dibujarCiudad(){
  const dpr = Math.min(window.devicePixelRatio||1, 2), w = innerWidth, h = innerHeight;
  ciudad.width = w*dpr; ciudad.height = h*dpr; cc.setTransform(dpr,0,0,dpr,0,0);
  const R = rng(7);
  const g = cc.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#03040c'); g.addColorStop(.5,'#0a0f2e'); g.addColorStop(.82,'#1a0f33'); g.addColorStop(1,'#2a0a1c');
  cc.fillStyle = g; cc.fillRect(0,0,w,h);
  // estrellas
  for (let i=0;i<w*h/2600;i++){ cc.fillStyle=`rgba(255,255,255,${.2+R()*.6})`; const s=R()*1.3+.3; cc.fillRect(R()*w,R()*h*.6,s,s); }
  // luna
  const mx=w*.78, my=h*.15, mr=Math.min(w,h)*.085;
  const mg=cc.createRadialGradient(mx,my,mr*.6,mx,my,mr*4.5);
  mg.addColorStop(0,'rgba(200,215,255,.28)'); mg.addColorStop(1,'rgba(200,215,255,0)');
  cc.fillStyle=mg; cc.fillRect(0,0,w,h);
  cc.fillStyle='#e9edff'; cc.beginPath(); cc.arc(mx,my,mr,0,Math.PI*2); cc.fill();
  cc.fillStyle='rgba(170,182,225,.35)';
  [[-.3,-.2,.22],[.25,.15,.16],[-.05,.35,.12]].forEach(([dx,dy,s])=>{cc.beginPath();cc.arc(mx+dx*mr,my+dy*mr,s*mr,0,Math.PI*2);cc.fill();});
  // neblina roja y azul
  [[w*.15,h*.95,'225,29,46',.25],[w*.9,h*.9,'30,91,255',.22]].forEach(([x,y,c,a])=>{
    const hz=cc.createRadialGradient(x,y,0,x,y,Math.max(w,h)*.8);
    hz.addColorStop(0,`rgba(${c},${a})`); hz.addColorStop(1,`rgba(${c},0)`);
    cc.fillStyle=hz; cc.fillRect(0,0,w,h);
  });
  // edificios en 3 capas
  const capas=[
    {min:.28,max:.58,col:'#0d1333',vent:.04,wmin:30,wmax:70},
    {min:.18,max:.44,col:'#080b21',vent:.07,wmin:26,wmax:80},
    {min:.1,max:.27,col:'#04050f',vent:.1,wmin:34,wmax:90}
  ];
  capas.forEach(c=>{
    let x=-10;
    while(x<w+10){
      const bw=c.wmin+R()*(c.wmax-c.wmin), bh=h*(c.min+R()*(c.max-c.min)), y=h-bh;
      cc.fillStyle=c.col; cc.fillRect(x,y,bw,bh);
      if(R()<.3){ cc.fillRect(x+bw*.45,y-bh*.08,2,bh*.08); }
      if(R()<.2){ cc.fillRect(x+bw*.2,y-10,bw*.6,10); }
      for(let wy=y+8;wy<h-6;wy+=9){
        for(let wx=x+5;wx<x+bw-6;wx+=8){
          if(R()<c.vent){ cc.fillStyle=R()<.8?'rgba(255,214,140,.75)':'rgba(140,180,255,.7)'; cc.fillRect(wx,wy,3,4); }
        }
      }
      x+=bw+R()*4;
    }
  });
}

/* ---------- Partículas ---------- */
const pc=$('#particulas'), px=pc.getContext('2d');
let parts=[], W=0, H=0;
const MAX = reduce ? 15 : 55;
const COLS=['255,59,74','91,140,255','255,255,255'];
function resizeP(){ const dpr=Math.min(window.devicePixelRatio||1,2); W=innerWidth; H=innerHeight; pc.width=W*dpr; pc.height=H*dpr; px.setTransform(dpr,0,0,dpr,0,0); }
function flotante(yRand){ return {x:Math.random()*W,y:yRand?Math.random()*H:H+10,vx:(Math.random()-.5)*.3,vy:-(.25+Math.random()*.7),r:Math.random()*1.8+.6,a:Math.random()*.55+.3,c:COLS[Math.random()*3|0],life:Infinity}; }
function chispa(x,y,fuerza){ const an=Math.random()*Math.PI*2, v=Math.random()*fuerza; return {x,y,vx:Math.cos(an)*v,vy:Math.sin(an)*v,r:Math.random()*2+.8,a:.9,c:COLS[Math.random()*3|0],life:50+Math.random()*40}; }
function rafaga(x,y,n,f){ for(let i=0;i<n;i++) parts.push(chispa(x,y,f)); }
let extra = 0;
function loopP(){
  px.clearRect(0,0,W,H);
  const flot = parts.filter(p=>p.life===Infinity).length;
  if (flot < MAX + extra && Math.random()<.35) parts.push(flotante(false));
  parts = parts.filter(p=>{
    p.x+=p.vx; p.y+=p.vy;
    let a=p.a;
    if(p.life!==Infinity){ p.vx*=.95; p.vy*=.95; p.life--; if(p.life<=0) return false; a*=Math.min(1,p.life/35); }
    else if(p.y<-10) return false;
    px.beginPath(); px.arc(p.x,p.y,p.r,0,Math.PI*2);
    px.fillStyle=`rgba(${p.c},${a})`; px.shadowBlur=8; px.shadowColor=`rgba(${p.c},.8)`; px.fill();
    return true;
  });
  requestAnimationFrame(loopP);
}

function onResize(){ dibujarCiudad(); resizeP(); }
let rt; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(onResize,150); });
onResize();
for(let i=0;i<MAX/2;i++) parts.push(flotante(true));
requestAnimationFrame(loopP);

/* ---------- Audio ---------- */
let ctx=null, master=null, modo=null, sonando=false, timer=null, pasoN=0, proxT=0, ruidoBuf=null;
const audio = new Audio(); audio.loop=true; audio.preload='auto'; audio.src=CONFIG.musica;
function asegurarCtx(){
  if(!ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null; ctx=new AC(); master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination); }
  if(ctx.state==='suspended') ctx.resume();
  return ctx;
}
const mtof = m => 440*Math.pow(2,(m-69)/12);
const BPM=128, BEAT=60/BPM, SEMI=BEAT/4;
const ACORDES=[[62,65,69],[58,62,65],[60,64,67],[57,61,64]]; // Dm Bb C A
const BAJOS=[38,34,36,33];
const MELODIA=[[0,74,4],[4,77,2],[6,81,6],[12,79,2],[14,77,2],[16,77,4],[20,74,4],[24,70,8],[32,72,4],[36,76,4],[40,79,6],[46,76,2],[48,76,4],[52,73,4],[56,69,8]];
function ruido(){ if(!ruidoBuf){ ruidoBuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate); const d=ruidoBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; } const s=ctx.createBufferSource(); s.buffer=ruidoBuf; return s; }
function nota(f,t,dur,tipo,vol,corte,destino){
  const o=ctx.createOscillator(), g=ctx.createGain(); o.type=tipo; o.frequency.value=f;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.012); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  if(corte){ const fl=ctx.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=corte; o.connect(fl); fl.connect(g); } else o.connect(g);
  g.connect(destino||master); o.start(t); o.stop(t+dur+.05);
}
function bombo(t){ const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.setValueAtTime(140,t); o.frequency.exponentialRampToValueAtTime(40,t+.15); g.gain.setValueAtTime(.9,t); g.gain.exponentialRampToValueAtTime(.001,t+.25); o.connect(g); g.connect(master); o.start(t); o.stop(t+.3); }
function golpe(t,hp,vol,dur){ const s=ruido(), f=ctx.createBiquadFilter(), g=ctx.createGain(); f.type='highpass'; f.frequency.value=hp; g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()*.5); s.stop(t+dur+.02); }
function programar(t,i){
  const compas=Math.floor(i/16)%4, s=i%16, ac=ACORDES[compas], b=BAJOS[compas], ciclo=Math.floor(i/64);
  if(s%2===0) nota(mtof(b+(s%4===2?12:0)),t,SEMI*1.8,'sawtooth',.2,520);
  if(s===0||s===8||(s===14&&compas===3)) bombo(t);
  if(s===4||s===12) golpe(t,1500,.32,.18);
  if(s%2===1) golpe(t,7000,.07,.05);
  const patron=[0,1,2,1,0,2,1,2];
  nota(mtof(ac[patron[s%8]]+12),t,SEMI*.9,'square',.035,2200);
  if(s===0) ac.forEach(m=>nota(mtof(m),t,BEAT*4,'triangle',.05));
  if(ciclo%2===1){ const pos=i%64; MELODIA.forEach(([st,m,len])=>{ if(st===pos) nota(mtof(m),t,SEMI*len*.95,'sawtooth',.06,3200); }); }
}
function scheduler(){ while(proxT < ctx.currentTime + .12){ programar(proxT,pasoN); proxT+=SEMI; pasoN++; } }
function arrancarSinte(){
  if(!asegurarCtx()) return;
  modo='sinte'; proxT=ctx.currentTime+.1;
  master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(0,ctx.currentTime); master.gain.linearRampToValueAtTime(.35,ctx.currentTime+1.5);
  clearInterval(timer); timer=setInterval(scheduler,25);
  sonando=true; actualizarBtn();
}
function iniciarMusica(){
  asegurarCtx();
  audio.volume=.85;
  const p = audio.play();
  if(p && p.then){ p.then(()=>{ modo='mp3'; sonando=true; actualizarBtn(); }).catch(arrancarSinte); }
  else { modo='mp3'; sonando=true; actualizarBtn(); }
}
function whoosh(){
  if(!ctx) return;
  const t=ctx.currentTime, s=ruido(), f=ctx.createBiquadFilter(), g=ctx.createGain();
  f.type='bandpass'; f.Q.value=1.2; f.frequency.setValueAtTime(300,t); f.frequency.exponentialRampToValueAtTime(3500,t+.7);
  g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.5,t+.25); g.gain.exponentialRampToValueAtTime(.0001,t+.9);
  s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t); s.stop(t+1);
  nota(55,t+.25,1.2,'sine',.6,null,ctx.destination);
}
const btnMusica=$('#btnMusica');
function actualizarBtn(){ btnMusica.classList.toggle('off',!sonando); btnMusica.setAttribute('aria-label',sonando?'Pausar música':'Reproducir música'); }
btnMusica.addEventListener('click',e=>{
  e.stopPropagation();
  if(!modo){ iniciarMusica(); return; }
  if(sonando){ modo==='mp3' ? audio.pause() : ctx.suspend(); sonando=false; }
  else { modo==='mp3' ? audio.play() : ctx.resume(); sonando=true; }
  actualizarBtn();
});
let pausadaPorOcultar=false;
document.addEventListener('visibilitychange',()=>{
  if(!modo) return;
  if(document.hidden && sonando){ modo==='mp3'?audio.pause():ctx.suspend(); sonando=false; pausadaPorOcultar=true; }
  else if(!document.hidden && pausadaPorOcultar){ modo==='mp3'?audio.play():ctx.resume(); sonando=true; pausadaPorOcultar=false; }
  actualizarBtn();
});

/* ---------- Secuencia de entrada ---------- */
const intro=$('#intro'), body=document.body;
const PASOS=[[300,'paso-1'],[2700,'paso-2'],[3200,'paso-3'],[4800,'paso-4'],[5700,'paso-5']];
const timers=[];
function aplicarPaso(c){
  intro.classList.add(c);
  if(c==='paso-2'){ body.classList.add('telas-on'); extra=25; }
  if(c==='paso-3'){ rafaga(W/2,H*.42,40,6); }
}
PASOS.forEach(([t,c])=>timers.push(setTimeout(()=>aplicarPaso(c), reduce?0:t)));
// Tocar durante la intro la adelanta hasta el botón
intro.addEventListener('click',e=>{
  if(e.target.closest('button') || intro.classList.contains('paso-5')) return;
  timers.forEach(clearTimeout); PASOS.forEach(([,c])=>aplicarPaso(c));
});

let abierto=false;
const main=$('#invitacion');
$('#btnAbrir').addEventListener('click',e=>{
  e.stopPropagation();
  if(abierto) return; abierto=true;
  iniciarMusica(); whoosh();
  intro.classList.add('abriendo');
  body.classList.add('expandidas');
  rafaga(W/2,H/2,110,14);
  if(navigator.vibrate) navigator.vibrate(40);
  setTimeout(()=>{
    intro.classList.add('oculto');
    body.classList.remove('bloqueado','expandidas');
    body.classList.add('abierta');
    main.classList.add('activa');
    window.scrollTo(0,0);
    observar();
  },1300);
  setTimeout(()=>intro.remove(),2400);
});

/* ---------- Revelado al hacer scroll ---------- */
function observar(){
  const els=$$('.revelar');
  if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('visible')); return; }
  const io=new IntersectionObserver(ents=>ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } }),{threshold:.15});
  els.forEach(el=>io.observe(el));
}

/* ---------- Cuenta regresiva ---------- */
const objetivo=new Date(CONFIG.fechaEvento).getTime();
const cd={d:$('#cd-d'),h:$('#cd-h'),m:$('#cd-m'),s:$('#cd-s')}, prev={};
function poner(k,v){ const t=String(v).padStart(2,'0'); if(prev[k]!==t){ const el=cd[k]; el.textContent=t; el.classList.remove('tic'); void el.offsetWidth; el.classList.add('tic'); prev[k]=t; } }
function tick(){
  const ms=objetivo-Date.now();
  if(ms<=0){
    ['d','h','m','s'].forEach(k=>poner(k,0));
    $('#faltan').textContent = ms > -864e5 ? '¡HOY ES EL GRAN DÍA!' : '¡GRACIAS POR ACOMPAÑARNOS!';
    return;
  }
  poner('d',Math.floor(ms/864e5)); poner('h',Math.floor(ms/36e5)%24); poner('m',Math.floor(ms/6e4)%60); poner('s',Math.floor(ms/1e3)%60);
}
tick(); setInterval(tick,1000);

/* ---------- Enlaces ---------- */
$('#lnkMapa').href=CONFIG.mapa;
$('#lnkWhats').href=`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensajeWhatsapp)}`;

/* ---------- Telaraña al tocar la pantalla ---------- */
let activos=0;
document.addEventListener('pointerdown',e=>{
  if(e.target.closest('a,button') || activos>5) return;
  const s=document.createElementNS(NS,'svg');
  s.setAttribute('class','disparo'); s.setAttribute('aria-hidden','true');
  s.style.left=e.clientX+'px'; s.style.top=e.clientY+'px';
  tela(s,'full'); body.appendChild(s); activos++;
  rafaga(e.clientX,e.clientY,12,4);
  setTimeout(()=>{ s.remove(); activos--; },1300);
});
})();
