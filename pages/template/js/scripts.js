function downloadFile(nameFile){

    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href= nameFile;
    link.download = 'AutoCT - Template.pdf';
    link.click();
}