#include <Arduino.h>
#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "secrets.h"
#include "DHT.h"

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);
DHT dht(4, DHT11); // IO4 ピンからセンサーの値を得る

const BearSSL::X509List rootCA(ROOT_CA);
const BearSSL::X509List certificate(CERTIFICATE);
const BearSSL::PrivateKey privateKey(PRIVATE_KEY);

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
}

void setupMQTT()
{
  wifiClient.setTrustAnchors(&rootCA);
  wifiClient.setClientRSACert(&certificate, &privateKey);

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
}

void reconnectMQTT()
{
  while (!mqttClient.connected())
  {
    Serial.print("Attempting MQTT connection... ");

    if (mqttClient.connect(THING_NAME))
    {
      Serial.println("connected");
    }
    else
    {
      Serial.print("failed, state=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(115200);
  configTzTime("JST-9", "ntp.nict.jp", "ntp.jst.mfeed.ad.jp");

  setupWiFi();
  setupMQTT();
  dht.begin();
}

void loop()
{
  const float temperature = dht.readTemperature();
  const float humidity = dht.readHumidity();

  Serial.println("Temperature: " + String(temperature, 1) + "°C\t" +
                 "Humidity: " + String(humidity, 0) + "%");

  JSONVar payload;
  payload["temperature"] = round(temperature * 10) / 10.0;
  payload["humidity"] = humidity;

  reconnectMQTT();
  String topic = String("data/") + THING_NAME;
  mqttClient.publish(topic.c_str(), JSON.stringify(payload).c_str());

  const int intervalMinute = 10;
  ESP.deepSleep(intervalMinute * 60 * 1000 * 1000, WAKE_RF_DEFAULT);
  delay(1000); // deep sleep が始まるまで待つ
}
