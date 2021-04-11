#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "secrets.h"
#include "DHT.h"

#define DHTPIN 4      // IO4 ピンからセンサーの値を得る
#define DHTTYPE DHT11 // DHT 11 を使う

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
DHT dht(DHTPIN, DHTTYPE);

void setupWiFi()
{
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  WiFi.printDiag(Serial);
}

void setupMQTT()
{
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
}

void reconnectMQTT()
{
  while (!mqttClient.connected())
  {
    Serial.print("Attempting MQTT connection...");

    if (mqttClient.connect("ESP8266Client"))
    {
      Serial.println("connected");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(115200);
  setupWiFi();
  setupMQTT();
  dht.begin();
}

void loop()
{
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  Serial.println("Temperature: " + String(temperature, 1) + "°C\t" +
                 "Humidity: " + String(humidity, 0) + "%");

  String data = String(temperature, 1) + "," + String(humidity, 0);

  reconnectMQTT();
  mqttClient.publish("sample_topic", data.c_str());

  delay(2000);
}
