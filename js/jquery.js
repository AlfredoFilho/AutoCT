$(document).ready(function(){

    var file = ''
    var form;
    
    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            fileInB64 = reader.result.split(',')[1];
            console.log(fileInB64)
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
        // var file = document.querySelector('.divFile > input[type="file"]').files[0];
        // console.log(file.target.result)
        // getBase64(file)
        form = new FormData();
        form.append('file', event.target.files[0]);
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
                if (this.nodeName == 'INPUT')
                    $(this.parentNode).css({"background-color":"#ff00001c"});
                else
                    $(this.parentNode).css({"background-color":"#ff00001c"});
                inputEmpty = false
            }
        })
        return inputEmpty
    }

    function uploadFile(){
        $.ajax({
            url: 'https://r0oq6xy9te.execute-api.us-east-2.amazonaws.com/AutoCT-API/upload',
            crossDomain : true,
            processData: false,
            data: form,
            contentType: 'image/png',
            type: 'POST',
            success: function (data) {
                console.log(data)
            }
        });
    }

    $("#btnCorrigir").click(function(){
        // if (checkFile() == true){
        //     if (checkInputs() == true){
        //         uploadFile()
        //     } else{
        //         alert("Você deixou algum input vazio!")
        //     }

        // } else{
        //     alert("Você não selecionou um arquivo!")
        // }
        uploadFile()
    });
});