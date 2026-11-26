/* Яндекс Метрика, цели и уведомление о cookie */
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(114697430, "init", {clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true});

(function () {
  function goal(name, params) { try { ym(114697430, "reachGoal", name, params); } catch (e) {} }

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var h = a.getAttribute("href") || "";
    if (h.indexOf("primer-razbora") > -1) goal("open_sample");
    else if (h.indexOf("mailto:") === 0) goal("email_click");
    else if (a.dataset && a.dataset.tariff) goal("tariff_select", {tariff: a.dataset.tariff});
    else if (h === "#zakaz") goal("cta_order");
  });

  var prices = document.getElementById("ceny");
  if (prices && "IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (items) {
      items.forEach(function (it) { if (it.isIntersecting) { goal("prices_view"); seen.disconnect(); } });
    }, {threshold: 0.4});
    seen.observe(prices);
  }

  var form = document.querySelector("form.form");
  if (form) form.addEventListener("submit", function () {
    var s = document.getElementById("tariff");
    goal("form_submit", {tariff: s ? s.options[s.selectedIndex].text : ""});
  });

  if (/spasibo/.test(location.pathname)) goal("order_sent");

  var ok = false;
  try { ok = localStorage.getItem("cookie_ok") === "1"; } catch (e) {}
  if (!ok) {
    var bar = document.createElement("div");
    bar.className = "cookie";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Уведомление о cookie");
    bar.innerHTML = '<p>Сайт использует cookie и Яндекс Метрику, чтобы понимать, как им пользуются. Подробнее — в <a href="/privacy.html">политике конфиденциальности</a>.</p><button type="button" class="btn btn--sm">Понятно</button>';
    bar.querySelector("button").addEventListener("click", function () {
      try { localStorage.setItem("cookie_ok", "1"); } catch (e) {}
      bar.remove();
    });
    document.body.appendChild(bar);
  }
})();
