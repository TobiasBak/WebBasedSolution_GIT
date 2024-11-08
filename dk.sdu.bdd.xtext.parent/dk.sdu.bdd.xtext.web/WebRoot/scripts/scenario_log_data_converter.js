const data_path = './logs/scenario_log.json';

const frequency_ms = 50;
let old_data = null

setInterval(function () {
    const json_data = loadData(data_path);
    if (!json_data) {
        generateWhyline([])
    }
    if (!json_data || compareArraysTheRightWay(json_data, old_data)) {
        return;
    }
    const whyline_data = processWhylineData(json_data);
    generateWhyline(whyline_data)
    old_data = json_data;


}, frequency_ms);


function compareArraysTheRightWay(a, b) {
    return (JSON.stringify(a) === JSON.stringify(b));
}


function createSpecificWhylineObjects(i, whylineData, object, scenarioType) {
    if (object.status === "untested") {
        return
    }
    if (i === 0) {
        whylineData.push({
            type: "node",
            status: object.status,
            value: scenarioType + " " + object.text,
            result: object.skipped ? "node-skipped" : object.failure ? "node-failed" : "node-passed",
            dura: object.duration
        });
    } else {
        whylineData.push({
            type: "node",
            status: object.status,
            value: "And " + object.text,
            result: object.skipped ? "node-skipped" : object.failure ? "node-failed" : "node-passed",
            dura: object.duration
        });
    }
    if (object.skipped) {
        whylineData.push({type: "connector", status: object.status, value: "skipped", result: "connector-skipped"});
    } else if (object.status !== "running") {
        whylineData.push({
            type: "connector",
            status: object.status,
            value: String(!object.failure),
            result: object.failure ? "failed" : "passed"
        });
    }
}

function addDoneNodeToWhylineScenario(whyline_objects, scenario_object) {
    for (const obj of scenario_object.whens || scenario_object.givens || scenario_object.thens) {
        if (obj.status === "untested" || obj.status === "running") {
            return
        }
    }
    whyline_objects.push({type: "done", value: "Done"});
}

function processWhylineData(objects) {
    const whylineData = [];

    for (const obj of objects) {
        whylineData.push({type: "scenario", value: "Scenario: " + obj.name, id: obj.id});

        for (const [i, given] of obj.givens.entries()) {
            createSpecificWhylineObjects(i, whylineData, given, "Given");
        }

        for (const [i, when] of obj.whens.entries()) {
            createSpecificWhylineObjects(i, whylineData, when, "When");
        }

        for (const [i, then] of obj.thens.entries()) {
            createSpecificWhylineObjects(i, whylineData, then, "Then");
        }

        addDoneNodeToWhylineScenario(whylineData, obj);
    }

    return whylineData;
}


function generateWhyline(whyline_data) {
    console.log(whyline_data)
    const $whyline = $('#whyline');
    let $scenario;
    $whyline.empty();
    whyline_data.forEach(item => {
        if (item.type === "scenario") {
            $scenario = $('<div>').attr('id', 'scenario' + item.id).addClass('whyline-scenario');
            const $scenarioName = $('<h2>').addClass('whyline-scenario-name').text(item.value);
            $whyline.append($scenarioName);
            $whyline.append($scenario);
        } else if (item.type === "node") {
            const $nodeWrapper = $('<div>').addClass('whyline-node-wrapper');
            const $node = $('<div>').addClass(['whyline-node', item.status, item.result]).text(item.value);
            const $duration = $('<p>').addClass('whyline-duration').text(item.dura.toPrecision(2) + "s");
            $nodeWrapper.append($node);
            $nodeWrapper.append($duration);
            $scenario.append($nodeWrapper);
        } else if (item.type === "connector") {
            const $connector = $('<div>').addClass(['whyline-connector', item.status, item.result]);
            const $text = $('<span>').text(item.value);
            $connector.append($text);
            $scenario.append($connector);
        } else if (item.type === "done") {
            const $done = $('<div>').addClass('whyline-done').text(item.value);
            $scenario.append($done);
        }
    });
}