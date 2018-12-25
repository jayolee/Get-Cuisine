var ingrelist = [];
var autolist = [];

traindata.forEach(function (item) {
    for (let i = 0; i < item.ingredients.length; i++) {
        if (!(autolist.includes(item.ingredients[i]))) {
            autolist.push(item.ingredients[i]);
        }
    }
});


function reopac() {
    $('.search').css('display', 'block');
    setTimeout(function () {
        $('.search').css('opacity', '1');
    }, 10);
}
function reblur() {
    $('.search').css('opacity', '0');

    setTimeout(function () {
        $('.search').css('display', 'none');
    }, 300);
}
function createNewList(name) {
    let newDiv = document.createElement("li");
    newDiv.appendChild(document.createTextNode(name));
    $('.ingredient ul').append(newDiv);
    newDiv.setAttribute("id", name)
}

$(function () {
    var availableTags = autolist;
    $("#ingredients").autocomplete({
        source: availableTags,
        select: function (event, ui) {
            ingrelist.push(ui.item.value);
            createNewList(ui.item.value);
            reopac();
        },
        close: function (event, ui) {
            $('#ingredients').val('');
        },
        search: function (event, ui) {
            reblur();
        }
    });
});


$('.ingredient ul').on('click', 'li', function () {
    let idName = $(this).attr('id');
    let indexNum = ingrelist.indexOf(idName);
    ingrelist.splice(indexNum, 1);
    $(this).remove();

})




$('.xmark').click(function () {
    location.reload();
})

function displayResult(response) {
    $('.greybox').css('display', 'block');
    setTimeout(function () {
        $('.greybox').css('opacity', '1')
    }, 100);
    let result = response.predict_result;
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

    let searchline = "";
    for (let i = 0; i < ingrelist.ingredient.length; i++) {
        searchline += ingrelist.ingredient[i] + ' ';
    }
    searchline = "https://www.google.com/search?q=" + searchline + '"' + result + '" recipe';

    $("#redirect_search").attr('href', searchline)
}


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