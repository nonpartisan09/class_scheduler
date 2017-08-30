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
    #COUNT TO
\* -------------------- */

/* Requires jquery.waypoints.min.js, inview.min.js & counter.js*/

var inview = new Waypoint.Inview({
    element: $('.counter'),
    entered: function(direction) {
        $('.counter__number').countTo();
    },
    exited: function(direction) {
        inview.destroy();
    }
});