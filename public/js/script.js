
$(document).ready(function(){
    var scroll_start = 0;
    var startchange = $('#startchange');
    var offset = startchange.offset();
    $(document).scroll(function() {
        scroll_start = $(this).scrollTop();
        if(scroll_start > offset.top) {
            $('#navbar').css('background-color', 'rgba(255,255,255,.9)');
            $('#navbar-brand').css('color', 'black');
            $('.nav-link').css('color', 'black');
        } else {
            $('#navbar').css('background-color', 'transparent');
            $('#navbar-brand').css('color', 'white');
            $('.nav-link').css('color', 'white');
        }
    });
});