#define DOUT  D5
#define CLK  D6
#define SERVER_IP "192.168.100.4:4000"

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "HX711.h"  

const char* ssid = "NETLIFE-FAMILIA TORRES";
const char* password = "andres2607.";
int val = 0;
int ecotienda_id = 3;
HX711 scale(DOUT, CLK);
float calibration_factor = -109525;
 
void setup() 
{
  Serial.begin(9600);   
  inicializar_wifi();  
  Serial.println("HX711 Calibration");
  Serial.println("Remove all weight from scale");
  scale.set_scale();
  scale.tare();
  long zero_factor = scale.read_average();
  Serial.print("Zero factor: "); 
  Serial.println(zero_factor);
}
void loop() 
{
  Serial.print("Reading: ");
  Serial.print(scale.get_units(), 3);
  Serial.print(" kg"); 
  Serial.println();
  if ((WiFi.status() == WL_CONNECTED)) {

    WiFiClient client;
    HTTPClient http;

    Serial.print("[HTTP] begin...\n");
    http.begin(client, "http://" SERVER_IP "/record");
    http.addHeader("Content-Type", "application/json");
    DynamicJsonDocument doc(2048);
    doc["ecotienda"] = ecotienda_id;
    doc["peso"] = scale.get_units();
    String json;
    serializeJson(doc, json);
    Serial.print("[HTTP] POST...\n");
    int httpCode = http.POST(json);

    
    if (httpCode > 0) {
      
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.println("received payload:\n<<");
        Serial.println(payload);
        Serial.println(">>");
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }

  delay(5000);

}



void inicializar_wifi(){

    WiFi.begin(ssid, password);
    Serial.println("Conectando");
    while(WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.print("Connected to WiFi network with IP Address: ");
    Serial.println(WiFi.localIP());
}