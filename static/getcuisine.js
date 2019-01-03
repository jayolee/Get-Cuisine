$(document).ready(function(){
var ingrelist = [];


//Create a list of the ingredients for the autofill from the training data 


//Display the 'Search' button only when ingredients are selected
function reopac() {
    $('.search').css('display', 'block');
    setTimeout(function () {
        $('.search').css('opacity', '1');
    }, 10);
}

//Hide the 'Search' button if a user search(focus on the search bar) for another ingredient
function reblur() {
    $('.search').css('opacity', '0');

    setTimeout(function () {
        $('.search').css('display', 'none');
    }, 300);
}

//Create autofill
function createNewList(name) {
    let newDiv = document.createElement("li");
    newDiv.appendChild(document.createTextNode(name));
    $('.ingredient ul').append(newDiv);
    newDiv.setAttribute("id", name)
}


$(function () {
    var availableTags = traindata;
    $("#ingredients").autocomplete({
        source: availableTags,
        select: function (event, ui) {
            //Add a selected ingredient to the array
            ingrelist.push(ui.item.value);
            createNewList(ui.item.value);
            //Opaque the Search button
            reopac();
        },
        close: function (event, ui) {
            //if an ingredient is selected, empty the search bar
            $('#ingredients').val('');
        },
        search: function (event, ui) {
            //if a user do another search, hide the Search button
            reblur();
        }
    });
});

//if selected ingredients are clicked, get rid of them from the array and hide
$('.ingredient ul').on('click', 'li', function () {
    let idName = $(this).attr('id');
    let indexNum = ingrelist.indexOf(idName);
    ingrelist.splice(indexNum, 1);
    $(this).remove();

})



//Reload the page when the result box is closed
$('.xmark').click(function () {
    location.reload();
})

//Run when ajax call is succeded - Display prediction result
function displayResult(response) {
    $('.greybox').css('display', 'block');
    setTimeout(function () {
        $('.greybox').css('opacity', '1')
    }, 100);
    let result = response.predict_result;
    let imgresult='/static/images/'+result+'.svg';
    //Change the first letter of the cuisine name to uppercase
    if (!(result == 'southern_us' || result == 'cajun_creole')) {
        result = result[0].toUpperCase() + result.slice(1)
    }
    else {
        if (result == 'southern_us') {
            result = 'Southern US';
        }
        else if (result == 'cajun_creole') {
            result = 'Cajun Creole'
        }
    }

    $('.prediction').text(result);
    $('#resultImg').attr('src',imgresult);

    //Give Google Search function to search for the recipe
    let searchline = "";
    for (let i = 0; i < ingrelist.ingredient.length; i++) {
        searchline += ingrelist.ingredient[i] + ' ';
    }
    searchline = "https://www.google.com/search?q=" + searchline + '"' + result + '" recipe';

    $("#redirect_search").attr('href', searchline)
}

//Search button click event - ajax call
$('#getCuisine').click(function () {
    let ingredient_str = ''
    for (let i = 0; i < ingrelist.length; i++) {
        ingredient_str += ingrelist[i] + ',';
    }
    ingrelist = { 'ingredient': [ingredient_str] };
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        url: 'result',
        dataType: "JSON",
        data: JSON.stringify(ingrelist),
        success: function (response) { displayResult(response) },

    })
})
})