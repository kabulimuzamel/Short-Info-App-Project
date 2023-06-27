$(document).ready(() => {
    const searchedPlace = [];
    const $resultContainer = $('#result-container');
    const $searchBar = $('#search-bar');
    const $searchButton = $('#search-button');
    const $clearButton = $('#clear-button');
    const $searchedInput = $('#searched-place');
    let userInput;
    
    $clearButton.hide();

    $searchButton.on('click', (e) => {
        e.preventDefault();
        userInput = $searchedInput.val();
        countryInfoFinder();
        console.log(searchedPlace)
    });

    $clearButton.on('click', (e) => {
        e.preventDefault();
        $('.resultCard').remove();
        searchedPlace.length = 0;
        $clearButton.hide();
    })

    function showAlert(message) {
        $('#alertMessage').text(message)
        $('#alertModal').modal('show')
        $('.modalCloseButton').on('click', () => {
            $('#alertModal').modal('hide')
        })
    }

    function cardGenerator(className, res) {
        return `<div class="card resultCard ${className}Card mx-3 my-3">
                    <div class="row ${className}Row g-0">
                        <div class="col-md-8">
                            <div class='card-header overflow-auto'>
                                <h2 class="card-title cardTitle${className}">${res[0].name}</h2>
                                <button style='position: absolute; top: 10px; right: 10px' type="button" class='btn-close closeButton${className}' aria-label="Close"></button>
                            </div>
                            <div class="card-body">
                                <p class="card-text">
                                    ${res[0].name}, located in ${res[0].region}, has a population of approximately ${(res[0].population / 1000).toFixed(3)} million and a population growth rate of ${res[0].pop_growth}%. The country spans a surface area of ${res[0].surface_area} square kilometers with a population density of ${res[0].pop_density} people per square kilometer. ${res[0].capital} serves as its capital city. ${res[0].name}'s GDP stands at ${(res[0].gdp / 1000).toFixed(3)} billion dollars, with a GDP growth rate of ${res[0].gdp_growth}%. The country's GDP per capita is ${res[0].gdp_per_capita}, and its currency is called the ${res[0].currency.name} (${res[0].currency.code}). The sex ratio is ${res[0].sex_ratio}, and the fertility rate is ${res[0].fertility}. Life expectancy for males is ${res[0].life_expectancy_male} years, while for females, it is ${res[0].life_expectancy_female} years. The unemployment rate in ${res[0].name} is ${res[0].unemployment}%, and the urban population constitutes ${res[0].urban_population}% of the total population. Forested areas cover ${res[0].forested_area}% of the country, and ${res[0].internet_users}% of the population uses the internet.
                                </p>                        
                            </div>
                        </div>
                    </div>
                </div>`
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
                    <span class='card-subtitle'>
                        Did you know that on ${event[0].day}/${event[0].month}/${event[0].year} ${event[0].event}
                    </span>
                    `)
            })
        
    }

    function imgGenerator(imgUrl, className) {
        fetch(imgUrl)
            .then((res) => res.json())
            .then((img) => {
                $(`.${className}Row`).append(`
                <div class="col-md-4">
                    <img src=${img.urls.regular} class="card-img-bottom"/>   
                </div>
                `)
            })
    }

    function cardCloseButtonGenerator(className, searchedPlace) {
        $(`.closeButton${className}`).on('click', (e) => {
            e.preventDefault()
            $(`.${className}Card`).remove()
            searchedPlace.splice(
                searchedPlace.indexOf(className),
                1
            )
        })
    }

    function countryInfoFinder() {
        userInput = encodeURIComponent(userInput)
        const countryUrl = `https://api.api-ninjas.com/v1/country?name=${userInput}`;
        const historyEventURL = `https://api.api-ninjas.com/v1/historicalevents?text=${userInput}`;
        const imgUrl = `https://api.unsplash.com/photos/random?query=${userInput}&per_page=1&client_id=AiG33FsEn1tb1bcGUvDmXm7cQrIC6RsKaKh623pQ8Dc`
        if(userInput.trim() === '') {
            showAlert('Please enter name of a country or its city')
        } else {
            fetch(countryUrl, {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'Aof+BUX/KoGO4Qilsx47mg==4m6ZlgtM09HzXxXf',
                    'Content-Type': 'application/json'
                },
            })
                .then(res => res.json())
                .then(res => {  
                    let className = res[0].iso2;
                    className = className.replace(/\s/g, '-');
                    if (searchedPlace.includes(className)) {
                        showAlert('You already have one search result for this country!')
                    } else {
                        searchedPlace.push(className);
                        $clearButton.show();
                        $resultContainer.prepend(cardGenerator(className, res))
                        historyEventGenerator(historyEventURL, className);
                        imgGenerator(imgUrl, className);
                        cardCloseButtonGenerator(className, searchedPlace);
                    }

                })
                .catch(() => {
                    showAlert("We couldn't find the name of the country you were looking for, please try in a different way!");
                })          

        } 
    }
})