from threading import Thread


class LogWriterThread(Thread):
    def __init__(self, name):
        Thread.__init__(self)
        self.name = name
        self.run = True

    def run(self):
        try:
            while self.run:
                print('running ' + self.name)
        finally:
            print('ended')

    def stop(self):
        self.run = False
