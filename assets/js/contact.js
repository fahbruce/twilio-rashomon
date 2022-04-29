
$(document).ready(function(){
    $(".btn-imp").attr('disabled', true);

    $('.inputfile').on('change', function(){
        var file = document.getElementById('file').files[0].name;
        var extensions = /(\.csv)$/i; 
        if(file != ""){
            if (!extensions.exec(file)){
                document.getElementById('file').value = "";
                $('.name-file').html('<div class="bl-name-error"><span class="lab-file-err">Format de fichier non valide, Veuillez importer un fichier.csv</span></div>');
                return false; 
            }else{ 
                $('.name-file').html('<span class="lab-file">Fichier : </span><span class="name-file_">'+file+'</span>');
                $(".btn-imp").attr('disabled', false);
                $("#formUpload").submit(function(e) {
                    //initUpload();
                });
            } 
           
        }
    })

    function initUpload(){
        document.getElementById('file').value = "";
        $('.name-file div').remove();
        $('.name-file span').remove();
        $(".btn-imp").attr('disabled', true);
    }

   // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        initUpload();
    }

     // When the user clicks on <span> (x), close the modal
     $('label .close').onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


    // Get the modal
    var modalExp = document.getElementById("myModalExport");

    // Get the button that opens the modal
    var btnExp = document.getElementById("exportXlsx");

    // When the user clicks the button, open the modal 
    btnExp.onclick = function() {
        modalExp.style.display = "block";
    }

     // When the user clicks on <span> (x), close the modal
     $('label .close').onclick = function() {
        modalExp.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modalExp) {
            modalExp.style.display = "none";
        }
    }
      

  /*  $('.action-foot button').on('click', function(){
        var file = $('input[name="file"]').name;
        $.ajax("/api/create-contact", {
            method: "POST",
            data: {file : file},
            success: function(data){
                console.log(data);
            }
        })
    })*/

    //$('.contact-action').on('click', function(){
       // var file = document.getElementById('file').files[0].name;
       /* $.ajax("/api/find-file", {
            method: "GET",
            data: {},
            success: function(){
               console.log("okok");
            }
        })*/
   // })

   // In your Javascript (external .js resource or <script> tag)
    $('.js-example-basic-single').select2();

    readCSV();

    function readCSV(){
        // var fileContactName = $('.filename-contact').text();
       $("#table_contact ul.contact-list").remove();
       $("#select-contact option").remove();

       var view_contact_list;
       view_contact_list = '<ul class="contact-list">';

       $("ul li.filename-contact").each(function() {
           var j = 0;
           const lengthLiFile = $("ul li.filename-contact:last").val();
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
                                    $("#table_contact ul.contact-list").append('<li class="lg-story"><label>'+ myNewContactJSON[i].Nom +' <span> '+ myNewContactJSON[i].Prenom +'</span></label><br><label>+'+ myNewContactJSON[i].Contact +'</label></label><button class="action-sms '+ myNewContactJSON[i].Contact +'" value="'+ myNewContactJSON[i].Contact +'">SMS <input value="'+ myNewContactJSON[i].Nom +' '+ myNewContactJSON[i].Prenom +'" hidden></button></li>');
                                    
                                    // intégration des contacts dans select2
                                    $("#select-contact").append('<option value="'+ myNewContactJSON[i].Contact +'"><span>'+ myNewContactJSON[i].Nom +' '+ myNewContactJSON[i].Prenom +' : </span><label>+'+ myNewContactJSON[i].Contact +'</label></option>');
                                   
                                    $("button."+myNewContactJSON[i].Contact).on("click", function(){
                                        var name = $(this).find('input').val();
                                        var contact = $(this).attr("value");
                                        actionCamp(contact, name);
                                    })

                                    localStorage.setItem('+'+myNewContactJSON[i].Contact, myNewContactJSON[i].Nom +' '+ myNewContactJSON[i].Prenom);
                                    
                                }
                            // Fin boucle de recuperation contenu CSV
                       }
                   })
               } 
               j++; 
           } 
         });
        view_contact_list += '</ul>';
        $('#table_contact').append(view_contact_list);
    }

    function actionCamp(contact, name){
        $("#rCampaigne .select2").hide();
        $("#rCampaigne .action-send-2").hide();

        $("#rCampaigne #number").show();
        $("#rCampaigne .action-send").show();

        $(".send-new-sms textarea").focus();

        $(".btn-send").attr('disabled', true);

        $('.send-new-sms #number').val('+'+contact);
        $('.send-new-sms #number').attr('disabled', true);
        $('.send-new-sms #tempNameContact').val(name);

        $('.send-new-sms span.name-dest').append(name);

        // active menu
        $('.r-nav-menu_2').removeClass('active');
        $('.r-nav-menu_1').addClass('active');

        //open form send SMS
        $('#rCampaigne').removeClass('dNone');
        $('#rCampaigne').addClass('dBlock');
    
        $('#rContact').removeClass('dBlock');
        $('#rContact').addClass('dNone');
    
        $('#rInbox').removeClass('dBlock');
        $('#rInbox').addClass('dNone');
    
        $('#rHistory').removeClass('dBlock');
        $('#rHistory').addClass('dNone');
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

    
})
