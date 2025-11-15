
document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  });

  // Slider
  const slides = Array.from(document.querySelectorAll('.slide'));
  if(slides.length){
    let idx = 0;
    const show = i => slides.forEach((s,si)=> s.classList.toggle('active', si===i));
    show(0);
    document.getElementById('next')?.addEventListener('click', ()=>{ idx=(idx+1)%slides.length; show(idx); });
    document.getElementById('prev')?.addEventListener('click', ()=>{ idx=(idx-1+slides.length)%slides.length; show(idx); });
    setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 4500);
  }

  // Order form submit
  const form = document.getElementById('order-form');
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      const msg = document.getElementById('form-message');
      msg.textContent = 'Sending order...';
      const api = form.dataset.api;
      const fd = new FormData(form);
      const ingredients = Array.from(form.querySelectorAll('input[name="ing"]:checked')).map(i=>i.value);
      const payload = {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        flavor: fd.get('flavor'),
        quantity: fd.get('quantity'),
        delivery: fd.get('delivery'),
        message_on_cookie: fd.get('message_on_cookie'),
        notes: fd.get('notes'),
        ingredients: ingredients.join(', ')
      };
      if(api){
        try{
          const res = await fetch(api, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
          if(res.ok){ msg.textContent = 'Order sent! Check your email for confirmation.'; form.reset(); }
          else { msg.textContent = 'Order failed: '+await res.text(); }
        }catch(err){ msg.textContent = 'Network error: '+err.message; }
      } else {
        setTimeout(()=>{ msg.textContent='Demo: order received.'; form.reset(); },800);
      }
    });
  }

  // Contact form
  const cform = document.getElementById('contact-us-form');
  if(cform){
    cform.addEventListener('submit', async function(e){
      e.preventDefault();
      if(!cform.checkValidity()){ cform.reportValidity(); return; }
      const msg = document.getElementById('contact-msg');
      msg.textContent = 'Sending...';
      const api = cform.dataset-api || '/.netlify/functions/sendOrder';
      const fd = new FormData(cform);
      const payload = { type: 'contact', name: fd.get('name'), email: fd.get('email'), message: fd.get('message') };
      try{
        const res = await fetch(api, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(res.ok){ msg.textContent='Message sent! We will reply shortly.'; cform.reset(); }
        else msg.textContent='Failed to send: '+await res.text();
      }catch(err){ msg.textContent='Network error: '+err.message; }
    });
  }
});
