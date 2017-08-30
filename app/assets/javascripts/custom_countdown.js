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
    #COUNTDOWN
\* -------------------- */

/* Requires jquery.countdown.min.js, jquery.plugin.min.js */

/**
 * Countdown: Coming Soon page
 */

$(function () {
    var austDay = new Date();
    austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
    $('#countdown').countdown({until: austDay});
    $('#year').text(austDay.getFullYear());
});