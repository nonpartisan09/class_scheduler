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
    #PORTFOLIO
\* -------------------- */

/* Requires isotope.pkgd.min.js & imagesloaded.pkgd.min.js */

/**
 * Isotope filtering
 */

// init Isotope
var $container = $('.portfolio__items').imagesLoaded( function() {
    $container.isotope({
        itemSelector: '.filter__item',
        layoutMode: 'fitRows'
    });
});
// filter items on button click
$('.filter__nav > li > a').on('click', function() {
    var filterValue = $(this).attr('data-filter');
    $container.isotope({ filter: filterValue });
});

/**
 * Columns setup
 */

$('.columns__nav > li > a').on('click', function() {
    var bootstrapGrid = $(this).data('grid');
    $('.portfolio__items > .row > div').removeClass('col-sm-3 col-sm-4 col-sm-6 col-md-3').addClass(bootstrapGrid);
    $container.isotope('layout');
});