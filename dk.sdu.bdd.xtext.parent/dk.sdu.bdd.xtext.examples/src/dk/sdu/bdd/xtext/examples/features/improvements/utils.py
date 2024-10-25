import os


def soft_position_comparison(actual_position, desired_position, sensitivity: float = 0.01) -> bool:
    for i in range(len(actual_position)):
        if check_in_range_sensitivity(actual_position[i], desired_position[i], sensitivity):
            return True
    return False


def check_in_range_sensitivity(actual_pos: float, desired_pos: float, sensitivity: float):
    return not abs(actual_pos - desired_pos) <= sensitivity


def get_path_to_webroot() -> str:
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir)
    # find parent directory
    for i in range(15):
        if path.endswith("dk.sdu.bdd.xtext.parent"):
            return os.path.join(path, "dk.sdu.bdd.xtext.web", "WebRoot")
        else:
            path = os.path.dirname(path)
    raise Exception("Folder structure too deep, could not find parent folder. Final path: " + path)
