// Client-Side
/* Global Variables Initializing */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// The unique API key
const apiKey = "3a2ed9a10e57ce9f9eefdbf5987b0091";

// finding the element with id generate using the DOM
const generateBtn = document.querySelector('#generate');

// Adding an event listener to the button, when clicked runs the generateFunc fucntion
generateBtn.addEventListener('click', generateFunc );

async function generateFunc(){
    // Checking for varios errors (like not entering a ZIP code or entering a wrong one)
    try{
        // getting the input (ZIP Code) data of the user
        const zipCode = document.querySelector('#zip').value;
        
        // check if no zip code is entered
        if(!zipCode){
            alert('Please enter the Zip code of the area!');
            return;
        }
        
        // Url to get the data from using the zip code and the API key
        const fullUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`
        
        //  getting the data in a variable, 2nd argument is either post or get(get by default), await is used for better loading website with no delays
        const res = await fetch( fullUrl); 
        const weatherData = await res.json(); // to be able to read the retrieved data
        // console.log(weatherData.main.temp); // checking the place of the required data and is reached correctly
        // setting the value of temperature in a variable
        const temp = weatherData.main.temp;

        // getting the input (feelings) data of the user
        const content = document.querySelector('#feelings').value;
        
        // function to post collected data to the given route in server.js
        await postData(temp,content);

        // get the data from the getWd route created in server.js
        const nodeResponse = await fetch('/getWD');
        let finalData = await nodeResponse.json();
        
        // logging final data in the console and calling a function to present
        console.log(finalData);
        presentData(finalData);

    }catch(err){
        // creating error messsage object and call a function to present it
        const errorShow = {date:"error", temp:'error', content: 'error'}
        presentData(errorShow);
        
        // alerting the user about the mistake and logging it in the console
        alert('Please enter a valid Zip code of The USA!');
        console.log('An error was detected, which is a '+err);
    }
}

// Post data (which includes date, temperature and contents) to its specific route
async function postData(temp,content){
    await fetch('/saveWD', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        
        // send data to the body of the request
        body: JSON.stringify( {
            date: newDate,
            temp,
            content
        } )
    });
};

// A function which will update the most recent datasection with the final data we get
function presentData(finalData){
    const dateE = document.querySelector('#date');
    dateE.innerHTML = `Date: ${finalData.date}`;

    const tempE = document.querySelector('#temp');
    tempE.innerHTML = `Temperature: ${finalData.temp} °C`;

    const contentE = document.querySelector('#content');
    contentE.innerHTML = `Feelings: ${finalData.content}`;
};