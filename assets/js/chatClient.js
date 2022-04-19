
$(document).ready(function(){
  const numTelUser = $("#telUser").val(); 

  /**
   * Initialisation Script
   */
   //getSMSInbound(); // lancement de récuperation liste des messages dans la boite de réception
 
  $('.chat-h-right .chat-profile img').on('click', function(){
    $('.drop-profil').toggleClass("active" );
 })

  setInterval(reloadFunction, 3000);

  function reloadFunction(){
    notifSMS(numTelUser);
  }

  /**************** Action inbound ********************** */

  getSMSInbound();
  getSMSInStory();
  
  /**
  * GET SMS JS TO INBOUND
  */
function getSMSInbound(){
  const numTelUser = $("#telUser").val(); 
   $.ajax("/api/find-sms-incoming-ajax", {
    data: {
      numTelUser: numTelUser,
    },
    success: function(data){
      // Supprimer la liste des messages
     $('ul.inbox li ul.list li').remove();

      // Rechercher les messages Inbound à l'aide d'une bloucle
      $.each(data, function(key, val){
        // Ajouter la liste des messages
        const numberFromTwilio = val.telExp;
          if(val.status == 0){
            /** 
            * Format date 
            */
             var d = new Date(val.dateIn);
             var month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

             var date = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
             var time = d.toLocaleTimeString().toLowerCase();

             var dateSMS = date + " " + time;

             // Limit caractère
             var nbCaractereSMS = val.messageIn;
              if(nbCaractereSMS.length >= 25 ){
                  var valeur = nbCaractereSMS.substring(0,25);
                  nbCaractereSMS = valeur + " ...";
                 // $(this).find("p").html(valeur + " ...");
              }

            $('ul.inbox li ul.list').append('<li class="clearfix li-inbox li-inbox'+key+'" title="'+val.messageIn+'"><div class="sym-sms"><i class="fa fa-arrow-down in-sms" title="Entrant"></i></div><div class="profil"><img src="img/profil.png" width="57px"></div><div class="about"><input type="tel" value='+ val.telExp +' > <!--hidden--><div class="name-clt"><span></span></div><div class="status">'+ val.telExp +'</div><div class="body-sms body-sms'+key+'"><p> '+nbCaractereSMS+'</p></div><div class="dateIn"> '+dateSMS+'</div></div></li>');
            $("ul.inbox li ul.list li.li-inbox"+key).on('click', function(){
                const numbertelClt = $(this).find('input[type=tel]').val();
                const divName_ = $(this).find(".name-clt").find("span").text();

                showLoading();
                answerInitShow();
                clickList(numbertelClt, divName_);
             });

             const divName = $("ul.inbox li ul.list li.li-inbox"+key).find(".name-clt");
             getNameContact(numberFromTwilio, divName);
          }else{
            /** 
            * Format date 
            */
             var d = new Date(val.dateIn);
             var month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

             var date = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
             var time = d.toLocaleTimeString().toLowerCase();

             var dateSMS = date + " " + time;

             // Limit caractère
             var nbCaractereSMS = val.messageIn;
              if(nbCaractereSMS.length >= 25 ){
                  var valeur = nbCaractereSMS.substring(0,25);
                  nbCaractereSMS = valeur + " ...";
                 // $(this).find("p").html(valeur + " ...");
              }

            $('ul.inbox li ul.list').append('<li class="clearfix incoming-list inc li-inbox li-inbox'+key+'" title="'+val.messageIn+'"><div class="sym-sms"><i class="fa fa-arrow-down in-sms" title="Entrant"></i></div><div class="ml-sms" id="'+val._id+'"><i class="fa fa-eye-slash l-sms" title="Marquer comme lu"></i></div><div class="profil"><img src="img/profil.png" width="57px"></div><div class="about"><input type="tel" value='+ val.telExp +' hidden> <!--hidden--> <input type="text" name="idInbox" value="'+val._id+'"> <!--hidden--><div class="name-clt"><span></span></div><div class="status">'+ val.telExp +'</div><div class="body-sms body-sms'+key+'"><p> '+nbCaractereSMS+'</p></div><div class="dateIn"> '+dateSMS+'</div></div></li>');
            $("#"+val._id).on('click', function(){
              $(this).parent().off().on("click");
              var id_ = this.id;
              var url = "/api/up-sms-incoming/"+id_;
              $("#"+id_).parent().removeClass("inc");
              upSMSIncominStatus(url);
              $(this).remove();
            });
            $("ul.inbox li ul.list li.li-inbox"+key).on('click', function(){
                const id = $(this).find("input[name=idInbox]").val();
                var url = "/api/up-sms-incoming/"+id;
                const numbertelClt = $(this).find('input[type=tel]').val();
                const divName_ = $(this).find(".name-clt").find("span").text();
                $(this).find(".ml-sms").remove();

                $(this).removeClass("inc");
                answerInitShow();
                showLoading();
                clickList(numbertelClt, divName_);
                upSMSIncominStatus(url);
             });
             const divName = $("ul.inbox li ul.list li.li-inbox"+key).find(".name-clt");
             getNameContact(numberFromTwilio, divName);
          }
      })
    }
  })
}

/**
  * GET SMS JS TO TWILIO (STORY)
  */
 function getSMSInStory(){
  const numTelUser = $("#telUser").val(); 
   $.ajax("/api/list-ajax/", {
    data: {
      numTelUser: numTelUser,
    },
    success: function(data){
      // Supprimer la liste des messages
     $('ul.story li ul.list li').remove();
      // Rechercher les messages du twilio à l'aide d'une bloucle
      $.each(data, function(key, val){
        // Ajouter la liste des messages
        const numberFromTwilio = val.from;
          if(val.direction == "inbound"){
             var d = new Date(val.dateSent);
             var month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

             var date = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
             var time = d.toLocaleTimeString().toLowerCase();

             var dateSMS = date + " " + time;
            //$('ul.story li ul.list').prepend('<li class="clearfix li-inbox li-inbox'+key+'" title="'+val.messageIn+'"><div class="sym-sms"><i class="fa fa-arrow-down in-sms" title="Entrant"></i></div><div class="profil"><img src="img/profil.png" width="57px"></div><div class="about"><input type="tel" value='+ val.telExp +' hidden> <!--hidden--><div class="name-clt"><span></span></div><div class="status">'+ val.telExp +'</div><div class="dateIn"> '+dateSMS+'</div></div></li>');
            $('ul.story li ul.list').append('<li class="clearfix lg-story li-inbox li-inbox'+key+'" title="'+val.body+'"><div class="tp-sms-in"><span>Client</span></div><div class="sym-sms"><i class="fa fa-arrow-down in-sms" title="Entrant"></i></div><div class="profil"><img src="img/profil.png" width="57px"></div><div class="about"><input type="tel" value="'+val.from+'" hidden> <!--hidden--><div class="name-clt"><span></span></div><div class="status">'+val.from+'</div><div class="dateIn">'+dateSMS+'</div></li>');
            $("ul.story li ul.list li.li-inbox"+key).on('click', function(){
                const numbertelClt = $(this).find('input[type=tel]').val();
                const divName_ = $(this).find(".name-clt").find("span").text();
                clickList(numbertelClt, divName_);
                answerInitHide();
             });
             const divName = $("ul.story li ul.list li.li-inbox"+key).find(".name-clt");
             getNameContact(numberFromTwilio, divName);
          }else{
             var d = new Date(val.dateSent);
              var month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

             var date = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
             var time = d.toLocaleTimeString().toLowerCase();

             var dateSMS = date + " " + time;
            $('ul.story li ul.list').append('<li class="clearfix lg-story li-inbox li-inbox'+key+'" title="'+val.body+'"><div class="tp-sms-out"><span>Vous</span></div><div class="sym-sms"><i class="fa fa-arrow-down out-sms" title="Sortant"></i></div><div class="profil"><img src="img/profil.png" width="57px"></div><div class="about"><input type="tel" value="'+val.from+'" hidden> <!--hidden--><div class="name-clt"><span></span></div><div class="status">'+val.from+'</div><div class="dateIn">'+dateSMS+'</div></div></li>');
            $("ul.story li ul.list li.li-inbox"+key).on('click', function(){
              const numbertelClt = $(this).find('input[type=tel]').val();
              const divName_ = $(this).find(".name-clt").find("span").text();
              clickList(numbertelClt, divName_);
              answerInitHide();
           });
           const divName = $("ul.story li ul.list li.li-inbox"+key).find(".name-clt");
           getNameContact(numberFromTwilio, divName);
          }
      })
    }
  })
}

$("ul.inbox li ul.list li").each(function() {
  const lengthLiInbox = $("ul.inbox li ul.list li.li-inbox").length;
  const inputTel = $(this).find("input").val();
  const divName = $(this).find(".name-clt");
  getNameContact(inputTel, divName);
})

$("ul.story li ul.list li").each(function() {
  const lengthLiInbox = $("ul.story li ul.list li.li-story").length;
  const inputTel = $(this).find("input").val();
  const divName = $(this).find(".name-clt");
  getNameContact(inputTel, divName);
})

////////////////////////////////////////////////////
////////////// GET Nom contact CSV /////////////////
////////////////////////////////////////////////////
function getNameContact(numberFromTwilioClient, divName){
  $("ul li.filename-contact").each(function() {
    var j = 0;
    const lengthLiFile = $("ul li.filename-contact").length;
    while ( j <= lengthLiFile) { 
        if(j == $(this).val()){
            var filenameC = $(this).text();
            var url_ = '../uploads/'+filenameC;
            $.ajax({
                url: url_,
                dataType: "text",
                success: function(data){
                    var memberJson = CSVToJSON(data);
                    let myNewContactJSON = JSON.parse(memberJson);
                   
                     // boucle de recuperation contenu CSV
                         for(var i = 0; i < myNewContactJSON.length; i++){
                          const numberFromCSV = "+"+myNewContactJSON[i].Contact;
                            if(numberFromCSV == numberFromTwilioClient){
                              //divName.find('span').remove();
                              divName.html('<span>' + myNewContactJSON[i].Nom + ' ' + myNewContactJSON[i].Prenom + '</span>');
                              console.log(myNewContactJSON[i].Nom + ' tel : ' + numberFromTwilioClient + 'ou' + numberFromCSV);
                            }
                             
                         }
                     // Fin boucle de recuperation contenu CSV
                }
            })
        } 
        j++; 
    } 
  });
}


/**
 * Action click d'une liste dans la boite de réception
 */
  $('ul.inbox li ul.list li').on('click', function(){
    const numbertelClt = $(this).find('input[type=tel]').val();
    const divName = $(this).find(".name-clt").find("span").text();

    answerInitShow();
    showLoading();
    clickList(numbertelClt, divName);
  });

  $('ul.story li ul.list li').on('click', function(){
    const numbertelClt = $(this).find('input[type=tel]').val();
    const divName = $(this).find(".name-clt").find("span").text();

    answerInitHide();
    showLoading();
    clickList(numbertelClt, divName);
  });

  $("ul.inbox li ul li.incoming-list").on('click', function(){
    const id = $(this).find("input[name=idInbox]").val();
    var url = "/api/up-sms-incoming/"+id;
    $(this).removeClass("inc");
    upSMSIncominStatus(url);
    $(this).find(".ml-sms").remove();
  })

  $(".ml-sms").on('click', function(){
      $(this).parent().off("click").on("click",function(){});
      var id_ = this.id;
      var url = "/api/up-sms-incoming/"+id_;
      $("#"+id_).parent().removeClass("inc");
      upSMSIncominStatus(url);
      $(this).remove();
  })

  function upSMSIncominStatus(url){
    $.ajax({
      type:'PUT',
      enctype: 'multipart/form-data',
      url: url,
      data: {
        status : 0
      },
      contentType: false,
      processData: false,
      success:function(data){
        console.log("lu");
      }
   });
  }

  function clickList(numbertelClt, divName){
        $('.h-d').css('display','none');
        var numTelClt = numbertelClt;

        // Affecter le numéro de téléphone danc l'input head phone caché
        $('#numberChat').val(numTelClt);

        $('.my-number span').remove();
        $('.my-number').append('<span><b>Numéro : </b>' + numTelClt + '</span>');

        var nameClient = divName;

        if(divName == ""){
            nameClient = "Inconnu";
        }else{
            nameClient = divName
        }

        $('.my-number label span').remove();
        $('.my-number label.nameExp').append('<span><b>Nom : </b> ' + nameClient + '</span>');

        $("#tempNameClient").val(nameClient);

       // $("ul.inbox li ul.list li.li-inbox").on("click", function(){

        // Affecter le numéro de téléphone dans l'input caché
        //$('form.form-answer #number').val(numTelClt);

        var numTel = $('#numberChat').val();
        getSMS(numTel);
         
  }
  
  $('.btn-new').on('click', function(){
    $('.h-d').css('display','block');
    $('.number-to').css('display','none');
    $('.message-c').css('visibility','visible');
  });

  function getSMS(numTel){
      // Suppression le contenu du corps chat
      $("#chatSMS div ul").remove();     

      $.ajax("/api/find-chat-client", {
        data: {numTel: numTel},
        success: function(data){
          var countSMS = data.length;
          $('.m-profile').css('display','none');
          
          $.each(data, function(key, val){
              if(val.to == numTel || val.from == numTel){
                /** 
                 * Format date 
                 */
                var d = new Date(val.dateSent);
                var month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

                var date = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                var time = d.toLocaleTimeString().toLowerCase();

                var dateSMS = date + " " + time;
                
               // $('#chatSMS').append("<ul class="+ val.direction+ "><li class=\"clearfix\"><div class=\"message-data align-right\"><span class=\"message-data-time\" >" + dateSMS + "</span> &nbsp; &nbsp;<span class=\"message-data-name\" >" + val.to + "</span> <i class=\"fa fa-circle me\"></i></div><div class=\"message other-message float-right\">" + val.body + "</div></li></ul>");  
                $('#chatSMS div.chat-content_').prepend('<ul class="'+ val.direction +'"><li class="clearfix"><div class="message-data align-right"><span class="message-data-time" >'+ dateSMS +'</span></div><div class="message other-message float-right"><span>'+ val.body +'</span></div></li></ul>');  
               
              }
          })
        },
        complete: function(){
          hideLoading();
          /** Redirection vers le bas du chat */
          $(".chat-content").animate({ scrollTop: $('.chat-content').prop("scrollHeight")}, 10);

           /**
           * initialise form response
           */
          initialiseResp();
        }
    })
  }

  function sendNewSMS(numTelClt_params){
    // Button send disable
    $(this).attr('disabled', true);
    $('.load').append('<div class="loader"></div>');

    // floutter le l'ecran du téléphone
    let css_blur =
        {
          "-webkit-filter": "blur(5px)",
          "-moz-filter": "blur(5px)",
          "-o-filter": "blur(5px)",
          "-ms-filter": "blur(5px)",
          "filter": "blur(24px)"
        }
      $("#chatSMS").css(css_blur);
      
      $('.h-d').css('display','none');

      //Récuperation content form
      var numTelClt = numTelClt_params;
      var messageContent = $('#messageContent').val();
      
      // Affectation number to input number head chat (temporaire)
      $('#numberChat').val(numTelClt);

      $('#number').val(numTelClt);
      var numTel = $('#numberChat').val();

     
      // ajax SEND
      $.ajax("/api/sendSms", {
        method: "POST",
        data: {
          numTel: numTel,
          numTelExp: numTelUser,
          messageContent: messageContent
        },
        success: function(data){
            getSMS(numTelClt);
            //$('.send-new-sms')[0].reset();
            $("#messageContent").val("");
            $('.load .loader').remove();
            /**
             * initialise form response
             */
            initialiseResp();

            // Button send enable
            $('.btn-send').attr('disabled', false);

            $(".sent-message").append("<div>Message envoyé !</div>");
            setTimeout(function(){
              $(".sent-message div").remove()
            },3000);

            let css_blur =
            {
              "-webkit-filter": "blur(0px)",
              "-moz-filter": "blur(0px)",
              "-o-filter": "blur(0px)",
              "-ms-filter": "blur(0px)",
              "filter": "blur(0px)"
            }
          $("#chatSMS").css(css_blur);
        },
        error: function (error) { 
          $(".sent-message").append('<div style="background: #ef000082;color: #ff9f9f;">Message non envoyé !</div>');
          setTimeout(function(){
            $(".sent-message div").remove()
          },3000);
        }
      })
  }

  function initialiseResp(){
    $(".text-sms textarea").val("");
    const numberResp = $('#numberChat').val();
    $(".numberTo").val(numberResp);
    $(".text-sms").css('display','block');
  }


  /**
  * Action send NEW SMS WITH Contact 1 JS
  */
 $(".action-send").on('click', function(){
      var numTelClt = $('.send-new-sms .numberTo').val();
      var namePop = $(".send-new-sms #tempNameContact").val();

      $("#tempNameClient").val(namePop);
      const divName = namePop;

      showLoading();
      sendNewSMS(numTelClt);
      afterSend(numTelClt, divName);
      getSMSInStory();
  })

  /**
  * Action send NEW SMS WITH Contact Select2 JS
  */
 // recuperation contact dans select2
  $(".action-send-2").on('click', function(){
    var contentSelect = $('span#select2-select-contact-container').text()
    var contactSplit = contentSelect.split(": ").pop();
    var namePop = contentSelect.replace(": "+contactSplit," ");

    $("#tempNameClient").val(namePop);

    const numbertelClt = contactSplit;
    const divName = namePop;

    showLoading();
    sendNewSMS(numbertelClt);
    afterSend(numbertelClt, divName);
    getSMSInStory();
  })


  /**
  * Action answer SMS JS
  */
 $(".answer-sms").on('click', function(){
    // Button send disable
    $(this).attr('disabled', true);

    showEnvoi();

      var numTelClt = $('.form-answer .numberTo').val();
      var messageContentAs = $('#messageContentAs').val();
      
      $('#numberChat').val(numTelClt);

      $('.my-number span').remove();
      $('.my-number').append('<span><b>Numéro : </b>' + numTelClt + '</span>');

      var tempNameClient = $("#tempNameClient").val();
      $('.my-number label span').remove();
      $('.my-number label.nameExp').append('<span><b>Nom : </b> ' + tempNameClient + '</span>');

      $('#number').val(numTelClt);
      var numTel = $('#numberChat').val();
    
    // ajax SEND
      $.ajax("/api/sendSms", {
        method: "POST",
        data: {
          numTel: numTel,
          messageContent: messageContentAs
        },
        success: function(data){
            getSMS(numTel);
            successEnvoi();
            $('#messageContentAs').val("");
            // Button send enable
            $('.answer-sms').attr('disabled', false);
        },
        complete: function(){
          setTimeout(function(){
            $("span.bl-status-env span").remove()
          },3000);
        },
        error: function (error) {
          errorEnvoi();
          setTimeout(function(){
            $("span.bl-status-env span").remove()
          },3000);
        }
      })
  })

  function notifSMS(numTelUser){
    $.ajax("/api/count-sms-incoming", {
      data:{
        numTelUser: numTelUser
      },
      success: function(data){
        var tab = new Array();
        $(".notif-sms span").remove();
        var count;
        if(data.length == 0){
          $(".notif-sms").append("<span>0</span>");
        }else{
          $.each(data, function(key, val){
            tab.push(val);
            count = tab.length;
          })
          $(".notif-sms").append("<span>"+count+"</span>");
        }
      }
    })
  }


  function CSVToJSON(productList) {
    var data = CSVToArray(productList);
    var objData = [];
    for (var i = 1; i < data.length; i++) {
        objData[i - 1] = {};
        for (var k = 0; k < data[0].length && k < data[i].length; k++) {
            var key = data[0][k];
            objData[i - 1][key] = data[i][k]
        }
    }
    var memberJson = JSON.stringify(objData);
    memberJson = memberJson.replace(/},/g, "},\r\n");
    return memberJson;
}

function CSVToArray(productList, separator) {
    separator = (separator || ",");
     var pattern = new RegExp((
    "(\\" + separator + "|\\r?\\n|\\r|^)" +
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    "([^\"\\" + separator + "\\r\\n]*))"), "gi");
    var data = [[]];
    var matches = null;
    while (matches = pattern.exec(productList)) {
        var matchedSeparator = matches[1];
        if (matchedSeparator.length && (matchedSeparator != separator)) {
            data.push([]);
        }
        if (matches[2]) {
            var matchedSeparator = matches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            var matchedSeparator = matches[3];
        }
        data[data.length - 1].push(matchedSeparator);
    }
    return (data);
}


function afterSend(numbertelClt, divName){
    let css_blur =
      {
        "-webkit-filter": "blur(5px)",
        "-moz-filter": "blur(5px)",
        "-o-filter": "blur(5px)",
        "-ms-filter": "blur(5px)",
        "filter": "blur(24px)"
      }
    $("#chatSMS").css(css_blur);

    $('.h-d').css('display','none');
    var numTelClt = numbertelClt;

    // Affecter le numéro de téléphone danc l'input head phone caché
    $('#numberChat').val(numTelClt);

    $('.my-number span').remove();
    $('.my-number').append('<span><b>Numéro : </b>' + numTelClt + '</span>');

    $('.my-number label span').remove();
    $('.my-number label.nameExp').append('<span><b>Nom : </b> ' + divName + '</span>');

  // $("ul.inbox li ul.list li.li-inbox").on("click", function(){

    // Affecter le numéro de téléphone dans l'input caché
    //$('form.form-answer #number').val(numTelClt);

    var numTel = $('#numberChat').val();
}

var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'sound/sound.mp3');
   
    setInterval(getNotif_,3000);

    function showNotification(body, title) {
        var options = {
            body: body,
        }
       return new Notification(title, options);
    }

    function getNotif_(){
      getNotif(numTelUser);
    }

    function getNotif(numTelUser){
        $.ajax("/api/get-notif",{
            data: {
                telUser: numTelUser
            },
             enctype: 'multipart/form-data',
            success:function(data){
                const _id = data[0]._id;
                const _dest = data[0].telDest;
                const _exp = data[0].telExp;
                const _message = data[0].messageIn;
                const _oldStatus = data[0].oldStatus;
                const _newStatus = data[0].newStatus;
                if(_oldStatus < _newStatus){
                    var resultNotif = _newStatus - _oldStatus;
                    for(let i=0; i < resultNotif; i++){
                        console.log(_newStatus);
                        //console.log("notification " + [i]);
                        if(Notification.permission === "granted"){
                            audioElement.play();
                            showLoading();
                            getSMS(_exp);
                            getSMSInbound();
                            getSMSInStory();
                            showNotification(_message, _dest);
                            
                        }else if (Notification.permission!== "denied"){
                            console.log("your are not granted");
                            Notification.requestPermission().then(permission => {
                                if(permission === "granted") {
                                    audioElement.play();
                                    showLoading();
                                    getSMS(_exp);
                                    getSMSInbound();
                                    getSMSInStory();
                                    showNotification(_message, _dest);
                                }
                            });
                        };
                    }
                    $.ajax({
                        type:'PUT',
                        enctype: 'multipart/form-data',
                        url: "/api/up-notif/"+_id,
                        data: {
                            _id : _id
                        },
                        contentType: false,
                        processData: false,
                        success:function(data){
                            //console.log("notif mis à jour");
                        }
                    });
                }
                //console.log("NewStatus " + data[0].newStatus);
            }
        });
    }

    function answerInitShow(){
      $(".resp-message").show();
      $("#chatSMS").css("height","79vh");
    }
    function answerInitHide(){
      $(".resp-message").hide();
      $("#chatSMS").css("height","99vh");
    }

    ///////////////////////////////////////
    /////////////// LOADING ///////////////
    ///////////////////////////////////////
    function showLoading(){
      $(".bl-loading").append('<div class="loading"><div class="lds-ellipsis"><div></div><div></div><div></div></div></div>');
    }

    function hideLoading(){
      $(".bl-loading div.loading").remove();
    }

    ///////////////////////////////////////
    ////////////// ENVOI ... //////////////
    ///////////////////////////////////////
    function showEnvoi(){
      $("span.bl-status-env").append('<span class="status-env" id="status-env">Envoi ...</span>');
    }

    function successEnvoi(){
      $("span.bl-status-env span.status-env").css("background","#1abb65");
      document.getElementById("status-env").innerHTML = "Message envoyé";
    }

    function errorEnvoi(){
      $("span.bl-status-env span.status-env").css("background","red");
      $("span.bl-status-env span.status-env").html('message non envoyé');
    }

});