$(document).ready(async function(){

    var fileInB64 = ''
    var url = window.location.href; 
    const model = await tf.loadLayersModel(`${url}assets/model/model.json`)
    $.getScript(`${url}assets/js/jquery.js`)
    
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


    function loadImage(source){

        source = "data:image/png;base64," + source

        return new Promise((resolve, reject) => {
          let img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.crossOrigin = "Anonymous";
          img.src = source
        })
    }

    function preprocessCanvas(image) {
    
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([28, 28])
            .mean(2)
            .expandDims(2)
            .expandDims()
            .toFloat();

        return tensor.div(255.0);
    }
    
    
    async function runModel(image){
    
        const inputTensor = preprocessCanvas(image)
        const predictionResult =  model.predict(inputTensor).dataSync();
        const recognizedDigit = predictionResult.indexOf(Math.max(...predictionResult));
        
        RA = $("#API .test").last().find("#inputRA").val();
        RA = RA + String(recognizedDigit)
        $("#API .test").last().find("#inputRA").val(RA);
    }

    async function setRA(dataRA){

        for(var i =1; i < 7; i++){
            source = dataRA[i]
            image = await loadImage(source)
            await runModel(image)
        }
    }

    async function setAlternatives(dataAlternatives){

        var message = ''
        for(var i = 1; i < 31; i++){

            pos = ('0' + i).slice(-2)

            message = message + '<div class="alt">'
            message = message + '<label>' + pos + '</label>'
            message = message + "<input type='text' maxlength='1' value= " + dataAlternatives[pos] + "></input>"
            message = message + '</div>'
        }

        $("#API .test").last().find(".alternativesAPI").append(message);

    }
    async function setOthers(dataOthers){}

    async function setData(dataBody){

        sourceb64 = "data:image/png;base64," + fileInB64

        $("#answersQuestions").css({"display":"none"});
        $("#API").css({"display":"block"});
        // $("#imgB64").attr("src", "data:image/png;base64," + fileInB64);

        test = `
            <div class="test">
                <!-- Image -->
                <div id="imageID">
                    <div class="idStudent">
                        <label>RA:</label>
                        <input type='text' maxlength='6' id="inputRA"></input>
                    </div>
                    <span>
                        <img id="imgB64" src=${sourceb64}>
                    </span>
                </div>
                <!-- Responses -->
                <div class="resultResponse">
                    <!-- Content Alternatives -->
                    <div class="alternativesAPI" id="xx">
                        <h3>Alternatives:</h3>
                        <!-- <div class="alt">
                            <label>ID:</label>
                            <input type='text' maxlength='1'></input>
                        </div> -->
                    </div>
                    <hr>
                    <!-- Content Others -->
                    <div class="othersAPI">
                        <h3>Others:</h3>
                        <div class="oth">
                            <label>31:</label>
                            <input type='text' maxlength='1'></input>
                        </div>
                    </div>
                </div>
            </div>
        `

        $('#API').append(test)

        await setRA(dataBody['imagensRA'])

        if ('alternatives' in dataBody){
            await setAlternatives(dataBody['alternatives'])
        }

        if ('others' in dataBody){
            await setOthers(dataBody['others'])
        }
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

    $("#file").change(function() {
        $(".divFile").css({"background-color":"#8080800d"});
        var file = document.querySelector('.divFile > input[type="file"]').files[0];
        getBase64(file)
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

    function analysesStatus(responseAPI){

        statusCode = responseAPI['statusCode']

        if(String(statusCode) === '200'){
            return true
        }
        else{
            return false
        }
    }

    function setResponse(responseAPI){

        status = analysesStatus(responseAPI)
        console.log(responseAPI)
    
        if(status === true){
            setData(responseAPI['body'])
        }
        else{
            alert("Oops, something didn't work. Please, try again.")
        }

    }
});