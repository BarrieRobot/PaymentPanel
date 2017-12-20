import time
import serial
import thread

def parse(binary):
	return sum(ord(b) << 8*n for (n, b) in enumerate(reversed(binary)))

ser = serial.Serial(
	port='/dev/ttyS0',
	baudrate = 19200,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=0.5
)

lastTag = 0

def getLastTag():
	return lastTag

def startScanningThread():
	thread.start_new_thread( perform_scanning, ("NFC Scanning Thread", 2, ) )

def perform_scanning():
	while 1:
		x = ser.read(6)
		ser.flush()
		tagid = parse(x)
		if tagid is not 0:
			lastTag = tagid
