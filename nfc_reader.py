import time
import serial
import threading

exitFlag = 0

class NFCReader (threading.Thread):
       
        def __init__(self):
                self.ser = serial.Serial(
                        port='/dev/ttyS0',
                        baudrate = 19200,
                        parity=serial.PARITY_NONE,
                        stopbits=serial.STOPBITS_ONE,
                        bytesize=serial.EIGHTBITS,
                        timeout=0.5
                )
                self.lastTag = 0
                threading.Thread.__init__(self)

        def parse(self, binary):
                return sum(ord(b) << 8*n for (n, b) in enumerate(reversed(binary)))

        def getLastTag(self):
                return self.lastTag

        def run(self):
                print "starting run"
                while 1:
                        if exitFlag:
                                self.name.exit()
                        x = self.ser.read(6)
                        self.ser.flush()
                        tagid = self.parse(x)
                        if tagid is not 0:
                                self.lastTag = tagid


