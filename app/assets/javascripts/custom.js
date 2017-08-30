/*------------------------------------------------------------------
Project:    Beatrix
Author:     Yevgeny Simzikov
URL:        http://simpleqode.com/
            https://twitter.com/YevSim
Version:    1.0.2
Created:        14/10/2014
Last change:    14/06/2016
-------------------------------------------------------------------*/


/**
 * CONTENTS
 *
 *
 * PRELOADER.....................Preloader
 *
 * NAVBAR........................Dropdown submenu positioning
 *
 * WOW ANIMATIONS................WOW elements bottom offset calculation
 *
 * RATING........................Rating stars: new rating
 *
 * PRICING TABLE.................Hide/show pricing body (xs screens only)
 *
 * KEY FEATURES..................Features item icon animation
 *
 * FOOTER........................Sticky footer position calculation
 *
 *
 */


/* -------------------- *\
    #PRELOADER
\* -------------------- */

$(window).load(function() {
    $('.preloader__img').fadeOut(500);
    $('.preloader').delay(1000).fadeOut(500);
});


/* -------------------- *\
    #NAVBAR
\* -------------------- */

/**
 * Dropdown submenu positioning (left or right)
 */

$('ul.dropdown-menu a[data-toggle=dropdown]').hover(function() {
    var menu = $(this).parent().find("ul");
    var menupos = menu.offset();
    if ((menupos.left + menu.width()) + 30 > $(window).width()) {
        $(this).parent().addClass('pull-left');   
    }
    return false;
});


/* -------------------- *\
    #WOW ANIMATIONS
\* -------------------- */

/* Requires wow.min.js */

/**
 * Wow plugin bottom offset calculation
 */

$(".wow").each(function() {
    var wowHeight = $(this).height();
    $(this).attr("data-wow-offset", wowHeight);
});

new WOW().init();


/* -------------------- *\
    #RATING
\* -------------------- */

/**
 * Rating stars: new rating
 */

$(".rating-stars__new > li").on('click', function() {
    var starIndex = $(this).index() + 1;
    $(".rating-stars__new > li > i").removeClass("fa-star-o fa-star").addClass("fa-star-o");
    $(".rating-stars__new > li:nth-child(-n+" + starIndex + ") > i").toggleClass("fa-star-o fa-star");
});


/* -------------------- *\
    #PRICING TABLE
\* -------------------- */

/**
 * Hide/show pricing body (xs screens only)
 */

$(".pricing__header").on('click', function() {
    $(this).find(".pricing__price").toggleClass("show");
    $(this).next(".pricing__body").toggleClass("show");
    return false;
});


/* -------------------- *\
    #KEY FEATURES
\* -------------------- */

/**
 * Features item icon animation
 */

$(".features__item").hover(function() {
    $(this).find("i.fa").removeClass("features-icon_leave").addClass("features-icon_enter");
}, function() {
    $(this).find("i.fa").removeClass("features-icon_enter").addClass("features-icon_leave");
});


/* -------------------- *\
    #FOOTER
\* -------------------- */

/**
 * Sticky footer position calculation
 */

function footerSize() {
    var footerOuterHeight = $('footer').outerHeight(true);
    var footerHeight = $('footer').height();
    $("body").css("margin-bottom", footerOuterHeight);
    /* Contact Us section on index.html & index_carousel.html 
       should stick to footer */
    $("body.body_index").css("margin-bottom", footerHeight);
    return false;
}
footerSize();
$(window).resize(footerSize);