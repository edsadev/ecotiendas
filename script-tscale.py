import serial
import requests
import json
import time

url = 'http://localhost:5000/record'
headers = {'content-type': 'application/json'}
puerto = '/dev/cu.usbserial-1240'
baud_rate = 9600
pesos = []
contador = 0
while True:

    with serial.Serial(puerto, baud_rate, timeout=1) as ser:
        peso = ser.readline().decode("utf-8").split(' ')[4].strip()[:-2]
        print(peso)
        if peso in pesos and peso != '0.00':
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



