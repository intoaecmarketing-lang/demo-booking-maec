!function(){"use strict";
/* Optional direct tags. Leave an ID as a placeholder (contains "XXX") to skip it —
   GA4 already loads through GTM, so these are only needed if used outside GTM.
   Real ones load on first interaction, same as GTM, to stay off the critical path. */
var GA_ID="G-XXXXXXXXXX",FB_ID="XXXXXXXXXXXXXXX",CLARITY_ID="xxxxxxxxxx";
function real(id){return id&&!/x{3}/i.test(id)}
function load(){
  if(real(GA_ID)){var s=document.createElement("script");s.async=!0;s.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag("js",new Date);window.gtag("config",GA_ID)}
  if(real(FB_ID)){!function(e,t,n,a,o,i){e.fbq||(a=e.fbq=function(){a.callMethod?a.callMethod.apply(a,arguments):a.queue.push(arguments)},e._fbq||(e._fbq=a),a.push=a,a.loaded=!0,a.version="2.0",a.queue=[],(o=t.createElement(n)).async=!0,o.src="https://connect.facebook.net/en_US/fbevents.js",(i=t.getElementsByTagName(n)[0]).parentNode.insertBefore(o,i))}(window,document,"script");window.fbq("init",FB_ID);window.fbq("track","PageView")}
  if(real(CLARITY_ID)){!function(a,o,i){a[i]=a[i]||function(){(a[i].q=a[i].q||[]).push(arguments)};var d=o.createElement("script");d.async=1;d.src="https://www.clarity.ms/tag/"+CLARITY_ID;o.head.appendChild(d)}(window,document,"clarity")}
}
if(real(GA_ID)||real(FB_ID)||real(CLARITY_ID)){var l=0;["scroll","click","touchstart","keydown","mousemove"].forEach(function(e){window.addEventListener(e,function(){l||(l=1,load())},{once:!0,passive:!0})})}
window.trackConversion=function(e){(window.dataLayer=window.dataLayer||[]).push({event:e,event_category:"lead_gen"});window.gtag&&real(GA_ID)&&window.gtag("event",e,{event_category:"lead_gen"});window.fbq&&window.fbq("trackCustom",e);window.clarity&&window.clarity("event",e)};
}();
