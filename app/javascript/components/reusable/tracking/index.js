function gtag_formsent_conversion(destination) {
   gtag('event', 'conversion', {'send_to': destination});
}
//Event snippet for Click on Link conversion page 
function gtag_click_conversion(url, destination) {
    const callback = function() {
        if (typeof url !== "undefined") {
            window.location = url;
        }
    };
    gtag("event", "conversion", {
        send_to: destination,
        event_callback: callback
    });

    return false;
}



const opts = {
    facebook_es: "AW-697005015/-SrXCPyDiMABENfnrcwC",
    facebook_en: 'AW-697005015/L1DqCMP5_r8BENfnrcwC',
    linkedin_es: "AW-697005015/P0M2CImCiMABENfnrcwC",
    linkedin_en: 'AW-697005015/u4jmCIKC7b8BENfnrcwC',
    phone_es: 'AW-697005015/EPjHCNKnurYBENfnrcwC',
    phone_en: 'AW-697005015/CGpXCML_rrYBENfnrcwC',
    email_es: 'AW-697005015/ax6ICLeeurYBENfnrcwC',
    email_en: 'AW-697005015/qMpwCPfdo7YBENfnrcwC',
    signform_es: 'AW-697005015/XeniCIGYurYBENfnrcwC',
    signform_en: 'AW-697005015/8YtECNPjrrYBENfnrcwC',
    joinus_es: 'AW-697005015/_SZLCN3hrrYBENfnrcwC',
    joinus_en: 'AW-697005015/55VRCOXarrYBENfnrcwC',
    signup_es: 'AW-697005015/h04SCM28o7YBENfnrcwC',
    signup_en: 'AW-697005015/g74pCOf0ubYBENfnrcwC'
}

export { gtag_formsent_conversion, gtag_click_conversion, opts };