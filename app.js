$(document).ready(() => {
    const searchResult = {}
    const $main = $('main');
    const $resultContainer = $('#result-container');
    let userInput;
    let isValidSearch = true;
    
    
    generateSearchBar();
        const $searchBar = $('#search-bar');
        const $searchButton = $('#search-button');
        const $clearButton = $('#clear-button');
        const $searchedInput = $('#searched-place');

    $clearButton.hide()

    $searchButton.on('click', (e) => {
        e.preventDefault();
        userInput = $searchedInput.val();
        countryInfoFinder();
        $clearButton.show();
    })

    function generateSearchBar() {
        $main.prepend(`
            <div id="search-bar" class="container mt-5">
                <form>
                    <div class="input-group">
                        <div class="form-floating">
                            <input type="text" id="searched-place" class="form-control" placeholder="Search here"/>
                            <label for="text" class="form-label">Search the city or country you want to know about!</label>
                        </div>
                        <button type="submit" id="search-button" class="btn btn-outline-primary" >Search</button>
                        <button id="clear-button" class="btn btn-outline-danger">Clear all</button>      
                    </div>
                </form>
            </div>`
            )
    }


    function countryInfoFinder() {
        const countryUrl = `https://api.api-ninjas.com/v1/country?name=${userInput}`;
        const importantInfoKeys = [
					'gdp',
                    'gdp_growth',
					'sex_ratio',
					'surface_area',
					'life_expectancy_male',
					'unemployment',
					'capital',
					'life_expectancy_female',
					'population',
                    'pop_growth',
                    'fertility',
                    'urban_population',
					'region',
                    'forested_area',
					'pop_density',
					'internet_users',
					'gdp_per_capita',
					'currency',
				]
        fetch(countryUrl, {
            method: 'GET',
            headers: {
                'X-Api-Key': 'Aof+BUX/KoGO4Qilsx47mg==4m6ZlgtM09HzXxXf',
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(res => {
                if(userInput.trim() === '') {
                    alert('Please enter something')
                } else {
                    searchResult[res[0].name] = {};
                    importantInfoKeys.forEach(key => {
                        searchResult[res[0].name][key] = res[0][key];
                    });
                    historyInfoFinder();
                    imgFinder();
                    console.log(searchResult)
                }
            })
            .catch(() => {
                isValidSearch = false;
                alert('Wrong Search');
            });
    }

    function historyInfoFinder() {
        if (isValidSearch) {
            const historyEventURL = `https://api.api-ninjas.com/v1/historicalevents?text=${userInput}`;

            fetch(historyEventURL, {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'Aof+BUX/KoGO4Qilsx47mg==4m6ZlgtM09HzXxXf',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((event) => {
                    Object.keys(searchResult).forEach(name => {
                        searchResult[name].event = event[0];
                    })
                }) 
                .catch((err) => alert(err))
        } 
    }

    function imgFinder() {
        const imgUrl = `https://api.unsplash.com/photos/random?query=${``}&per_page=1&client_id=AiG33FsEn1tb1bcGUvDmXm7cQrIC6RsKaKh623pQ8Dc`

        fetch(imgUrl)
            .then(res => res.json())
            .then(img => {
                Object.keys(searchResult).forEach((name) => {
                    searchResult[name].imgUrl = img.urls.regular;
                })
            })
            .catch(err => alert(err))
    }
})



    // $main.append(
    //     `<div id="result-container"></div>`
    // )
    
    // function resultGenerator() {
    //     $resultContainer.append(
    //         `<div class="card"></div>`
    //     )
    // }   


    // function timeFinder() {
    //     if (isValidSearch) {
    //         const timeUrl = `https://api.api-ninjas.com/v1/worldtime?city=${userInput}`;

    //             fetch(timeUrl, {
    //                 method: 'GET',
    //                 headers: {
    //                     'X-Api-Key': 'Aof+BUX/KoGO4Qilsx47mg==4m6ZlgtM09HzXxXf',
    //                     'Content-Type': 'application/json',
    //                 },
    //             })
    //                 .then((res) => res.json())
    //                 .then((time) => {
    //                     Object.keys(searchedData).forEach((name) => {
    //                         searchedData[name].time = time;
    //                     })
    //                 })
    //                 .catch((err) => alert('No Info'))
    //     }
    // }



    // function cityInfoFinder() {
    //     if(!isCountryOrCapital) {
    //         const cityUrl = `https://api.api-ninjas.com/v1/city?name=${userInput}`
            
    //         fetch(cityUrl, {
    //             method: 'GET',
    //             headers: {
    //                 'X-Api-Key': 'Aof+BUX/KoGO4Qilsx47mg==4m6ZlgtM09HzXxXf',
    //                 'Content-Type': 'application/json'
    //             },
    //         })
    //             .then(res => res.json())
    //             .then(res => {
    //                 //countryInfoFinder(res[0].country)
    //                 // console.log(searchedData)
    //             })
    //             .catch(err => {
    //                 isValidSearch = false;
    //                 alert(`The city or country you searched in doesn't match our data, please try it in a different way`)
    //             });
    //     }
    // }
