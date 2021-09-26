import serial
import requests
import json
import time

url = 'http://localhost:5000/record'
headers = {'content-type': 'application/json'}

with serial.Serial('/dev/cu.usbserial-140', 9600, timeout=1) as ser: 
    # print(f'Antes de enviar comando \n{ser.readline().decode("utf-8")}')
    # ser.write(b'R')      
    peso = ser.readline().decode("utf-8")
    print(f'despues de enviar el comando {peso}')
    # data = {
    #     'ecotienda': 1,
    #     'peso': peso
    # }
    # r = requests.post(url = url, data=json.dumps(data), headers=headers)
    # time.sleep(5)


