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
    desired_pos = env.get_position(position)
    joint_positions = context.receiver.getActualQ()

    if joint_positions != desired_pos or True:
        context.controller.moveJ(desired_pos, env.get_speed(), env.get_acceleration())


def soft_position_comparison(actual_position, desired_position, sensitivity: float = 0.01) -> bool:
    for i in range(len(actual_position)):
        if not check_in_range_sensitivity(actual_position[i], desired_position[i], sensitivity):
            return False
    return True


def check_in_range_sensitivity(actual_pos: float, desired_pos: float, sensitivity: float):
    return not abs(actual_pos - desired_pos) <= sensitivity


@when('the robot "{identifier}" moves to position "{position}"')
def step_when(context, identifier: str, position):
    joint_position = env.get_position(position)
    controller = context.controller

    controller.moveJ(joint_position, env.get_speed(), env.get_acceleration())


@then('the position {prep} the robot "{identifier}" is "{position}"')
def step_then(context, identifier: str, position, prep):
    desired_position = env.get_position(position)
    actual_position = context.receiver.getActualQ()

    if not soft_position_comparison(actual_position, desired_position):
        raise Exception(f"Position is not as expected. Actual: {actual_position}, Desired: {desired_position}")


@given("god {prep}")
def step_given(context, prep):
    pass
