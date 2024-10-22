# Data model:
# [
#   {
#     id: int,
#     name: str,
#     duration: float,
#     givens: [
#       {
#         text: str,
#         duration: float,
#         failure: bool,
#         skipped: bool
#       },
#       {
#         ...
#       }
#     ],
#     whens: [
#       {
#         text: str,
#         duration: float,
#         failure: bool,
#         skipped: bool
#       },
#       {
#         ...
#       }
#     ],
#     thens: [
#       {
#         text: str,
#         duration: float,
#         failure: bool,
#         skipped: bool
#       },
#       {
#         ...
#       }
#     ]
#   },
#   {
#     ...
#   },
#   ...
# ]
import json
from array import array


class AckResponse:
    def __init__(self, id: int, command: str, message: str):
        self.type = MessageType.Ack_response
        self.data: AckResponseData = AckResponseData(id, Status.parse(message), command, message)

    def __str__(self):
        return json.dumps({
            "type": self.type.name,
            "data": {
                "id": self.data.id,
                "status": self.data.status.name,
                "command": self.data.command,
                "message": self.data.message
            }
        })


class Step:
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


class GivenStep(Step):
    pass


class WhenStep(Step):
    pass


class ThenStep(Step):
    pass


class Scenario:
    def __init__(self):
        self.id_number = 1
        self.name = "dummy"
        self.duration = 0.5
        self.given_steps: array[GivenStep] = []
        self.when_steps: array[WhenStep] = []
        self.then_steps: array[ThenStep] = []

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

