
(function ($) {
    $('.r-nav-menu ul li').on('click',function(){
        $('.r-nav-menu_').removeClass('active');
        $(this).toggleClass("active" );
     })

     function inputButtonCamp(){
        $("#send_sms .select2").show();
        $("#send_sms .action-send-2").show();

        $("#send_sms #number").hide();
        $("#send_sms .action-send").hide();

        $("#tempNameContact").val("");
     }

     /**
     * Menu campaigne
     */

    $('.r-nav-menu_1').on('click', function(){
        inputButtonCamp();

        $('#rCampaigne').removeClass('dNone');
        $('#rCampaigne').addClass('dBlock');

        $('#rContact').removeClass('dBlock');
        $('#rContact').addClass('dNone');

        $('#rInbox').removeClass('dBlock');
        $('#rInbox').addClass('dNone');

        $('#rHistory').removeClass('dBlock');
        $('#rHistory').addClass('dNone');
    })

    /**
     * Menu Contact
     */
    $('.r-nav-menu_2').on('click', function(){
        inputButtonCamp();

        $('.send-new-sms #number').val("");
        $('.send-new-sms #number').attr('disabled', false);
        $('.send-new-sms #messageContent').val("");

        $('.send-new-sms span.name-dest').empty();

        $('#rCampaigne').removeClass('dBlock');
        $('#rCampaigne').addClass('dNone');

        $('#rContact').removeClass('dNone');
        $('#rContact').addClass('dBlock');

        $('#rInbox').removeClass('dBlock');
        $('#rInbox').addClass('dNone');

        $('#rHistory').removeClass('dBlock');
        $('#rHistory').addClass('dNone');
    })

    /**
     * Menu reception
     */
    $('.r-nav-menu_3').on('click', function(){
        $('#rCampaigne').removeClass('dBlock');
        $('#rCampaigne').addClass('dNone');

        $('#rContact').removeClass('dBlock');
        $('#rContact').addClass('dNone');

        $('#rInbox').removeClass('dNone');
        $('#rInbox').addClass('dBlock');

        $('#rHistory').removeClass('dBlock');
        $('#rHistory').addClass('dNone');
    })

    /**
     * Menu Historique
     */
    $('.r-nav-menu_4').on('click', function(){
        $('#rCampaigne').removeClass('dBlock');
        $('#rCampaigne').addClass('dNone');

        $('#rContact').removeClass('dBlock');
        $('#rContact').addClass('dNone');

        $('#rInbox').removeClass('dBlock');
        $('#rInbox').addClass('dNone');

        $('#rHistory').removeClass('dNone');
        $('#rHistory').addClass('dBlock');
    })


})(jQuery);