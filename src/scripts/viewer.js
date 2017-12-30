// Viewer window scripts

const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
let path;
let arr = [];

// Needed for Materialize Design
$(document).ready(function() {
    $('select').material_select();
<<<<<<< HEAD
    $('.carousel.carousel-slider').carousel({ fullWidth: true });
=======
    $('.carousel.carousel-slider').carousel({fullWidth: true, noWrap: true});
>>>>>>> 4199b2506b551320a6857212fef2459541e9262f
});

// Sorting function for an array of numbers
function sortNumber(a,b) {
    return a - b;
}

// Opening event of viewer window
ipcRenderer.on('open-viewer-reply', (event, mangaPath) => {
    path = mangaPath;
<<<<<<< HEAD
    // NOTE: Add this to the html file
    $("#chapterlist")
        .append('<option value="nul" disabled selected>Please select a chapter</option>');
=======
>>>>>>> 4199b2506b551320a6857212fef2459541e9262f
    // Folder listing for viewer window
    fs.readdirSync(mangaPath).forEach(file => {
        arr.push(file);
    });
    console.log("arr1:" + arr);
    arr.sort(sortNumber);
    console.log("arr2:" + arr);
    arr.forEach(item => {
        $("#chapterlist").append(
<<<<<<< HEAD
            $("<option>").attr("value", `${file}`).append(`${file}`)
=======
            $("<option>").attr("value", `${item}`).append(`${item}`)
>>>>>>> 4199b2506b551320a6857212fef2459541e9262f
        );
    });
    arr = [];
});

// Will list pages of said manga + IPC event to reload page
function viewManga() {
    let chapter = $("#chapterlist option:selected").val();
    let chapPath = path + chapter;
    ipcRenderer.send('open-chapter', chapPath);
}


// Ipc event that gives the path from main-viewer
ipcRenderer.on('open-chap-reply', (event, chapPath) => {
    console.log("chapPath2:" + chapPath);
    $("#chapView").empty();
    fs.readdirSync(chapPath) /*.filter(function(file) { return file.substr(-4) === '.jpg'; })*/
        .forEach(file => {
            $("#chapView").append(
                $("<a>").attr("class", "carousel-item").append(
                    $("<img>").attr("src", "../." + chapPath + "/" + file)
                )
            );
        });

});