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
        data = ser.readline().decode('latin-1').split(' ')
        if len(data) > 4:
            peso = data[4].strip()
            if 'kg' in peso:
                peso = peso[:-2]

            request = {
                'ecotienda': 1,
                'peso': peso
            }
            print(request)
            r = requests.post(url = url, data=json.dumps(request), headers=headers)
            time.sleep(3)
            



