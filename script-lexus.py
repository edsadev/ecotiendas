import serial
import requests
import json
import time

url = 'http://192.168.36.224:5000/record'
headers = {'content-type': 'application/json'}
puerto = '/dev/cu.usbserial-1240'
baud_rate = 1200
while True:

    with serial.Serial(puerto, baud_rate, timeout=1) as ser:
        peso = ser.readline().decode('latin-1').split(' ')
        if len(peso) > 5:
            print(peso[4])
            data = {
                'ecotienda': 4,
                'peso': peso[4]
            }
            print(data)
            r = requests.post(url = url, data=json.dumps(data), headers=headers)
            
            



