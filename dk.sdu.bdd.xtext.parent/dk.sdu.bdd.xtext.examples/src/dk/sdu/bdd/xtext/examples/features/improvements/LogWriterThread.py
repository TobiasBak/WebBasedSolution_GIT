import os
import time
from threading import Thread

from rtde_receive import RTDEReceiveInterface

try:
    from JsonWriter import append_to_json_file, write_to_file
    from utils import get_path_to_webroot

except ImportError:
    from improvements.JsonWriter import append_to_json_file, write_to_file
    from improvements.utils import get_path_to_webroot

json_filename = "position_log.json"
json_folder = os.path.join(get_path_to_webroot(), "logs")
json_abs_path = os.path.join(json_folder, json_filename)


class LogWriterThread(Thread):
    def __init__(self, name, context_receiver: RTDEReceiveInterface | None = None):
        Thread.__init__(self, daemon=True)
        self.name = name
        self.should_run = True
        self.receiver = context_receiver

    def run(self):
        if self.receiver is None:
            raise Exception("Receiver not set")
        self.should_run = True
        while self.should_run:
            data = self.receiver.getActualQ()
            append_to_json_file(data, json_abs_path)
            time.sleep(0.1)

    def set_context_receiver(self, context_receiver: RTDEReceiveInterface):
        self.receiver = context_receiver

    def stop(self):
        self.should_run = False
