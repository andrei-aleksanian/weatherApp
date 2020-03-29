const cityForm = document.getElementById("cityForm");
const city_div = document.getElementById("city");
const apiKey = "tdofItrvmiI6XWOcfsICAjG7K3HKJHuL\n";

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

const fetch_city = async (city) => {
    const cityAPI_link = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
    let response = await fetch(cityAPI_link);

    response = await response.json();

    return response;
};

const fetch_weather = async (cityKey) => {
    const weatherAPI_link = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${apiKey}&language=en`;

    let response = await fetch(weatherAPI_link);

    response = await response.json();

    return response;
};

const update_content = (data) => {
    let img = document.getElementById("img");
    let temp = document.getElementById("temp");
    let city_Name = document.getElementById("city_Name");

    city_Name.innerText = data.city_Name;
    img.data = `../css/icons/${data.icon}.svg`;
    temp.innerText = data.temp.toFixed(1);

    cityForm.cityField.classList.remove("is-invalid");
};

const error_message = () => {
    cityForm.cityField.classList.add("is-invalid");
};

cityForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    weather_layout();
    let search = cityForm.cityField.value.trim();
    fetch_city(search)
        .then( cityObject => {
            const city_Key = cityObject[0].Key;
            const city_Name = cityObject[0].LocalizedName;

            return {city_Key, city_Name};
        })
        .then( city => {
            fetch_weather(city.city_Key)
                .then( weatherObject => {
                    const temp = ((weatherObject.DailyForecasts[0].Temperature.Maximum.Value + weatherObject.DailyForecasts[0].Temperature.Minimum.Value)/2 - 32)*5/9;
                    const icon = weatherObject.DailyForecasts[0].Day.Icon;
                    const city_Name = city.city_Name;
                    update_content( {city_Name, temp, icon});
                })
                .catch( err => {
                    console.log(err.message);
                })
            // let weather = weather(city.city_Key);
            // weather.cityName = city.city_Name;
            // return weather;
        })
        .catch( err => {
            error_message();
        });

    cityForm.reset();
});

question_layout();




























// Learning and Testing code

// const getTodos = (link) => {
//     return new Promise((resolve, reject) => {
//         const request = new XMLHttpRequest();
//
//         request.addEventListener("readystatechange", () => {
//             if (request.readyState === 4 && request.status === 200) {
//                 const data = JSON.parse(request.responseText);
//                 resolve(data);
//             } else if (request.readyState === 4) {
//                 reject("error");
//             }
//         });
//
//         request.open("GET", link);
//         request.send();
//     });
// };

// const getTodos = async () =>{
//
//     const response = await fetch("https://jsonplaceholder.typicode.chom/posts");
//
//     if(response.status !== 200){
//         throw new Error("cannot fetch the data");
//     }
//
//     const data = await response.json();
//
//     return data;
//
// };
//
// console.log(1);
// console.log(2);
//
// // getTodos("https://jsonplaceholder.typicode.com/posts")
// //     .then(data =>{
// //         console.log(data);
// //         return getTodos("https://jsonplaceholder.typicode.com/posts")
// //     }).then(data =>{
// //         console.log(data);
// //     }).catch(err =>{
// //         console.log(err);
// // });
//
// getTodos().then(data =>{
//     console.table(data);
// }).catch(err =>{
//     console.log(err.message);
// });
//
//
//
// console.log(3);
// console.log(4);
//
