from behave.model import Scenario, Step, Status

from SocketMessages import JsonScenario

# class behave.model.Scenario(filename, line, keyword, name,
# tags=None, steps=None, description=None, parent=None,
# background=None, background_steps=None)

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

