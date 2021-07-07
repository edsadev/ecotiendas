#define SERVER_IP "192.168.100.119:5000"

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "NETLIFE";
const char* password = "123456789";
int val = 0;
int ecotienda_id = 1:
 
void setup() 
{
  Serial.begin(9600);   
  inicializar_wifi();  
}
void loop() 
{

  if ((WiFi.status() == WL_CONNECTED)) {

    WiFiClient client;
    HTTPClient http;

    Serial.print("[HTTP] begin...\n");
    // configure traged server and url
    http.begin(client, "http://" SERVER_IP "/record"); //HTTP
    http.addHeader("Content-Type", "application/json");
    DynamicJsonDocument doc(2048);
    doc["ecotienda"] = ecotienda_id;
    doc["peso"] = analogRead(A0);
    String json;
    serializeJson(doc, json);
    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
    int httpCode = http.POST(json);

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
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

  delay(5000)

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