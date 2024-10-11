import time
from threading import Thread


class LogWriterThread(Thread):
    def __init__(self, name):
        Thread.__init__(self)
        self.name = name
        self.should_run = True

    def run(self):
        try:
            while self.should_run:
                print('running ' + self.name)
                time.sleep(0.1)

        finally:
            print('ended')

    def stop(self):
        self.should_run = False
