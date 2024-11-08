import json
from array import array
from enum import Enum

from behave.model import Step, Scenario


class JsonStatus(Enum):
    FINISHED = "finished"
    RUNNING = "running"
    UNTESTED = "untested"


class JsonStep:
    def __init__(self, step: Step):
        self.text: str = step.name
        self.duration: float = step.duration
        self.failure: bool = False
        self.skipped: bool = True
        self.status: JsonStatus = JsonStatus.UNTESTED

    def dump(self) -> dict:
        return {
            "text": self.text,
            "duration": self.duration,
            "failure": self.failure,
            "skipped": self.skipped,
            "status": self.status.value
        }

    def mark_failure(self, failure: bool):
        self.failure = failure
        self.status = JsonStatus.FINISHED

    def mark_skipped(self, skipped: bool):
        self.skipped = skipped

    def update_duration(self, duration: float):
        self.duration = duration

    def mark_as_finished(self):
        self.status = JsonStatus.FINISHED

    def mark_running(self):
        self.status = JsonStatus.RUNNING


class JsonGivenStep(JsonStep):
    pass


class JsonWhenStep(JsonStep):
    pass


class JsonThenStep(JsonStep):
    pass


class JsonScenario:
    def __init__(self, scenario: Scenario, id_number: int):
        self.id_number = id_number
        self.name = scenario.name
        self.duration = scenario.duration

        self.given_steps: array[JsonGivenStep] = []
        self.when_steps: array[JsonWhenStep] = []
        self.then_steps: array[JsonThenStep] = []

        self.step_map: dict[Step, JsonStep] = {}
        self.populate_steps(scenario)

    def populate_steps(self, scenario: Scenario):
        steps: list[Step] = scenario.steps
        for step in steps:
            match str(step.step_type).lower():
                case "given":
                    json_step = JsonGivenStep(step)
                    self.given_steps.append(json_step)
                case "when":
                    json_step = JsonWhenStep(step)
                    self.when_steps.append(json_step)
                case "then":
                    json_step = JsonThenStep(step)
                    self.then_steps.append(json_step)
                case _:
                    raise ValueError(f"Unknown step keyword: {step.step_type}")
            self.step_map[step] = json_step

    def update_duration(self, duration: float):
        self.duration = duration

    def dump_to_json(self) -> dict:
        dumped_object = {
            "id": self.id_number,
            "name": self.name,
            "duration": self.duration,
            "givens": [given.dump() for given in self.given_steps],
            "whens": [when.dump() for when in self.when_steps],
            "thens": [then.dump() for then in self.then_steps]
        }
        return dumped_object

    def dump_to_json_string(self) -> str:
        return json.dumps(self.dump_to_json())

    def __str__(self):
        return self.dump_to_json()
