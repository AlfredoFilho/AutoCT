$(document).ready(function(){

    var fileInB64 = ''

    $("#file").change(function() {
        $(".divFile").css({"background-color":"#8080800d"});
        var file = document.querySelector('.divFile > input[type="file"]').files[0];
        getBase64(file)
    });

    $("#btnClear").click(function(){
        $(':input[type=text]').val('')
    });

    $("#btnCorrect").click(async function(){
        // if (checkFile() == true){
        //     if (checkInputs() == true){
        //         confirmBox()
        //     } else{
        //         alert("Some input is empty!")
        //     }
        // } else{
        //     alert("No file selected!")
        // }
        confirmBox()
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
        messageBox = '<h3 style="text-align: center;">Confirm Responses</h3><br><br>'
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
            buttonFail  : "Back",
            message     : makeMessageBox()

        }).done(async function(){
            
            $.LoadingOverlay("show");
            
            // alert('Under construction')
            var responseAPI = await requestAPI()
            setResponse(responseAPI)

            $.LoadingOverlay("hide");

        }).fail(function(){});

    }

    function getResponseInputs(){

        dictInputs = {}

        quantAlternatives = $('select[name="selectQuantAlternatives"]').val();
        quantOthers = $('select[name="selectQuantOthers"]').val();

        if(quantAlternatives != '' && quantAlternatives != '999'){
            dictInputs['alternatives'] = {}

            $('#alternatives :input[type=text]').each(function(){
                id = $(this).attr('id')
                val = $(this).val()
                dictInputs['alternatives'][id] = ""
                dictInputs['alternatives'][id] = val
            })
        }

        if(quantOthers != '' && quantOthers != '999'){
            dictInputs['others'] = {}

            $('#others :input[type=text]').each(function(){
                id = $(this).attr('id')
                val = $(this).val()
                dictInputs['others'][id] = ""
                dictInputs['others'][id] = val
            })
        }

        return dictInputs
    }

    function analysesStatus(responseAPI){

        statusCode = responseAPI['statusCode']

        if(statusCode == '200') return true
        else return false
    }

    function setResponse(responseAPI){

        status = analysesStatus(responseAPI)

        if(Boolean(status) == true){
            setData(responseAPI)
        }
        else{
            alert("API didn't work. Please, try again.")
        }

    }

    function preprocessCanvas(image) {
    
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([28, 28])
            .mean(2)
            .expandDims(2)
            .expandDims()
            .toFloat();
        // console.log(tensor.shape);
        return tensor.div(255.0);
    }
    
    
    async function runModel(image){
    
        const inputTensor = preprocessCanvas(image)
        const model = await tf.loadLayersModel('model/model.json')
        const predictionResult =  model.predict(inputTensor).dataSync();
        const recognizedDigit = predictionResult.indexOf(Math.max(...predictionResult));
        
        // console.log(predictionResult)
        alert('Predição: ' + String(recognizedDigit))
    
    }

    async function setData(data){

        $("#answersQuestions").css({"display":"none"});
        $("#API").css({"display":"block"});
        // $('#resultAPI').text(JSON.stringify(data['body']['alternatives']))
        console.log(data)
        $("#imgB64").attr("src", "data:image/png;base64," + fileInB64);

        var message = ''
        for(var i = 1; i < 31; i++){

            pos = ('0' + i).slice(-2)

            message = message + '<div class="alt">'
            message = message + '<label>' + pos + '</label>'
            message = message + "<input type='text' maxlength='1' value= " + data['body']['alternatives'][pos] + "></input>"
            message = message + '</div>'
        }

        $("#xx").append(message);

        // await runModel(image)

    }

    function makeDataToSendAPI(){

        dataToSend = {}
        dataToSend['image'] = fileInB64
        dataToSend['numberQuestions'] = {}
        
        quantAlternatives = $('select[name="selectQuantAlternatives"]').val();
        quantOthers = $('select[name="selectQuantOthers"]').val();

        if(quantAlternatives != '' && quantAlternatives != '999'){
            dataToSend['numberQuestions']['alternatives'] = parseInt(quantAlternatives)
        }

        if(quantOthers != '' && quantOthers != '999'){
            dataToSend['numberQuestions']['others'] = parseInt(quantOthers)
        }

        return dataToSend
    }

    function requestAPI(){

        dataToSend = makeDataToSendAPI()

        return $.ajax({
            url: 'https://r0oq6xy9te.execute-api.us-east-2.amazonaws.com/AutoCT-API/upload',
            crossDomain : true,
            processData: false,
            data: JSON.stringify(dataToSend),
            dataType: 'json',
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