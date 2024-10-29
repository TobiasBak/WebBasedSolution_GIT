import json


def append_to_json_file(data: dict, filename: str = "scenario_log.json") -> None:
    """
    This function will read the contents of the json file
    and append the provided data to an array as the top level object.
    If the top-level data in the file is not an array,
    it will be wrapped in an array with the new data as the second entry.
    """
    try:
        with open(filename, "r") as file:
            file_content = file.read()
            if file_content:
                existing_content = json.loads(file_content)
            else:
                existing_content = []
    except FileNotFoundError:
        existing_content = []

    if not isinstance(existing_content, list):
        new_data = [
            existing_content,
            data
        ]
    else:
        new_data = existing_content
        new_data.append(data)

    with (open(filename, "w") as file):
        serialized = json.dumps(new_data)
        file.write(serialized)


def write_to_file(strin: str, filename: str = "someDooDoo.csv", overwrite: bool = False) -> None:
    """
    Writes a string to a file. If the file does not exist, it will be created.

    Args:
        strin: The string to write into the file
        filename: The filename to write to (Including path if not relative)
        overwrite: Whether to overwrite the file (True) or append to it (False)

    """
    write_mode = "w" if overwrite else "a"

    with open(filename, write_mode) as file:
        file.write(strin + "\n")


def write_to_log(strin: str, scenario_name: str, scenario_step: str) -> None:
    write_to_file(f"{strin},{scenario_name},{scenario_step}", "DooDooLogs.csv")
