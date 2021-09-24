import serial
import requests
import json
import time

url = 'http://localhost:5000/record'
headers = {'content-type': 'application/json'}

with serial.Serial('/dev/cu.usbserial-110', 9600, timeout=1) as ser:       
    peso = ser.readline().decode("utf-8")
    print(peso)
    data = {
        'ecotienda': 1,
        'peso': peso
    }
    r = requests.post(url = url, data=json.dumps(data), headers=headers)
    time.sleep(5)



