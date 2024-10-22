import json
from array import array


class JsonStep:
    def __init__(self):
        self.text: str = "dummyText"
        self.duration: float = 1.1
        self.failure: bool = False
        self.skipped: bool = True

    def dump(self) -> dict:
        return {
            "text": self.text,
            "duration": self.duration,
            "failure": self.failure,
            "skipped": self.skipped
        }


class JsonGivenStep(JsonStep):
    pass


class JsonWhenStep(JsonStep):
    pass


class JsonThenStep(JsonStep):
    pass


class JsonScenario:
    def __init__(self):
        self.id_number = 1
        self.name = "dummy"
        self.duration = 0.5
        self.given_steps: array[JsonGivenStep] = []
        self.when_steps: array[JsonWhenStep] = []
        self.then_steps: array[JsonThenStep] = []

    def dump_to_json(self) -> str:
        dumped_object = {
            "id": self.id_number,
            "name": self.name,
            "duration": self.duration,
            "givens": [given.dump() for given in self.given_steps],
            "whens": [when.dump() for when in self.when_steps],
            "thens": [then.dump() for then in self.then_steps]
        }

        return json.dumps(dumped_object)

    def __str__(self):
        return self.dump_to_json()
