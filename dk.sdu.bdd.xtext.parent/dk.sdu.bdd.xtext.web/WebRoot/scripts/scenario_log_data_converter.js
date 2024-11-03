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
    whyline_data = processWhylineData(mother_data)

    generateWhyline(whyline_data)

}, frequency_ms);

function compareArraysTheRightWay(a, b){
    return (JSON.stringify(a) === JSON.stringify(b));
}


function processWhylineData(objects) {
    const whylineData = [];

    for (const obj of objects) {
        whylineData.push({ type: "node", value: obj.name });

        for (const given of obj.givens) {
            if (given.skipped) {
                whylineData.push({ type: "connector", value: "skipped" });
            } else {
                whylineData.push({ type: "connector", value: String(!given.failure) });
                whylineData.push({ type: "node", value: given.text });
            }
        }

        for (const when of obj.whens) {
            if (when.skipped) {
                whylineData.push({ type: "connector", value: "skipped" });
            } else {
                whylineData.push({ type: "connector", value: String(!when.failure) });
                whylineData.push({ type: "node", value: when.text });
            }
        }

        for (const then of obj.thens) {
            if (then.skipped) {
                whylineData.push({ type: "connector", value: "skipped" });
            } else {
                whylineData.push({ type: "connector", value: String(!then.failure) });
                whylineData.push({ type: "node", value: then.text });
            }
        }
    }

    console.log(whylineData);
    return whylineData;
}



function generateWhyline(whyline_data) {
    const $whyline = $('#whyline');
    $whyline.empty();
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