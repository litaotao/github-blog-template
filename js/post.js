$(document).ready(function(){

    $('pre').addClass('prettyprint linenums'); // Google code Hight need these class
    $.getScript('/js/prettify/prettify.js', function(){ prettyPrint(); });

    markExternalLink();

    (function() {
      var ie6 = ($.browser.msie && $.browser.version=="6.0") ? true : false;
      function initHeading(){
        var h2 = [];
        var h3 = [];
        var h2index = 0;
        $.each($('.entry h2, .entry h3'), function(index,item) {
          if(item.tagName.toLowerCase() == 'h2') {
            h2.push({name: $(item).text(), id: 'menuIndex' + index });
            h2index++;
          } else {
            if(!h3[h2index-1]) { h3[h2index-1] = []; }
            h3[h2index-1].push({ name: $(item).text(), id: 'menuIndex' + index });
          }
          item.id = 'menuIndex' + index;
        });
        return { h2: h2, h3: h3 };
      }
      function genTmpl(){
        var h1txt = $('h1').text();
        var tmpl = '<ul><li class="h1"><a class="menuItem" href="#">' + h1txt + '</a></li>';
        var heading = initHeading();
        var h2 = heading.h2;
        var h3 = heading.h3;
        for(var i=0;i<h2.length;i++) {
          tmpl += '<li><a href="#" class="menuItem" data-id="'+h2[i].id+'">'+h2[i].name+'</a></li>';
          if(h3[i]) {
            for(var j=0;j<h3[i].length;j++){
              tmpl += '<li class="h3"><a href="#" class="menuItem" data-id="'+h3[i][j].id+'">'+h3[i][j].name+'</a></li>';
            }
          }
        }
        tmpl += '</ul>';
        return tmpl;
      }
      function genIndex(){
        var tmpl = genTmpl();
        var indexCon = '<h2>目录</h2>';
        $('#menuIndex #menu').append(indexCon).append($(tmpl))
          .delegate('a.menuItem', 'click', function(e) {
            e.preventDefault();
            var selector = $(this).attr('data-id') ? '#'+$(this).attr('data-id') : 'h1'
            var scrollNum = $(selector).offset().top;
            $('body, html').animate({ scrollTop: scrollNum-30 }, 400, 'swing');
          });
      }

      if($('.entry h2').length > 2 && !isMobile.any() && !ie6) {
        genIndex();
        if ($(window).width() > 750) {
          $(window).load(function(){
            var scrollTop = [];
            $.each($('#menuIndex li a'),function(index,item){
              var selector = $(item).attr('data-id') ? '#'+$(item).attr('data-id') : 'h1'
              var top = $(selector).offset().top;
              scrollTop.push(top);
            });
            var menuIndexTop = $('#menuIndex').offset().top;
            var menuIndexLeft = $('#menuIndex').offset().left;
            $(window).scroll(function() {
              waitForFinalEvent(function() {
                var nowTop = $(window).scrollTop();
                var length = scrollTop.length;
                var index;
                if(nowTop+20 > menuIndexTop){
                  $('#menuIndex').css({ position:'fixed', top:'20px', left:menuIndexLeft });
                } else {
                  $('#menuIndex').css({ position:'static', top:0, left:0 });
                }
                if(nowTop+60 > scrollTop[length-1]) {
                  index = length;
                } else {
                  for(var i=0; i < length; i++) {
                    if(nowTop+60 <= scrollTop[i]) {
                      index = i;
                      break;
                    }
                  }
                }
                $('#menuIndex li').removeClass('on');
                $('#menuIndex li').eq(index-1).addClass('on');
              });
            });
            $(window).resize(function(){
              $('#menuIndex').css({ position:'static', top:0, left:0 });
              menuIndexTop = $('#menuIndex').offset().top;
              menuIndexLeft = $('#menuIndex').offset().left;
              $(window).trigger('scroll')
              $('#menuIndex').css('max-height',$(window).height()-80);
            });
          })
          // calculate window height
          $('#menuIndex').css('max-height',$(window).height()-80);
        }
      }
    })();

    if(/\#comment/.test(location.hash)){
      $('#disqus_container .comment').trigger('click');
    }

    (function lastModifedTime() {
      var $lm = $('span.lastModified');
      $.ajax({
        url: 'https://api.github.com/repos/litaotao/litaotao.github.io/commits?path=/' + $lm.data('source'),
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
          if (Object.prototype.toString.call(data) === '[object Array]' && data.length > 1) {
            $lm.append((new Date(Date.parse(data[0].commit.committer.date))).toLocaleString()).show(0);
          }
        }
      });
    })();

    (function setupAvatar() {
      var ah = $('div#avatarHolder');
      var a = $('div#avatar');

      if ($(window).width() > 750) {
        var pos1left = $('div#menuIndex').offset().left - 145;
        var pos2left = $('div#menuIndex').offset().left + 65;
        $(document).scroll(function() {
          var st = $(document).scrollTop();
          if (st > 20 && !a.data('in-right')) {
            a.data('in-right', true);
            ah.transition({ width: 150, height: 150 }, function() {
              a.transition({ left: pos2left });
            });
          } else if (st < 20 && a.data('in-right')) {
            a.data('in-right', false);
            a.transition({ left: pos1left }, function() {
              ah.transition({ width: 0, height: 0 });
            });
          }
        });
        a.transition({ left: pos1left, scale: 2.5 }).transition({ opacity: 1, scale: 1 }, 800, 'ease');
      } else {
        ah.transition({ 'margin-top': 10 }).transition({ width: 100, height: 100 }, function() {
          $('div.entry').transition({ 'margin-top': $('div#menuIndex').outerHeight() });
          var pos1left = ah.offset().left;
          a.transition({ 'margin-top': 10, left: pos1left, scale: 2.5 }).transition({ opacity: 1, scale: 1 }, 800, 'ease');
        });
      }
    })();
});
