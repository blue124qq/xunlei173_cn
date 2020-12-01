(function ($) {
  Drupal.behaviors.ws_fs = {
    scriptadded: false,

    attach: function (context, settings) {
      if (!this.scriptadded) {
        var fdiv_root, js, div_root ;
        var fjs = document.getElementsByTagName('script')[0];

        if (!document.getElementById('fb-root')) {
          div_root = document.createElement('div');
          div_root.id = 'fb-root';
          document.body.appendChild(div_root);
        }

        if (!document.getElementById('facebook-jssdk')) {
          js = document.createElement('script'); 
          js.id = 'facebook-jssdk';
          js.src = "//connect.facebook.net/" + Drupal.settings.ws_fs.locale + "/all.js#xfbml=1&appId=" + Drupal.settings.ws_fs.app_id;
          fjs.parentNode.insertBefore(js, fjs);
          this.scriptadded = true;
        }
      }

      $('a.service-links-facebook-share', context).once(function(){
        var f_text = document.createElement('fb:share-button');
        var css = Drupal.settings.ws_fs.css.split(';');
        var key_value = new Array();

        f_text.setAttribute('type', Drupal.settings.ws_fs.type);
        f_text.setAttribute('href', $(this).attr('rel'));

        for (i = 0; i < css.length; i++){
          key_value = css[i].split(':');
          $(f_text).css(key_value[0], key_value[1]);
        }

        $(this).replaceWith(f_text);
      });
    }
  }
})(jQuery);
;
(function ($) {
  Drupal.behaviors.ws_tb ={
    scriptadded: false,

    attach: function(context, settings) {
      if (this.scriptadded) {
        twttr.widgets.load();
      } else {
        $('a.service-links-twitter-widget', context).each(function(){
          $(this).attr('href', $(this).attr('href').replace(/((?:counturl\=|^))http[s]*\%3A\/\//g, "$1"));
        });
        $.getScript(window.location.protocol + '//platform.twitter.com/widgets.js', function () {
          this.scriptadded = true;
        });
      }
    }
  }
})(jQuery);
;
(function ($) {
  Drupal.behaviors.ws_pb = {
    attach: function(context, settings) {
      var $buttons = $('a.service-links-pinterest-button', context).once('service-links-pinterest-button');
      $buttons.each(function(){
        $(this).attr('count-layout', Drupal.settings.ws_pb.countlayout);
      });
      $.getScript( '//assets.pinterest.com/js/pinit.js' );
    }
  }
})(jQuery);
;
