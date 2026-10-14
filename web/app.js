(function(){
  try{if(window.self!==window.top)document.documentElement.classList.add('framed')}catch(e){document.documentElement.classList.add('framed')}
  var $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

  var titles={es:document.title,en:document.documentElement.getAttribute('data-title-en')||document.title};
  function setLang(l){
    document.documentElement.lang=l;
    $$('[data-'+l+']').forEach(function(e){e.innerHTML=e.getAttribute('data-'+l)});
    $$('[data-ph-'+l+']').forEach(function(e){e.placeholder=e.getAttribute('data-ph-'+l)});
    $$('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===l)});
    document.title=titles[l];
    store('uma-lang',l);
  }
  $$('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang)})});
  var saved=store('uma-lang');
  if(saved==='en')setLang('en');

  var burger=document.querySelector('.burger'),menu=document.querySelector('.menu');
  if(burger){
    burger.addEventListener('click',function(){
      var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);
    });
    $$('.menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')})});
  }

  $$('.chip').forEach(function(c){c.addEventListener('click',function(){
    $$('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===c)});
    $$('.card').forEach(function(k){k.classList.toggle('hide',c.dataset.f!=='all'&&k.dataset.t!==c.dataset.f)});
  })});

  var ck=document.querySelector('.cookie');
  if(ck){
    var framed=false;try{framed=window.self!==window.top}catch(e){framed=true}
    if(framed||location.search.indexOf('shot')>-1||store('uma-cookies')){ck.hidden=true}else{document.body.classList.add('has-cookie')}
    $$('.cookie [data-c]').forEach(function(b){b.addEventListener('click',function(){
      store('uma-cookies',b.dataset.c);ck.hidden=true;document.body.classList.remove('has-cookie');
    })});
  }
  $$('form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();if(f.dataset.goto){location.hash=f.dataset.goto}})});
})();

/* modo captura (?shot): deja la web en su estado final, sin animaciones a medias */
(function(){
  if(!/[?&]shot/.test(location.search))return;
  window.addEventListener('load',function(){
    setTimeout(function(){
      try{
        if(window.ScrollTrigger){ScrollTrigger.getAll().forEach(function(t){t.kill()})}
        if(window.gsap){gsap.killTweensOf('*');gsap.set('.hero-bg,.hero-in *,.hero-actions *,.svc img,.svc article > *,.proj .ph,.card,.kpis > div,.q,h2,.label,.sub,.band img,.band p,.u360-list li,.u360-list .n,.portrait,.buyers,form,.channels,.gallery .ph,.veil,.hero-in,.cue',{clearProps:'all'})}
      }catch(e){}
    },400);
  });
})();

/* dentro de la presentación: la página padre controla el scroll y esta web le informa de su altura */
(function(){
  var framed=false;try{framed=window.self!==window.top}catch(e){framed=true}
  if(!framed)return;
  window.addEventListener('message',function(e){
    var d=e.data;
    if(d&&typeof d.umaScroll==='number'){window.scrollTo(0,d.umaScroll)}
  });
  function report(){
    try{parent.postMessage({umaSize:{h:document.documentElement.scrollHeight,vh:window.innerHeight}},'*')}catch(e){}
  }
  window.addEventListener('load',function(){report();setTimeout(report,1200);setTimeout(report,3500)});
  window.addEventListener('resize',report);
})();
