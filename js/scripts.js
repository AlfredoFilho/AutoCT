function numberOnly(t){
    t.value = t.value.replace(/[^0-9]/g,'');
    t.parentNode.style.backgroundColor = "#80808014";
}

function letterOnly(input){
    var regex = /[^A-Ea-e]/gi
    input.value = input.value.replace(regex, "")
}

function changeAlternative(t){
    t.value = t.value.toUpperCase();
    letterOnly(t);
    t.parentNode.style.backgroundColor = "#80808014";
}

function insertAlternatives(t){

    t.parentNode.style.backgroundColor = "#8080800d";
    quantAlt = parseInt(t.value)
    var divAlternatives = document.getElementById("alternatives");
    divAlternatives.innerHTML = ""
    content = ""
    
    for (var i = 1; i <= quantAlt; i++) {

        pos = ('0' + i).slice(-2)

        content = content + "<div class = 'answer'>"
        content = content + "<label for='"+ pos +"'>"+ pos +"</label>"
        content = content + "<input type='text' id='"+ pos +"' name='"+ pos +"' placeholder='A B C D E' maxlength='1' oninput='changeAlternative(this)'></input>"
        content = content + "</div>"
    }
    divAlternatives.innerHTML = content
}

function insertOthers(t){

    t.parentNode.style.backgroundColor = "#8080800d";
    quantOthers = parseInt(t.value)
    var divOthers = document.getElementById("others");
    divOthers.innerHTML = ""
    content = ""
    
    for (var i = 1; i <= quantOthers; i++) {

        pos = ('0' + i).slice(-2)

        content = content + "<div class = 'answer'>"
        content = content + "<label for='"+ (parseInt(pos) + 30) +"'>"+ (parseInt(pos) + 30) +"</label>"
        content = content + "<input type='text' id='"+ (parseInt(pos) + 30) +"' name='"+ (parseInt(pos) + 30) +"' placeholder='max: 6' maxlength='6' oninput='numberOnly(this)'></input>"
        content = content + "</div>"
    }
    divOthers.innerHTML = content

}