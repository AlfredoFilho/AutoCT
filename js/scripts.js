function numberOnly(t){
    t.value = t.value.replace(/[^0-9]/g,'');
    t.parentNode.style.backgroundColor = "#80808014";
}

function letterOnly(input){
    var regex = /[^A-Ea-e]/gi
    input.value = input.value.replace(regex, "")
}

function changeAlternativa(t){
    t.value = t.value.toUpperCase();
    letterOnly(t);
    t.parentNode.style.backgroundColor = "#80808014";
}

function insertAlternativas(t){

    t.parentNode.style.backgroundColor = "#8080800d";
    quantAlt = parseInt(t.value)
    var divAlternativas = document.getElementById("alternativas");
    divAlternativas.innerHTML = ""
    content = ""
    
    for (var i = 1; i <= quantAlt; i++) {

        pos = ('0' + i).slice(-2)

        content = content + "<div class = 'resposta'>"
        content = content + "<label for='"+ pos +"'>"+ pos +"</label>"
        content = content + "<input type='text' id='"+ pos +"' name='"+ pos +"' placeholder='A B C D E' maxlength='1' oninput='changeAlternativa(this)'></input>"
        content = content + "</div>"
    }
    divAlternativas.innerHTML = content
}

function insertOutras(t){

    t.parentNode.style.backgroundColor = "#8080800d";
    quantOut = parseInt(t.value)
    var divOutras = document.getElementById("outras");
    divOutras.innerHTML = ""
    content = ""
    
    for (var i = 1; i <= quantOut; i++) {

        pos = ('0' + i).slice(-2)

        content = content + "<div class = 'resposta'>"
        content = content + "<label for='"+ (parseInt(pos) + 30) +"'>"+ (parseInt(pos) + 30) +"</label>"
        content = content + "<input type='text' id='"+ (parseInt(pos) + 30) +"' name='"+ (parseInt(pos) + 30) +"' placeholder='máx: 6' maxlength='6' oninput='numberOnly(this)'></input>"
        content = content + "</div>"
    }
    divOutras.innerHTML = content

}