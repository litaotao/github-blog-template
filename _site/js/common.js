var isMobile = {
  Android: function() { return navigator.userAgent.match(/Android/i); },
  BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
  iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
  Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
  Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
  any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

function markExternalLink() {
  $('.entry a').each(function(index, elem){
    var href = $(this).attr('href');
    var host = window.location.host;
    if (href) {
      if (href.indexOf('#') === 0) {
        // in page anchor
      } else if ( href.indexOf('/') == 0 || href.toLowerCase().indexOf(host)>-1 ) {
        // same domain link
      } else if ($(elem).has('img').length) {
        // ignore imgs
      } else {
        $(this).attr('target','_blank');
        $(this).addClass('external');
      }
    }
  });
}

var waitForFinalEvent = (function() {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
    if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();
