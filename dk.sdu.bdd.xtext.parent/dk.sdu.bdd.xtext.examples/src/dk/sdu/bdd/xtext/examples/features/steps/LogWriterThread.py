import time
from threading import Thread

from rtde_receive import RTDEReceiveInterface


class LogWriterThread(Thread):
    def __init__(self, name, context_receiver: RTDEReceiveInterface):
        Thread.__init__(self, daemon=True)
        self.name = name
        self.should_run = True
        self.receiver = context_receiver

    def run(self):
        while self.should_run:
            print('running ' + self.name + f" position: {self.receiver.getActualTCPPose()[0:3]}")
            time.sleep(0.1)

    def stop(self):
        self.should_run = False
