from msilib.schema import Feature
from behave import when, given, then
import time
import environment as env
import os


@then('the position {prep} the robot "{identifier}" is "{position}"')
@given('the position {prep} the robot "{identifier}" is "{position}"')
def step_given(context, identifier : str, position, prep):

    joint_positions = env.get_position(position)
    if(context.receiver.getActualQ() != joint_positions):
        context.controller.moveJ(joint_positions, env.get_speed(), env.get_acceleration())


@when('the robot "{identifier}" moves to position "{position}"')
def step_when(context, identifier : str, position):

    joint_position = env.get_position(position)
    controller = context.controller
    
    controller.moveJ(joint_position, env.get_speed(), env.get_acceleration())

