$(document).ready(function(){

    var fileInB64 = ''

    $("#file").change(function() {
        $(".divFile").css({"background-color":"#8080800d"});
        var file = document.querySelector('.divFile > input[type="file"]').files[0];
        getBase64(file)
    });

    $("#btnLimpar").click(function(){
        $(':input[type=text]').val('')
    });

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
        // confirmBox()
    });
    
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
    
    function checkFile(){
        if( document.getElementById("file").files.length == 0 ){
            $(".divFile").css({"background-color":"#ff00001c"});
            return false;
        } else{
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

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function makeMessageBox(){
        messageBox = '<h3 style="text-align: center;">Confirmar Respostas</h3><br><br>'
        responseInputs = getResponseInputs()

        for(key in responseInputs){
            messageBox = messageBox + '<strong>' + key.capitalize() + '</strong>' + '<br><br>'
            for(subKey in responseInputs[key]){
                messageBox = messageBox + subKey + ': ' + responseInputs[key][subKey] + '<br>'
            }
            messageBox = messageBox + '<br><br>'
        }
        return messageBox
    }

    function confirmBox(){

        $.MessageBox({
            buttonDone  : "OK",
            buttonFail  : "Voltar",
            message     : makeMessageBox()

        }).done(async function(){
            
            $.LoadingOverlay("show");
            
            alert('Em construção')
            // var responseAPI = await requestAPI()
            // setResponse(responseAPI)

            $.LoadingOverlay("hide");

        }).fail(function(){});

    }

    function getResponseInputs(){

        dictInputs = {}

        quantAlternativas = $('select[name="selectQuantAlternativas"]').val();
        quantOutras = $('select[name="selectQuantOutras"]').val();

        if(quantAlternativas != '' && quantAlternativas != '999'){
            dictInputs['alternativas'] = {}

            $('#alternativas :input[type=text]').each(function(){
                id = $(this).attr('id')
                val = $(this).val()
                dictInputs['alternativas'][id] = ""
                dictInputs['alternativas'][id] = val
            })
        }

        if(quantOutras != '' && quantOutras != '999'){
            dictInputs['outras'] = {}

            $('#outras :input[type=text]').each(function(){
                id = $(this).attr('id')
                val = $(this).val()
                dictInputs['outras'][id] = ""
                dictInputs['outras'][id] = val
            })
        }

        return dictInputs
    }

    function analysesStatus(responseAPI){

        statusCode = responseAPI['statusCode']

        if(statusCode == '200')
            return true
        else
            return false
    }

    function setResponse(responseAPI){

        status = analysesStatus(responseAPI)

        if(Boolean(status) == true){
            setData(responseAPI)
        }
        else{
            alert('API não conseguiu processar. Por favor, tente novamente.')
        }

    }

    function setData(data){

        $("#resultadoAPI").css({"display":"block"});
        $('#resultadoAPI').text(JSON.stringify(data['body']['alternativas']))

    }

    function requestAPI(){
        return $.ajax({
            url: 'https://r0oq6xy9te.execute-api.us-east-2.amazonaws.com/AutoCT-API/upload',
            crossDomain : true,
            processData: false,
            data: fileInB64,
            contentType: 'image/png',
            type: 'POST',
            success: function (responseAPI) {
                return responseAPI
            },
            fail: function(responseAPI){
                return responseAPI
            }
        });
    }
});