const data_path = './logs/scenario_log.json';

const frequency_ms = 100;
let old_data = null

setInterval(function () {
    const json_data = loadData(data_path);
    if (!json_data || compareArraysTheRightWay(json_data, old_data)) { return; }

    const whyline_data = processWhylineData(json_data);
    generateWhyline(whyline_data)
    old_data = json_data;


}, frequency_ms);


function compareArraysTheRightWay(a, b){
    return (JSON.stringify(a) === JSON.stringify(b));
}


function createSpecificWhylineObjects(i, whylineData, object, scenarioType) {
    if (i === 0) {
        whylineData.push({type: "node", value: scenarioType + " " + object.text});
    } else {
        whylineData.push({type: "node", value: "And " + object.text});
    }
    if (object.skipped) {
        whylineData.push({type: "connector", value: "skipped"});
    } else {
        whylineData.push({type: "connector", value: String(!object.failure)});
    }
}

function processWhylineData(objects) {
    const whylineData = [];

    for (const obj of objects) {
        whylineData.push({ type: "scenario", value: "Scenario: " + obj.name, id: obj.id});

        for (const [i, given] of obj.givens.entries()) {
            createSpecificWhylineObjects(i, whylineData, given, "Given");
        }

        for (const [i, when] of obj.whens.entries()) {
            createSpecificWhylineObjects(i, whylineData, when, "When");
        }

        for (const [i, then] of obj.thens.entries()) {
            createSpecificWhylineObjects(i, whylineData, then, "Then");
        }

        whylineData.push({ type: "done", value: "Done" });
    }

    return whylineData;
}


function generateWhyline(whyline_data) {
    const $whyline = $('#whyline');
    let $scenario;
    $whyline.empty();
    whyline_data.forEach(item => {
        if(item.type === "scenario") {
            $scenario = $('<div>').attr('id', 'scenario' + item.id).addClass('whyline-scenario');
            const $scenarioName = $('<h2>').addClass('whyline-scenario-name').text(item.value);
            $whyline.append($scenarioName);
            $whyline.append($scenario);
        } else if (item.type === "node") {
            const $node = $('<div>').addClass('whyline-node').text(item.value);
            $scenario.append($node);
        } else if (item.type === "connector") {
            const $connector = $('<div>').addClass('whyline-connector');
            const $text = $('<span>').text(item.value);
            $connector.append($text);
            $scenario.append($connector);
        } else if (item.type === "done") {
            const $done = $('<div>').addClass('whyline-done').text(item.value);
            $scenario.append($done);
        }
    });


}