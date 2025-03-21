import json
import os

import rtde_control
import rtde_io
import rtde_receive
from behave.model import Step

from improvements.DataStorage import update_step_duration, save_scenario, create_scenario_in_storage, mark_step_failure

# Dynamically find the path to Environment.json
current_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(current_dir, 'Environment.json')

# Check if the file exists
if not os.path.exists(json_file_path):
    raise FileNotFoundError(f"File not found: {json_file_path}")

with open(json_file_path) as f:
    data = json.load(f)


def before_all(context):
    print("Setting up Environment...")

    ip = get_robot_ip()

    # Initialize interfaces
    context.controller = rtde_control.RTDEControlInterface(ip)
    context.receiver = rtde_receive.RTDEReceiveInterface(ip)
    context.io = rtde_io.RTDEIOInterface(ip)

    # Initialize gripper
    """
    context.gripper = RobotiqGripper(context.controller)
    context.gripper.activate()
    context.gripper.set_speed(get_gripper_speed())
    context.gripper.set_force(get_gripper_force())
    """


def before_feature(context, feature):
    context.controller.moveJ(get_position("default"), get_speed(), get_acceleration())


def after_feature(context, feature):
    pass


def before_step(context, step: Step):
    pass


def after_step(context, step: Step):
    print()
    print(f"Step: {step}")
    print(f"StepStatus: {step.status}")
    # if passed run DataStorage to store the step in list
    if step.status == "passed":
        update_step_duration(step)
    elif step.status == "failed":
        mark_step_failure(step)


def before_scenario(context, scenario):
    create_scenario_in_storage(scenario)


def after_scenario(context, scenario):
    save_scenario(scenario)


# Get coordinate-location based on configured name
def get_position(name):
    locations = data["Positions"]
    coordinate = locations[name]

    return coordinate


# Get speed based naming (if not set, returns moderately)
def get_speed(identifier="moderate"):
    speed = data["Speeds"][identifier]["speed"]
    return speed


# Get acceleration based naming (if not set, returns moderately)
def get_acceleration(identifier="moderate"):
    acceleration = data["Speeds"][identifier]["acceleration"]
    return acceleration


# Get IP-address of robot based on configured name
def get_robot_ip():
    ip = data["Robot"]["IP"]
    return ip

# Get coordinate-location based
