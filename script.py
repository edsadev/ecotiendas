import serial
import requests
import json
import time

url = 'http://localhost:5000/record'
headers = {'content-type': 'application/json'}
pesos = []
contador = 0
while true:

    with serial.Serial('/dev/cu.usbserial-1240', 9600, timeout=1) as ser:
        peso = ser.readline().decode("utf-8").split(' ')[4].strip()
        if peso in pesos and int(peso) != 0:
            contador +=1
        else:
            pesos.append(peso)
        
        if contador >= 200:

            data = {
                'ecotienda': 1,
                'peso': peso
            }
            r = requests.post(url = url, data=json.dumps(data), headers=headers)
            contador = 0
            pesos = []



