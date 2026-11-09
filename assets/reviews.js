(function(){
var C={url:"https://xggkhhhhnktwrauhpjvk.supabase.co",key:"sb_publishable_WHOZs7AXxxUhH5bbEhyAyw_BUq_qgdF"};
var H={apikey:C.key,Authorization:"Bearer "+C.key};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function stars(n){return "★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n)}
/* ---------- list ---------- */
var sec=document.querySelector("[data-reviews-section]");
if(sec){
  var lang=sec.getAttribute("data-lang")||"ar",limit=sec.getAttribute("data-limit")||"6";
  fetch(C.url+"/rest/v1/reviews?select=name,company,rating,comment&lang=eq."+lang+"&order=created_at.desc&limit="+limit,{headers:H})
  .then(function(r){return r.ok?r.json():[]}).then(function(rows){
    if(!rows||!rows.length)return;
    var g=sec.querySelector("[data-reviews-list]");
    rows.forEach(function(r){
      var c=el("article","rv-card");
      c.appendChild(el("div","rv-stars",stars(r.rating))).setAttribute("aria-label",r.rating+" / 5");
      c.appendChild(el("p","rv-text",r.comment));
      var b=el("div","rv-by",r.name);if(r.company)b.appendChild(el("span",null,r.company));
      c.appendChild(b);g.appendChild(c);
    });
    sec.hidden=false;
  }).catch(function(){});
}
/* ---------- form ---------- */
var f=document.getElementById("reviewForm");
if(f){
  var L=f.getAttribute("data-lang")||"ar",T={
    ar:{rate:"اختر عدد النجوم.",short:"اكتب رأيك في 10 أحرف على الأقل.",name:"اكتب اسمك.",consent:"يلزم الموافقة على نشر التقييم.",ok:"شكراً لك! وصلنا تقييمك، وسيظهر في الموقع بعد مراجعته من فريق إتقان.",err:"تعذر إرسال التقييم الآن. حاول بعد قليل أو راسلنا على info@itqanbs.sa.",wait:"أرسلت تقييماً قبل قليل. شكراً لك، ويمكنك الإرسال مرة أخرى لاحقاً.",send:"إرسال التقييم",sending:"جارٍ الإرسال..."},
    en:{rate:"Please choose a star rating.",short:"Please write at least 10 characters.",name:"Please enter your name.",consent:"You need to agree to publishing your review.",ok:"Thank you! We received your review. It will appear on the site after Itqan's team reviews it.",err:"We couldn't send your review right now. Try again shortly or email info@itqanbs.sa.",wait:"You just sent a review. Thank you, you can send another later.",send:"Send review",sending:"Sending..."}
  }[L];
  var t0=Date.now(),labels=[].slice.call(f.querySelectorAll(".rv-rate label")),msg=f.querySelector(".rv-msg"),btn=f.querySelector(".rv-btn");
  function paint(n){labels.forEach(function(l,i){l.classList.toggle("on",i<n)})}
  function cur(){var c=f.querySelector("input[name=rating]:checked");return c?+c.value:0}
  labels.forEach(function(l,i){l.addEventListener("mouseenter",function(){paint(i+1)});l.addEventListener("mouseleave",function(){paint(cur())});});
  f.addEventListener("change",function(){paint(cur())});
  function show(k,x){msg.className="rv-msg "+k;msg.textContent=x;msg.hidden=false;msg.scrollIntoView({block:"nearest",behavior:"smooth"})}
  f.addEventListener("submit",function(e){
    e.preventDefault();msg.hidden=true;
    if(f.website.value)return; /* honeypot */
    var d={name:f.rname.value.trim(),company:f.company.value.trim()||null,email:f.email.value.trim()||null,rating:cur(),comment:f.comment.value.trim(),lang:L,consent:f.consent.checked};
    if(d.name.length<2)return show("err",T.name);
    if(!d.rating)return show("err",T.rate);
    if(d.comment.length<10)return show("err",T.short);
    if(!d.consent)return show("err",T.consent);
    try{if(Date.now()-(+localStorage.getItem("itqan_rv")||0)<60000)return show("err",T.wait)}catch(x){}
    if(Date.now()-t0<3000)return show("err",T.err);
    btn.disabled=true;btn.textContent=T.sending;
    fetch(C.url+"/rest/v1/reviews",{method:"POST",headers:{apikey:C.key,Authorization:"Bearer "+C.key,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(d)})
    .then(function(r){if(!r.ok)throw 0;try{localStorage.setItem("itqan_rv",Date.now())}catch(x){}f.reset();paint(0);show("ok",T.ok)})
    .catch(function(){show("err",T.err)})
    .then(function(){btn.disabled=false;btn.textContent=T.send});
  });
}
})();
