$(document).ready(function(){
    function successInc(){
        $('.bl-success').append('<div class="successInc">Utilisateur enregistré avec succès :)</div>');
    }
    function messageInc(){
        $(".bl-messageInc").append('<div class="messageInc">Confirmation mot de passe incorrect, veuillez réessayer svp!</div>');
    }
    function messageTel(){
        $(".bl-messageTel").append('<div class="messageInc">Ce champ ne doit pas être vide</div>');
    }
    function messageEmail(){
        $(".bl-messageEmail").append('<div class="messageInc">Ce champ ne doit pas être vide</div>');
    }
    function messageMDP(){
        $(".bl-messageMDP").append('<div class="messageInc">Ce champ ne doit pas être vide</div>');
    }
    $('select.r-user').change(function(){
        var typeUser = $(this).children("option:selected").val();
        $("#_role").val(typeUser);
    })

    $('.btn-inc').on("click", function(){
        var _role = $("#_role").val();
        var _tel = $("#_tel").val();
        var _email = $("#_mail").val();
        var _password = $("#_password").val();
        var _cpassword = $("#_cpassword").val();

        if(_tel == ""){
            messageTel();
        }else if(_email ==""){
            messageEmail();
        }else if(_password == ""){
            messageMDP();
        }else if(_password == _cpassword){
            $.ajax("/api/users", {
                method: "POST",
                data: {
                    roleUser: _role,
                    tel: _tel,
                    email: _email,
                    password: _cpassword
                },
                success: function(data){
                    successInc();
                    $("div.messageInc").remove();
                    $("#_tel").val("");
                    $("#_mail").val("");
                    $("#_password").val("");
                    $("#_cpassword").val("");
                    setTimeout(function(){
                        $(".bl-success div.successInc").remove();
                    }, 3000)
                },
                complete: function(){
                    $("div.messageInc").remove();
                    $("#_tel").val("");
                    $("#_mail").val("");
                    $("#_password").val("");
                    $("#_cpassword").val("");
                }
            })
        }else{
            messageInc();
            setTimeout(function(){
                $(".bl-messageInc div.messageInc").remove();
            }, 3000)
        }

        
    })

    /**
     * description action form update user
     */
    $('#update_user').submit(function(event){
        event.preventDefault();

        var unindexed_array = $(this).serializeArray();
        var data = {};

        $.map(unindexed_array, function(n,i){
            data[n['name']] = n['value']
        })
        var url = document.URL;
        var id = url.split("?id=").pop();

        var request = {
            "url": "http://192.168.88.20/api/users/"+id,
            "method" :"PUT",
            "data": data
        }

        var _role = $("#_role").val();
        var _tel = $("#_tel").val();
        var _email = $("#_mail").val();
        var _password = $("#_password").val();
        var _cpassword = $("#_cpassword").val();

        if(_tel == ""){
            messageTel();
        }else if(_email ==""){
            messageEmail();
        }else if(_password == ""){
            messageMDP();
        }else if(_password == _cpassword){
            $.ajax(request).done(function(response){
                alert("Modification réussi!");
                window.location.href='http://192.168.88.20/lst-user';
            })
        }
    })

     /**
     * description action delete user
     */
        $ondelete = $(".table tbody td a.delete");
        $ondelete.click(function(){
            var id = $(this).attr('data-id')

            var request = {
                "url": "http://192.168.88.20/api/users/"+id,
                "method": "DELETE"
            }

            if(confirm("Voulez-vous vraiment supprimer cette utilisateur") == true){
                $.ajax(request).done(function(response){
                    alert("Suppression réussi!");
                })
                window.location.href='http://192.168.88.20/lst-user';
            }
        })
})