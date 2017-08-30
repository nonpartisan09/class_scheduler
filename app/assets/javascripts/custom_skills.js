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
    #SKILLS
\* -------------------- */

/* Requires jquery.waypoints.min.js & inview.min.js */

/**
 * Skills chart animation
 */

var inview = new Waypoint.Inview({
    element: $(".skills"),
    entered: function(direction) {
        $(".skills-grid__col").each(function() {
            var left = $(this).data('left');
            $(this).animate({
                opacity: 1,
                left: left
            }, 1200);
        });
        $(".skills-progress__bar").each(function () {
            var width = $(this).data('width');
            var delay = $(this).data('queue')*300;
            $(this).css("opacity", "1").delay(1200+delay).animate({
                width: width
            }, 1200);
        });
    }
});