/*------------------------------------------------------------------
Project:    Beatrix
Author:     Yevgeny Simzikov
URL:        http://simpleqode.com/
            https://twitter.com/YevSim
Version:    1.0.2
Created:        14/10/2014
Last change:    14/06/2016
-------------------------------------------------------------------*/


/* -------------------- *\
    #UI ELEMENTS
\* -------------------- */

/* Requires smoothscroll.js */

/**
 * Smooth Scrolling
 */

$(document).ready(function(){
    $('a[href*=#ui_typography], a[href*=#ui_tables], a[href*=#ui_buttons], a[href*=#ui_tabs], a[href*=#ui_pills], a[href*=#ui_pagination], a[href*=#ui_pager], a[href*=#ui_progress-bars], a[href*=#ui_list-groups], a[href*=#ui_panels], a[href*=#ui_accordion], a[href*=#ui_carousel]').bind("click", function(e){
    var anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top
    }, 1000);
        e.preventDefault();
    });
    return false;
});

/**
 * Sidebar affix
 */

$('.ui__sidebar').affix({
    offset: {
        top: 170,
        bottom: 0
    }
});