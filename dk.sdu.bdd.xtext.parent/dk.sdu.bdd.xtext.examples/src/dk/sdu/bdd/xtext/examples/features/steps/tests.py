import time

import environment as env
from behave import when, given, then

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
    print(context.scenario.name)
    print(context.scenario.steps)
    print(context.scenario.steps)


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
