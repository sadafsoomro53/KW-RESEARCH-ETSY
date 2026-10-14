// Conservative page helper: reads visible Etsy result titles only when invoked via the extension.
(function(){
  if (window.__etsyKeywordLabLoaded) return;
  window.__etsyKeywordLabLoaded = true;
  // Future enhancement: add an explicit user-triggered "Capture visible listing titles" control.
  // No background scraping, login bypass, or automatic high-volume requests.
})();