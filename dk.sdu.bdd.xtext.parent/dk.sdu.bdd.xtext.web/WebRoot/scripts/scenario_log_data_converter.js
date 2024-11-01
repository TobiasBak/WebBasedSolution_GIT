// We are going to fetch localhost with a mode to allow CORS.
// We are simply fetching scenario_log.json which is in WebRoot.
// Fetching the JSON file.
const dataPath = './scenario_log.json';
function loadData(path) {
    fetch(path, {
        mode: 'no-cors'
    })
        .then(response => response.json())
        .then(data => {
            json_data = data;
        });
    return json_data
}

const frequency_ms = 1000;

let mother_data = null
setInterval(function () {
    let json_data = loadData(dataPath);

    if (!mother_data || !compareArraysTheRightWay(json_data, mother_data)) {
        console.log("We Have new Data!");

        mother_data = json_data;
    } else {
        return
    }

    // We have new data we need to do shit now
    whyline_data = convertMotherDataToWhylineData(mother_data)

    generateWhyline(whyline_data)

}, frequency_ms);

function compareArraysTheRightWay(a, b){
    return (JSON.stringify(a) === JSON.stringify(b));
}


function convertMotherDataToWhylineData(json_object) {
    // From the json object we need to generate
    whyline_data = []


// # The dummy object should be converted to a list of objects and connections in the following format
// # whylineData2 = [
// # 				{ type: "node", value: "Why did that not happen" },
// # 				{ type: "connector", value: "true" },
// # 				{ type: "node", value: "Hejsa med dig" },
// # 				{ type: "connector", value: "false" },
// # 				{ type: "node", value: "Ooooogooanb" },
// # 				{ type: "connector", value: "true" },
// # 				{ type: "node", value: "Hejsa med dig" },
// # 				{ type: "connector", value: "false" },
// # 				{ type: "node", value: "Ooooogooanb" },
// # 				{ type: "connector", value: "true" },
// # 				{ type: "node", value: "Hejsa med dig" },
// # 				{ type: "connector", value: "false" },
// # 				{ type: "node", value: "Ooooogooanb" },
// # 			];



}


function generateWhyline(whyline_data) {
    whyline_data.forEach(item => {
        if (item.type === "node") {
            const $node = $('<div>').addClass('whyline-node').text(item.value);
            $whyline.append($node);
        } else if (item.type === "connector") {
            const $connector = $('<div>').addClass('whyline-connector');
            const $text = $('<span>').text(item.value);
            $connector.append($text);
            $whyline.append($connector);
        }
    });


}