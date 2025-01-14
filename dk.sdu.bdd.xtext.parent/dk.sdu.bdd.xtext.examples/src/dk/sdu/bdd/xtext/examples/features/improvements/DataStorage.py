import json
import os

from behave.model import Scenario, Step, Status

try:
    from JsonWriter import write_to_file
    from SocketMessages import JsonScenario
    from utils import get_path_to_webroot
except ImportError:
    from improvements.JsonWriter import write_to_file
    from improvements.SocketMessages import JsonScenario
    from improvements.utils import get_path_to_webroot

executed_scenarios = []
current_json_scenario: JsonScenario | None = None

json_filename = "scenario_log.json"
json_folder = os.path.join(get_path_to_webroot(), "logs")
json_abs_path = os.path.join(json_folder, json_filename)

print(f"JSON path: {json_abs_path}")


def save_scenario(scenario: Scenario):
    """
    Run after scenario
    """
    global current_json_scenario
    if current_json_scenario is not None:
        current_json_scenario.update_duration(scenario.duration)
        executed_scenarios.append(current_json_scenario)
        json_dump = [scenario.dump_to_json() for scenario in executed_scenarios]
        write_to_file(json.dumps(json_dump), json_abs_path, True)
        current_json_scenario = None


def create_scenario_in_storage(scenario: Scenario):
    """
    Runs before_scenario
    """
    global current_json_scenario
    if current_json_scenario is not None:
        raise Exception("Current scenario is not None")
    current_json_scenario = JsonScenario(scenario, len(executed_scenarios))


def update_step_duration(step: Step):
    """
    Run after step completion
    """
    current_json_step = current_json_scenario.step_map[step]
    current_json_step.update_duration(step.duration)
    current_json_step.mark_skipped(not step.status == Status.passed)


def mark_step_failure(step: Step):
    current_json_step = current_json_scenario.step_map[step]
    current_json_step.mark_failure(True)
