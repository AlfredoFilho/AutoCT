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