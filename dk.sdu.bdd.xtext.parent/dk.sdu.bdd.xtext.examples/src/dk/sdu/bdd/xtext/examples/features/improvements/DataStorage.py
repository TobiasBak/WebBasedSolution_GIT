import json

from behave.model import Scenario, Step, Status

from JsonWriter import write_to_file
from SocketMessages import JsonScenario

executed_scenarios = []
current_scenario: JsonScenario


#Rename
def finalize_scenario(scenario: Scenario):
    '''
    Run after scenario
    '''
    global current_scenario
    if current_scenario is not None:
        current_scenario.update_duration(scenario.duration)
        executed_scenarios.append(current_scenario)
        write_to_file(json.dumps([scenario.dump_to_json() for scenario in executed_scenarios]), "scenario_log.json", True)
        current_scenario = None


#Rename
def send_scenario(scenario: Scenario):
    '''
    Runs before_scenario
    '''
    global current_scenario
    if current_scenario is not None:
        raise Exception("Current scenario is not None")
    current_scenario = JsonScenario(scenario, len(executed_scenarios))


def update_step_duration(step: Step):
    '''
    Run after step completion
    '''
    scenario_step = current_scenario.step_map[step]
    scenario_step.update_duration(step.duration)
    scenario_step.mark_skipped(not step.status == Status.passed)




