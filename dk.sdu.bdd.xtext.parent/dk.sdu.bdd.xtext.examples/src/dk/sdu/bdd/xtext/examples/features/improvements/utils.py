def soft_position_comparison(actual_position, desired_position, sensitivity: float = 0.01) -> bool:
    for i in range(len(actual_position)):
        if check_in_range_sensitivity(actual_position[i], desired_position[i], sensitivity):
            return True
    return False


def check_in_range_sensitivity(actual_pos: float, desired_pos: float, sensitivity: float):
    return not abs(actual_pos - desired_pos) <= sensitivity
