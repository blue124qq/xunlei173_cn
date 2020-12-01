$(window).bind("load resize", function () {
    var iframeInitW = $('.bodyText iframe').attr('width');
    var iframeInitH = $('.bodyText iframe').attr('height');
    var ratio = (iframeInitH / iframeInitW);
    var iframeW = $('.bodyText iframe').width();
    var iframeNewW = iframeW * ratio;
    $('.bodyText iframe').css('height', iframeNewW);
});