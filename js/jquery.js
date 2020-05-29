$(document).ready(function(){

    var fileInB64 = ''
    
    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            fileInB64 = reader.result.split(',')[1];
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
     }
        
    $("#btnLimpar").click(function(){
        $(':input[type=text]').val('')
    });

    $("#file").change(function() {
        $(".divFile").css({"background-color":"#8080800d"});
        var file = document.querySelector('.divFile > input[type="file"]').files[0];
        getBase64(file)
    });
    
    function checkFile(){
        if( document.getElementById("file").files.length == 0 ){
            $(".divFile").css({"background-color":"#ff00001c"});
            return false;
        }else{
            return true;
        }
    }

    function checkInputs(){
        var inputEmpty = true

        $(':input[type=text], select').each(function(){    
            if($(this).val() == ''){
                $(this.parentNode).css({"background-color":"#ff00001c"});
                inputEmpty = false
            }
        })
        return inputEmpty
    }

    function uploadFile(){
        return $.ajax({
            url: 'https://r0oq6xy9te.execute-api.us-east-2.amazonaws.com/AutoCT-API/upload',
            crossDomain : true,
            processData: false,
            data: fileInB64,
            contentType: 'image/png',
            type: 'POST',
            success: function (data) {
                return data
            }
        });
    }

    function setDataDiv(data){

        console.log(data['body']['alternativas'])
        $('#respostasAPI').text(JSON.stringify(data['body']['alternativas'], null, 2));

        $(window).scrollTop($('#respostasAPI').offset().top);

    }

    function confirmBox(){

        $.MessageBox({
            buttonDone  : "OK",
            buttonFail  : "Voltar",
            message     : '<strong>Confirmar respostas</strong><br><br>XX: xx'
        }).done(async function(){
            $.LoadingOverlay("show");

            // var data = await uploadFile()
            // console.log(data)
            // setDataDiv(data)
            alert("Em construção!")
            
            $.LoadingOverlay("hide");

        }).fail(function(){

        });

    }

    $("#btnCorrigir").click(async function(){
        if (checkFile() == true){
            if (checkInputs() == true){
                confirmBox()
            } else{
                alert("Você deixou algum input vazio!")
            }

        } else{
            alert("Você não selecionou um arquivo!")
        }
    });

});