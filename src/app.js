const container = document.querySelector('.container');
const loader = document.querySelector('.full-loader');

let currentTempOption = 'C';
let loading = true;

function formatDate(dateObject) {
    const date = new Date(dateObject);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    return formattedDate;
}

async function getLocation(location = 'Manila', days = 8, ) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8242900a48ad4de4bd1132203230709&q=${location}&days=${days}&aqi=no&alerts=no`, {mode: 'cors'})
        const weatherData = await response.json()
        if(!response.ok) {
            throw new Error(`Error! ${response.statusText}`)
        }
        return weatherData;
    } catch (error) {
        window.alert(error.message);
    }finally {
        loader.classList.remove('active');
    }
}


async function getData() {
    try {
        loader.classList.add('active');
        const data = await getLocation()

        const mergedData = {
            ...data.location,
            ...data.current
        }
    
        renderCurrentWeather(mergedData)
        renderWeeklyForeCast(data.forecast);
        setTimeout(() => {
            loader.classList.remove('active'); 
        }, 2000);
    } catch (error) {
        window.alert(error.message);
    } finally {
        loader.classList.remove('active');
    }
   
}

async function updateWeatherData(location) {
    loader.classList.add('active');
    const data = await getLocation(location);

    const mergedData = {
        ...data.location,
        ...data.current
    }

    renderCurrentWeather(mergedData);
    renderWeeklyForeCast(data.forecast);

    setTimeout(() => {
        loader.classList.remove('active');
    }, 2000);
}

function renderCurrentWeather(obj) {
    container.innerHTML = '';

    const properDateTime = formatDate(obj.localtime)

    const date = new Date(obj.localtime);
    const dayOfWeek = date.getDay();
    const daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let dayName = daysInWeek[dayOfWeek];

    const currentWeather = document.createElement('div');

    currentWeather.innerHTML = `<div class="form-search">
        <form id="search-form" autocomplete="off">
            <input type="text" name="location" placeholder="Manila" id="location" required>
            <button type="submit" id="search-btn">Search</button>
        </form>
        </div>
        <div class="current-forecast">
            <div class="current-time">${dayName}</div>
            <div class="current-location">${obj.name},  ${obj.country}</div>
            <div class="current-temp">
                <div class="temp-scale">
                    <h1 class="current-scale">${currentTempOption === 'C'? obj.temp_c : obj.temp_f }</h1>
                    <h3>°${currentTempOption === 'C'? 'C' : 'F' }</h3>
                </div>
                <div class="">
                    <img src="https:${obj.condition.icon}" alt="${obj.condition.text}">
                </div>
            </div>
            <h2>${obj.condition.text}</h2>
            <div class="current-weather-details">
                <div class="details-card">
                    <img src="./assets/icons/wind.svg" alt="Wind SVG Image">
                    <div>
                        <p class="details_card_desc">Wind</p>
                        <p class="details_card_val">${obj.wind_kph} km/h</p>
                    </div>
                </div>
                <div class="details-card">
                    <img src="./assets/icons/uvIndex.svg" alt="UV Index SVG Image">
                    <div>
                        <p class="details_card_desc">UV Index</p>
                        <p class="details_card_val">${obj.uv}</p>
                    </div>
                </div>
                <div class="details-card">
                    <img src="./assets/icons/feelsLike.svg" alt="Heat Index SVG Image">
                    <div>
                        <p class="details_card_desc">Heat Index</p>
                        <p class="details_card_val">${currentTempOption === 'C'? obj.temp_c : obj.temp_f } °${currentTempOption === 'C'? 'C' : 'F' }</p>
                    </div>
                </div>
                <div class="details-card">
                    <img src="./assets/icons/humidity.svg" alt="Humidity SVG Image">
                    <div>
                        <p class="details_card_desc">Humidity</p>
                        <p class="details_card_val">${obj.humidity}</p>
                    </div>
                </div>
            </div>
        </div>`;

    container.prepend(currentWeather);
        
    const searchForm = document.getElementById('search-form')


    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const location = document.getElementById('location').value;

        updateWeatherData(location);
    })
}



function renderWeeklyForeCast(forecastObj) {
        const weeklyForecastDiv = document.createElement('div');

        const forecastArray = forecastObj.forecastday;

        weeklyForecastDiv.classList.add('forecast-weather');

        const forecastTitle = document.createElement('h1');
        forecastTitle.classList.add('forecast-title');
        forecastTitle.textContent = `Weekly Forecast`

        weeklyForecastDiv.prepend(forecastTitle);

        const foreCastDiv = document.createElement('div');

        foreCastDiv.classList.add('week-forecast');

        let cardText = '';

        let startingIndex = 1;

        const forecastArraySelfExcluded = forecastArray.slice(startingIndex);


        forecastArraySelfExcluded.forEach((obj) => {
            const date = new Date(obj.date);
            const dayOfWeek = date.getDay();
            const daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            let dayName = daysInWeek[dayOfWeek];

            cardText += `<div class="forecast-card">
                <div class="forecast-date">
                    <h2>${dayName}</h2>
                    <p class='temp-details'>${obj.day.condition.text}</p>
                </div>
                <div class="forecast-temp">
                    <img src="https:${obj.day.condition.icon}" alt="${obj.day.condition.text}">
                    <h2>${currentTempOption === 'C'? obj.day.avgtemp_c : obj.day.avgtemp_f }</h2>
                    <h3>° ${currentTempOption === 'C'? 'C' : 'F' }</h3>
                </div>
            </div>`
          
        });

        foreCastDiv.innerHTML = cardText;

        weeklyForecastDiv.append(foreCastDiv);

        container.append(weeklyForecastDiv);
}


document.addEventListener('DOMContentLoaded', () => {
    getData();
})