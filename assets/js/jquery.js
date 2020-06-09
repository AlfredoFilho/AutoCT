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

$("#btnClear").click(function(){
    $(':input[type=text]').val('')
});

function checkQuestionsToApplyCss(){

    const responsesInput = getResponseInputs()

    $('.test').each(function(index, testElement) {

        var contQuestion = 0
        var contWrongQuestions = 0

        var $alts = $(testElement).find('.resultResponse').find('.alternativesAPI').find('.alt')
        var $oths = $(testElement).find('.resultResponse').find('.othersAPI').find('.oth')
    
        $.each($alts, function(n, altElement){
            var id = $(altElement).find('input').attr('id').split('-')[1]
            var value = $(altElement).find('input').val()
            contQuestion = contQuestion + 1

            if(responsesInput['alternatives'][id] !== value){
                $(altElement).css({"background-color":"#ff00001c"})
                contWrongQuestions = contWrongQuestions + 1
            }else{
                $(altElement).css({"background-color":"#c1fdc1"})
            }
        });

        $.each($oths, function(n, othElement){
            var id = $(othElement).find('input').attr('id').split('-')[1]
            var value = $(othElement).find('input').val()
            contQuestion = contQuestion + 1

            if(responsesInput['others'][id] !== value){
                $(othElement).css({"background-color":"#ff00001c"})
                contWrongQuestions = contWrongQuestions + 1
            }else{
                $(othElement).css({"background-color":"#c1fdc1"})
            }
        });

        if(contWrongQuestions === contQuestion){
            $(testElement).find('#imageID').find('.RA-Result').find('.resultTest').find('input').val('100%')    
        }else{
            var result = (((contQuestion - contWrongQuestions) * 100) / contQuestion).toFixed(1)
            $(testElement).find('#imageID').find('.RA-Result').find('.resultTest').find('input').val(String(result)+'%')
        }
    })
}

$("body").on('input', '.alt', function () {
    var regex = /[^A-Ea-e]/gi
    var newValue = $(this).find('input').val()
    var valueRegex = newValue.replace(regex, "")
    $(this).find('input').val(valueRegex.toUpperCase())
    
    checkQuestionsToApplyCss()
});

$("body").on('input', '.oth', function () {
    var value = $(this).find('input').val()
    var newValue = value.replace(/[^0-9]/g,'');
    $(this).find('input').val(newValue)    
    
    checkQuestionsToApplyCss()
});