# Create dummy object from this json
import os.path

dummyData = [
    {
        "id": 1,
        "name": "Scenario Assembling Lego",
        "duration": 1.22,
        "givens": [
            {
                "text": "The Robot arm is position 'default'",
                "duration": 0.22,
                "failure": False,
                "skipped": False
            }
        ],
        "whens": [
            {
                "text": "The Robot arm moves to position 'point1'",
                "duration": 1.0,
                "failure": False,
                "skipped": False
            }
        ],
        "thens": [
            {
                "text": "The Robot arm is at position 'point1'",
                "duration": 0.0,
                "failure": False,
                "skipped": False
            }
        ]
    }
]

# The dummy object should be converted to a list of objects and connections in the following format
# whylineData2 = [
# 				{ type: "node", value: "Why did that not happen" },
# 				{ type: "connector", value: "true" },
# 				{ type: "node", value: "Hejsa med dig" },
# 				{ type: "connector", value: "false" },
# 				{ type: "node", value: "Ooooogooanb" },
# 				{ type: "connector", value: "true" },
# 				{ type: "node", value: "Hejsa med dig" },
# 				{ type: "connector", value: "false" },
# 				{ type: "node", value: "Ooooogooanb" },
# 				{ type: "connector", value: "true" },
# 				{ type: "node", value: "Hejsa med dig" },
# 				{ type: "connector", value: "false" },
# 				{ type: "node", value: "Ooooogooanb" },
# 			];

def convert_to_node_connecter(object):
    whylineData = []
    for obj in object:
        whylineData.append({"type": "node", "value": obj["name"]})
        for given in obj["givens"]:
            if given["skipped"]:
                whylineData.append({"type": "connector", "value": "skipped"})
            else:
                whylineData.append({"type": "connector", "value": str(not given["failure"])})
                whylineData.append({"type": "node", "value": given["text"]})
        for when in obj["whens"]:
            if when["skipped"]:
                whylineData.append({"type": "connector", "value": "skipped"})
            else:
                whylineData.append({"type": "connector", "value": str(not when["failure"])})
                whylineData.append({"type": "node", "value": when["text"]})
        for then in obj["thens"]:
            if then["skipped"]:
                whylineData.append({"type": "connector", "value": "skipped"})
            else:
                whylineData.append({"type": "connector", "value": str(not then["failure"])})
                whylineData.append({"type": "node", "value": then["text"]})
    print(whylineData)
    return whylineData

data = convert_to_node_connecter(dummyData)

def overwrite_js_data(data):
    # Get absolute path to the file
    path_to_file = os.path.abspath("../../../../../../../../../../dk.sdu.bdd.xtext.web/WebRoot/scripts/json_data.js")
    print(f"The path: {path_to_file}")
    # We need to write the following to file const = data;
    with open(path_to_file, "w") as file:
        file.write(f"const whylineData2 = {data};")


overwrite_js_data(data)
