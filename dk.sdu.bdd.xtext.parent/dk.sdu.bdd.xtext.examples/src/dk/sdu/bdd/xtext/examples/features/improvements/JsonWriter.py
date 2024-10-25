import json
from array import array

from behave.model import Scenario


def create_scenario_info_from_context(scenario: Scenario) -> dict:
    data = {
        "scenario_name": scenario.name,
        "stage": scenario.line,
    }

    return data


def append_to_json_file(data: dict, filename: str = "scenario_log.json"):
    with (open(filename, "rw") as file):
        existing_content = json.load(file)
        if existing_content is not array:
            new_data = [
                existing_content,
                data
            ]
        else:
            new_data = existing_content
            new_data.append(data)

        serialized = json.dumps(new_data)
        file.write(serialized)


def write_to_file(strin: str, filename: str = "someDooDoo.csv", overwrite: bool = False):
    write_mode = "w" if overwrite else "a"

    with open(filename, write_mode) as file:
        file.write(strin + "\n")


def write_to_log(strin: str, scenario_name: str, scenario_step: str):
    write_to_file(f"{strin},{scenario_name},{scenario_step}", "DooDooLogs.csv")
