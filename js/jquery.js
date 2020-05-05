$(document).ready(function(){
    
    $("#btnLimpar").click(function(){
        $(':input[type=text]').val('')
    });
    
    $("#btnCorrigir").click(function(){

        respostasAlt = ""
        for (i = 1; i <= 30; ++i) {
            
            position = String(i)

            if( i < 10){
                position = "0" + String(i)
            }

            respostasAlt = respostasAlt + position + " = " + $("#alt" + position).val() + "<br>"
        }

        for (i = 31; i <= 40; ++i) {
            
            position = String(i)

            if( i < 10){
                position = "0" + String(i)
            }

            respostasAlt = respostasAlt + position + " = " + $("#out" + position).val() + "<br>"
        }

        $.MessageBox({
            buttonDone  : "OK",
            buttonFail  : "Voltar",
            message     : respostasAlt
        }).done(function(){
            $.LoadingOverlay("show");

            setTimeout(function(){
                $.LoadingOverlay("hide");
                $.MessageBox("Em construção!");
            }, 2000);

        }).fail(function(){
        
        });

    });
});