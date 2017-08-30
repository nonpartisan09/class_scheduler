/*------------------------------------------------------------------
Project:    Wolfram
Author:     Andrey
Owner:      Yevgeny Simzikov
URL:        http://simpleqode.com/
            https://twitter.com/YevSim
Version:    1.1
Created:        18/08/2014
Last change:    10/11/2014
-------------------------------------------------------------------*/


/**
 * Contact form
 */

$(document).ready(function(e) {
    $('#form_sendemail').submit(function(e) {
        $.ajax({
            url: 'sendmail.php',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            beforeSend: function (XMLHttpRequest) {
                //
                $('.contact__form').fadeTo("slow", 0.33);
                $('#form_sendemail .has-error').removeClass('has-error');
                $('#form_sendemail .help-block').html('');
                $('#form_message').removeClass('alert-success').html('');
            },
            success: function( json, textStatus ) {
                if( json.error ) {
                    // Error messages
                    if( json.error.name ) {
                        $('#form_sendemail input[name="name"]').parent().addClass('has-error');
                        $('#form_sendemail input[name="name"]').next('.help-block').html( json.error.name );
                    }
                    if( json.error.email ) {
                        $('#form_sendemail input[name="email"]').parent().addClass('has-error');
                        $('#form_sendemail input[name="email"]').next('.help-block').html( json.error.email );
                    }
                    if( json.error.message ) {
                        $('#form_sendemail textarea[name="message"]').parent().addClass('has-error');
                        $('#form_sendemail textarea[name="message"]').next('.help-block').html( json.error.message );
                    }
                    if( json.error.recaptcha ) {
                        $('#form-captcha .help-block').addClass('has-error');
                        $('#form-captcha .help-block').html( json.error.recaptcha );
                    }
                }
                // Refresh Captcha
                Recaptcha.reload();
                //
                if( json.success ) {
                    $('#form_message').addClass('alert-success').html( json.success );
                    setTimeout(function(){
                       $('#form_message').removeClass('alert-success').html('');
                    },4000);
                }
                
            },
            complete: function( XMLHttpRequest, textStatus ) {
                //
                $('.contact__form').fadeTo("fast", 1);
            }
        });
        
        return false;
    });
});