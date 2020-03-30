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
    let img_el = document.getElementById("img");
    let temp_el = document.getElementById("temp");
    let city_Name_el = document.getElementById("city_Name");

    const icon = data.weather_response.DailyForecasts[0].Day.Icon;
    const city_Name = data.city_response[0].LocalizedName;
    const temp = (((data.weather_response.DailyForecasts[0].Temperature.Maximum.Value +
        data.weather_response.DailyForecasts[0].Temperature.Minimum.Value)/2 - 32)*5/9).
    toFixed(1);

    city_Name_el.innerText = city_Name;
    img_el.data = `../css/icons/${icon}.svg`;
    temp_el.innerText = temp;

    // If the error was showing, now it's fine. Because to get to this method,
    // we should successfully fetch the data first.
    cityForm.cityField.classList.remove("is-invalid");
    weather_layout();
};

// Fetching the data for both
const new_search = async (search) => {
    const city_response = await fetch_city(search);
    const weather_response = await fetch_weather(city_response[0].Key);

    return {city_response, weather_response};
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
        // receive the data
        new_search(search)
            .then( data =>{
                // update UI
                update_content(data);
            })
            .catch(err => {
                console.log(err);
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
