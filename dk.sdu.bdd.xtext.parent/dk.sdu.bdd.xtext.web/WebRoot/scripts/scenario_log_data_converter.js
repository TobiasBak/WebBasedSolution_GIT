


// We are going to fetch localhost with a mode to allow CORS.
// We are simply fetching scenario_log.json which is in WebRoot.



// Fetching the JSON file.
fetch('http://localhost:8080/scenario_log.json', {
    mode: 'no-cors'
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
})



