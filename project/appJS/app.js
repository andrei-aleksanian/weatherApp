const cityForm = document.getElementById("cityForm");
const city_div = document.getElementById("city");

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

cityForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    weather_layout();


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

const getTodos = async () =>{

    const response = await fetch("https://jsonplaceholder.typicode.chom/posts");

    if(response.status !== 200){
        throw new Error("cannot fetch the data");
    }

    const data = await response.json();

    return data;

};

console.log(1);
console.log(2);

// getTodos("https://jsonplaceholder.typicode.com/posts")
//     .then(data =>{
//         console.log(data);
//         return getTodos("https://jsonplaceholder.typicode.com/posts")
//     }).then(data =>{
//         console.log(data);
//     }).catch(err =>{
//         console.log(err);
// });

getTodos().then(data =>{
    console.table(data);
}).catch(err =>{
    console.log(err.message);
});



console.log(3);
console.log(4);

