$(document).ready(function(){
    
    $("#btnLimpar").click(function(){
        $(':input[type=text]').val('')
    });

    $("#file").change(function() {
        $(".divFile").css({"background-color":"#8080800d"});
    });
    
    $(".resposta input[type=text]").keyup(function() {
        alert("Key up detected");
    });


    function checkFile(){
        if( document.getElementById("file").files.length == 0 ){
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

    $("#btnCorrigir").click(function(){
        if (checkFile() == true){
            if (checkInputs() == true){

            }else{
                alert("Você deixou algum input vazio!")
            }

        }else{
            $(".divFile").css({"background-color":"#ff00001c"});
            alert("Você não selecionou um arquivo!")
        }
    });
});