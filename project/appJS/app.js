// Declaring Form variables
const cityForm = document.getElementById("cityForm");
const city_div = document.getElementById("city");
const apiKey = "Auo97JFRKAxXk6FCrRwdSEJrnpMT8Ep4";

// Switching Layouts
const question_layout = () =>{
    city_div.classList.add("hide");
    cityForm.children[0].children[1].classList.remove("hide");
    cityForm.children[0].children[0].classList.add("hide");
};

const weather_layout = () =>{
    city_div.classList.remove("hide");
    cityForm.children[0].children[1].classList.add("hide");
    cityForm.children[0].children[0].classList.remove("hide");
};

// Fetching city ID for the weather API first. (Specific to this API)
const fetch_city = async (city) => {
    const cityAPI_link = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
    let response = await fetch(cityAPI_link);

    response = await response.json();

    return response;
};

// Fetching the weather data second.
const fetch_weather = async (cityKey) => {
    const weatherAPI_link = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${apiKey}&language=en`;

    let response = await fetch(weatherAPI_link);

    response = await response.json();

    return response;
};

// Update content on the page
const update_content = (data) => {
    let img = document.getElementById("img");
    let temp = document.getElementById("temp");
    let city_Name = document.getElementById("city_Name");

    city_Name.innerText = data.city_Name;
    img.data = `../css/icons/${data.icon}.svg`;
    temp.innerText = data.temp.toFixed(1);

    // If the error was showing, now it's fine. Because to get to this method,
    // we should successfully fetch the data first.
    cityForm.cityField.classList.remove("is-invalid");
    weather_layout();
};

// Show error message and switch to old layout
const error_message = (message) => {
    let error_message = document.getElementsByClassName("invalid-feedback");
    question_layout();
    cityForm.cityField.classList.add("is-invalid");

    error_message.innerText = message;

};

// Send the form and get data
cityForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let search = cityForm.cityField.value.trim();

    if(search.length === 0){
        // Show error if user is not searching for anything
        let error_message = document.getElementsByClassName("invalid-feedback");
        cityForm.cityField.classList.add("is-invalid");

        error_message.innerText = "Please provide a valid city";
    }else{
        // Fetch the desired weather information
        fetch_city(search)
            .then( cityObject => {
                // Getting the first city in the json list
                const city_Key = cityObject[0].Key;  // Key is used in fetching weather data
                const city_Name = cityObject[0].LocalizedName;

                return {city_Key, city_Name};
            })
            .then( city => {
                // Fetch weather now with the city ID
                fetch_weather(city.city_Key)
                    .then( weatherObject => {
                        // F to C
                        const temp = ((weatherObject.DailyForecasts[0].Temperature.Maximum.Value + weatherObject.DailyForecasts[0].Temperature.Minimum.Value)/2 - 32)*5/9;
                        // Weirdly calculated weather icon
                        const icon = weatherObject.DailyForecasts[0].Day.Icon;
                        const city_Name = city.city_Name;
                        update_content( {city_Name, temp, icon});
                    }).catch( err =>{
                    error_message("Couldn't connect, try again later");
                })
            })
            .catch( err => {
                if(err.message === "Cannot read property 'Key' of undefined"){
                    error_message("Please provide a valid city");
                }else{
                    error_message("Couldn't connect, please please try again later");
                }
            });
    }

    cityForm.reset();
});

question_layout();
