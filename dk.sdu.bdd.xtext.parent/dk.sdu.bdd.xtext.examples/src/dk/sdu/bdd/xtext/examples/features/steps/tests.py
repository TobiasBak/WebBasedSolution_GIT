# steps/tests.py
import json
from array import array

from behave import when, given, then
import time
import environment as env
from behave.model import Scenario, Feature

"""
Each method is given context as a parameter.
This can be used to get information about the current scenario and access
the controller to send commands to the robot.

Examples:
1. context.scenario.name: Get the name of the current scenario
2. context.controller: Access the controller to send commands to the robot
3. context.receiver: Access the receiver to get information from the robot
4. context.scenario.skip("Reason"): Skip the current scenario or the rest of a scenario with a reason

The context.controller is of type RTDEControlInterface
The context.receiver is of type RTDEReceiveInterface
"""


@given('the position {prep} the robot "{identifier}" is "{position}"')
def step_given(context, identifier: str, position, prep):
    joint_positions = env.get_position(position)
    print(f"Joint positions: {joint_positions}")
    desired_pos = context.receiver.getActualQ()
    print(f"Desired position: {desired_pos}")
    # write_to_file(f"Before moving {time.perf_counter()} : pos -> {joint_positions} and desire {desired_pos}")
    print(context.scenario.name)
    print(context.scenario.steps)
    print(context.scenario.steps)


    # if context.receiver.getActualQ() != joint_positions or True:
    #     context.controller.moveJ(joint_positions, env.get_speed(), env.get_acceleration())
    #     write_to_file(f"After moving {time.perf_counter()}")
    #     time.sleep(10)

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


def soft_position_comparison(actual_position, desired_position, sensitivity: float = 0.01) -> bool:
    for i in range(len(actual_position)):
        if check_in_range_sensitivity(actual_position[i], desired_position[i], sensitivity):
            return True
    return False


def check_in_range_sensitivity(actual_pos: float, desired_pos: float, sensitivity: float):
    return not abs(actual_pos - desired_pos) <= sensitivity


@when('the robot "{identifier}" moves to position "{position}"')
def step_when(context, identifier: str, position):
    print(f"Running When")

    joint_position = env.get_position(position)
    controller = context.controller

    controller.moveJ(joint_position, env.get_speed(), env.get_acceleration())


@then('the position {prep} the robot "{identifier}" is "{position}"')
def step_then(context, identifier: str, position, prep):
    print(f"Running Then")

    joint_positions = env.get_position(position)
    current_pos = context.receiver.getActualQ()
    print(f"Current position: {current_pos}")
    print(f"Expected position: {joint_positions}")
    context.controller.moveJ(joint_positions, env.get_speed(), env.get_acceleration())
    time.sleep(0.5)

@given("god is not real")
def step_impl(context):
    """
    Args:
        context (behave.runner.Context):
    """
    print(u'Not implemented yet!')
