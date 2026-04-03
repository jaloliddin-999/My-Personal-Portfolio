// Interactive behaviors: reveal on scroll, adaptive preview, modal, skills map, confidence slider
(function(){
  'use strict'
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Simple reveal on scroll with stagger
  const reveals = document.querySelectorAll('.project, .card, .ai-card');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>{
          e.target.classList.add('revealed');
        }, i * 100);
        io.unobserve(e.target);
      }
    })
  },{threshold:0.08});
  reveals.forEach(r=>io.observe(r));

  // Adaptive preview: mouse tracking with vibrant glow
  const preview = document.getElementById('adaptive-preview');
  const skillCard = document.getElementById('skill-card');
  if(preview && skillCard){
    skillCard.addEventListener('pointermove', (ev)=>{
      const r = skillCard.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width * 100;
      const y = (ev.clientY - r.top) / r.height * 100;
      preview.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,212,255,0.25), rgba(255,0,110,0.1) 35%, transparent 60%)`;
    });
    skillCard.addEventListener('pointerleave', ()=>{
      preview.style.background = 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(255,0,110,0.1))';
    });
  }

  // Modal case studies with enhanced styling
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.querySelector('.modal-close');
  document.querySelectorAll('.link').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = btn.getAttribute('data-open');
      openCase(id);
    });
  });
  function openCase(id){
    let html = '';
    if(id==='case-1') html = `<h3>Moslashuvchan Dashboard</h3><p>Maqsad: AI signallarini ko'rsatish bilan aniqlik saqlay olish. Yondashish: tokenized UI, lazy loading, progressive disclosure. Natija: vazifa tugallash va signal ko'rinishini yaxshilash.</p>`;
    if(id==='case-2') html = `<h3>Marketing Landing</h3><p>Maqsad: UX tajribalari orqali konversiyani oshirish. Yondashish: tizimli A/B, tez rolloutlar. Natija: +9% CTA.</p>`;
    if(id==='case-3') html = `<h3>Dizayn Tizimi</h3><p>Maqsad: bir necha ilova uchun skalalanadigan tokenlar. Yondashish: token-birinchi, komponent-fokusli. Natija: tez qurilish, izchil UX.</p>`;
    modalContent.innerHTML = html + '<p class="muted">(Bu demo case tahlilidir; haqiqiy case studylaringiz bilan almashtiring.)</p>';
    modal.setAttribute('aria-hidden','false');
    closeBtn.focus();
  }
  closeBtn.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true') });

  // Skills map: render interactive nodes with glow
  const skills = [
    {id:'ux',label:'UX Dizayn'},
    {id:'fe',label:'Frontend'},
    {id:'ai',label:'AI / ML'},
    {id:'sys',label:'Tizimlar'},
    {id:'perf',label:'Ishlash'}
  ];
  const map = document.getElementById('skills-map');
  if(map){
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS,'svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','320');
    const w = map.clientWidth || 800;
    const pos = [
      {x:20,y:50, id:'ux'},
      {x:60,y:30, id:'fe'},
      {x:78,y:70, id:'ai'},
      {x:40,y:75, id:'sys'},
      {x:62,y:50, id:'perf'}
    ];
    // draw glow filter
    const defs = document.createElementNS(svgNS,'defs');
    const filter = document.createElementNS(svgNS,'filter');
    filter.setAttribute('id','glow');
    const feGaussianBlur = document.createElementNS(svgNS,'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation','3');
    feGaussianBlur.setAttribute('result','coloredBlur');
    filter.appendChild(feGaussianBlur);
    const feMerge = document.createElementNS(svgNS,'feMerge');
    const feMergeNode1 = document.createElementNS(svgNS,'feMergeNode');
    feMergeNode1.setAttribute('in','coloredBlur');
    const feMergeNode2 = document.createElementNS(svgNS,'feMergeNode');
    feMergeNode2.setAttribute('in','SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);
    
    pos.forEach(p=>{
      const circle = document.createElementNS(svgNS,'circle');
      circle.setAttribute('cx',p.x+'%');
      circle.setAttribute('cy',p.y+'%');
      circle.setAttribute('r','28');
      circle.setAttribute('fill','#11161f');
      circle.setAttribute('stroke','#00d4ff');
      circle.setAttribute('stroke-width','2');
      circle.setAttribute('filter','url(#glow)');
      circle.style.cursor='pointer';
      circle.style.transition='all .3s cubic-bezier(.2,.9,.2,1)';
      circle.addEventListener('mouseenter', ()=>{
        circle.setAttribute('r','36');
        circle.setAttribute('stroke-width','3');
      });
      circle.addEventListener('mouseleave', ()=>{
        circle.setAttribute('r','28');
        circle.setAttribute('stroke-width','2');
      });
      circle.addEventListener('click', ()=> alert(p.id + ' — ' + skills.find(s=>s.id===p.id).label));
      svg.appendChild(circle);
      const text = document.createElementNS(svgNS,'text');
      text.setAttribute('x',p.x+'%');
      text.setAttribute('y',p.y+'%');
      text.setAttribute('dominant-baseline','middle');
      text.setAttribute('text-anchor','middle');
      text.setAttribute('fill','#00d4ff');
      text.setAttribute('font-size','11');
      text.setAttribute('font-weight','600');
      text.textContent = skills.find(s=>s.id===p.id).label.split(' ')[0];
      svg.appendChild(text);
    });
    map.appendChild(svg);
  }

  // Confidence slider with animated visual
  const slider = document.getElementById('confidence');
  const confVis = document.getElementById('confidence-visual');
  if(slider && confVis){
    const update = ()=>{
      const v = slider.value;
      confVis.style.height = (20 + v*1.6) + 'px';
      confVis.style.background = `linear-gradient(90deg, rgba(0,212,255,${v/120}), rgba(255,0,110,${(100-v)/400}))`;
      confVis.style.boxShadow = `0 0 16px rgba(0,212,255,${v/150})`;
    };
    slider.addEventListener('input', update);
    update();
  }

  // keyboard support for 'link' buttons
  document.querySelectorAll('.project').forEach(p=>{
    p.addEventListener('keydown', (e)=>{ if(e.key==='Enter') p.querySelector('.link')?.click() });
  });

  // Add glow effect to project cards on hover
  document.querySelectorAll('.project').forEach(p=>{
    p.addEventListener('mouseenter', ()=>{
      p.style.boxShadow = '0 0 30px rgba(0,212,255,0.4)';
    });
    p.addEventListener('mouseleave', ()=>{
      p.style.boxShadow = '';
    });
  });

})();