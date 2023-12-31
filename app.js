$(document).ready(() => {
    const stateObj = {
        searchedPlace: [],
    }

    const $resultContainer = $('#result-container');
    const $searchButton = $('#search-button');
    const $clearButton = $('#clear-button');
    const $searchHistoryButton = $('#search-history-button');
    const $searchHistoryModalCloseButton = $('#searchHistoryModalButton');
    const $searchedInput = $('#searched-place');
    const $inputGroup = $('.input-group');
    const $searchHistoryModal = $('#searchHistoryModal');
    const $searchHistoryList = $('.searchHistoryList');
    const $headingOne = $('.headingOne');
    const $spinner = $('#spinner');
    $spinner.removeClass('loader')
    let userInput;

    $clearButton.hide();
    $searchHistoryButton.hide();
    $('[data-toggle="tooltip"]').tooltip();
    $searchButton.on('click', (e) => {
        e.preventDefault();
        $spinner.addClass('loader');
        userInput = $searchedInput.val();
        countryInfoFinder();
    });

    $clearButton.on('click', (e) => {
        e.preventDefault();
        $('.resultCard').fadeOut('normal', () => {
            $('.resultCard').remove()
        })
        stateObj.searchedPlace.length = 0;
        $inputGroup.css('margin-top', '100px')
        $searchedInput.val('')
        $headingOne.fadeIn().removeClass('d-none')
        $clearButton.fadeOut().hide()

    })

    $searchHistoryButton.on('click', (e) => {
        e.preventDefault();
        $searchHistoryModal.fadeIn('normal', () => {
            $searchHistoryModal.show()
        })

    })

    $searchHistoryModalCloseButton.on('click', (e) => {
        e.preventDefault();
        $searchHistoryModal.fadeOut('normal', () => {
            $searchHistoryModal.hide()
        })
    })

    function showAlert(message) {
        $('#alertMessage').text(message)
        $('#alertModal').fadeIn('normal', () => {
            $('#alertModal').modal('show')
        })
        $('.modalCloseButton').on('click', () => {
            $('#alertModal').fadeOut('normal', () => {
                $('#alertModal').modal('hide')
            })
        })
    }
  
    function cardGenerator(className, res) {
        const $resultCard = $(
            `<div class="card resultCard ${className}Card mx-3 my-3 position-relative"></div>`
        )
        const $closeCardButton = $(
            `<button style='top: 10px; right: 20px' type="button" class='btn-close closeButton${className} position-absolute' aria-label="Close"></button>`
        )
        const $resultCardRow = $(`<div class="row ${className}Row g-0"></div>`)
        const $resultTextColumn = $(`<div class="col-xl-8"></div>`)
        const $resultCardHeader = $(`<div class='card-header overflow-auto'></div>`)
        const $cardHeaderTitle = $(
            `<h2 class="card-title cardTitle${className}">${res[0].name}</h2>
            <img class='${className}FactButton factIcon'
            src='https://img.icons8.com/?size=512&id=XBJfETMfZHpS&format=png' style='height:2rem; width:2rem;'/>`
        )  
        const $resultCardBody = $(`<div class="card-body"></div>`)
        const $cardBodyText = $(
            `<p class="card-text">
                <b>${res[0].name}</b>, located in <b>${res[0].region}</b>, has a population of approximately <b>${(res[0].population / 1000).toFixed(3)} million</b> and a population growth rate of <b>${res[0].pop_growth}%</b>. The country spans a surface area of <b>${res[0].surface_area} square kilometers</b> with a population density of <b>${res[0].pop_density} people per square kilometer</b>. <b>${res[0].capital}</b> serves as its capital city. <b>${res[0].name}'s GDP</b> stands at <b>${(res[0].gdp / 1000).toFixed(3)} billion dollars</b>, with a GDP growth rate of <b>${res[0].gdp_growth}%</b>. The country's GDP per capita is <b>${res[0].gdp_per_capita}</b>, and its currency is called the <b>${res[0].currency.name} (${res[0].currency.code})</b>. The sex ratio is <b>${res[0].sex_ratio}</b>, and the fertility rate is <b>${res[0].fertility}</b>. Life expectancy for males is <b>${res[0].life_expectancy_male} years</b>, while for females, it is <b>${res[0].life_expectancy_female} years</b>. The unemployment rate in <b>${res[0].name}</b> is <b>${res[0].unemployment}%</b>, and the urban population constitutes <b>${res[0].urban_population}%</b> of the total population. Forested areas cover <b>${res[0].forested_area}%</b> of the country, and <b>${res[0].internet_users}% of the population</b> uses the internet.
            </p>`
        )

        $resultCard.append($resultCardRow);
        $resultCard.append($closeCardButton);
        $resultCardRow.append($resultTextColumn);
        $resultTextColumn.append($resultCardHeader);
        $resultCardHeader.append($cardHeaderTitle);
        $resultTextColumn.append($resultCardBody);
        $resultCardBody.append($cardBodyText);
        return $resultCard;
    }

    function historyEventGenerator(historyEventURL, className) {
        fetch(historyEventURL, {
            method: 'GET',
            headers: {
                'X-Api-Key': 'Aof+BUX/KoGO4Qilsx47mg==4m6ZlgtM09HzXxXf',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((event) => {
                $(`.cardTitle${className}`).after(`
                    <span class='${className}-card-subtitle cardSub'>
                        Did you know that on ${event[0].day}/${event[0].month}/${event[0].year} ${event[0].event}
                    </span>
                `);
                hideFact(className)
            })
        
    }

    function factButton(className) {
        $(`.${className}FactButton`).on('click', (e) => {
			e.preventDefault()
            if($(`.${className}-card-subtitle`).is(`:hidden`)) {
                $(`.${className}-card-subtitle`).fadeIn('normal', () => {
                    $(`.${className}-card-subtitle`).show()
                })
            } else {
                $(`.${className}-card-subtitle`).fadeOut('normal', () => {
                    $(`.${className}-card-subtitle`).hide()
                })
            }
		})
    }

    function hideFact(className) {
        $(`.${className}-card-subtitle`).hide()
    }

    function imgGenerator(imgUrl, className) {
        fetch(imgUrl)
            .then((res) => res.json())
            .then((img) => {
                $(`.${className}Row`).append(`
                <div class="col-xl-4">
                    <img src=${img.urls.regular} class="card-img-bottom"/>   
                </div>
                `)
            })
    }

    function cardCloseButtonGenerator(className, searchedPlace) {
        $(`.closeButton${className}`).on('click', (e) => {
            e.preventDefault()
            searchedPlace.splice(
                searchedPlace.indexOf(className),
                1
            )
            $(`.${className}Card`).fadeOut('normal', () => {
                $(`.${className}Card`).remove()
            })
            if(searchedPlace.length === 0) {
                $inputGroup.css('margin-top', '100px');
                $searchedInput.val('');
                $clearButton.fadeOut().hide();
                $headingOne.fadeIn().removeClass('d-none');
            }
        })
    }

    function fetchResult(historyEventURL, imgUrl, res) {
        $spinner.removeClass('loader');
        let className = res[0].iso2
        className = className.replace(/\s/g, '-')
        if (stateObj.searchedPlace.includes(className)) {
            showAlert(
                'You already have one search result for this country!'
            )
        } else {
            $(`.input-group`).css({
                'margin-top': '50px',
                transition: 'margin-top 2s',
            })
            stateObj.searchedPlace.push(className)
            if(!$(`.searchHistoryList li:contains("${userInput.toLowerCase()}")`).length > 0) {
                $searchHistoryList.prepend(`<li class="${res[0].capital}Search searchItem">${userInput.toLowerCase()}</li>`)
            }
            $(`.${res[0].capital}Search`).on('click', () => {
                $searchedInput.val($(`.${res[0].capital}Search`).text())
            })
            $clearButton.show()
            $searchHistoryButton.show()
            $resultContainer.prepend(
                cardGenerator(className, res).hide().fadeIn(500)
            )
            $headingOne.fadeOut('normal', () => {
                $headingOne.addClass('d-none')
            })
            historyEventGenerator(historyEventURL, className)
            imgGenerator(imgUrl, className)
            cardCloseButtonGenerator(className, stateObj.searchedPlace)
            factButton(className)
        }         
    }

    function countryInfoFinder() {
        let encodedUserInput = encodeURIComponent(userInput) 
        const countryUrl = `https://api.api-ninjas.com/v1/country?name=${encodedUserInput}`
        const historyEventURL = `https://api.api-ninjas.com/v1/historicalevents?text=${encodedUserInput}`;
        const imgUrl = `https://api.unsplash.com/photos/random?query=${encodedUserInput}&per_page=1&client_id=AiG33FsEn1tb1bcGUvDmXm7cQrIC6RsKaKh623pQ8Dc`
        if (encodedUserInput.trim() === '') {
            showAlert('Please enter name of a country or its city')
        } else {
            fetch(countryUrl, {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'Aof+BUX/KoGO4Qilsx47mg==4m6ZlgtM09HzXxXf',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    fetchResult(historyEventURL, imgUrl, res);
                })
                .catch(() => {
                    showAlert(
                        "We couldn't find the name of the country you were looking for, please try in a different way!"
                    )
                })
        }  
    }
})