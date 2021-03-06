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

/* deep sleep して終了。wake 時には setup から始まる */
void deepSleep()
{
  const int intervalMinutes = 10;
  ESP.deepSleep(intervalMinutes * 60 * 1000 * 1000, WAKE_RF_DEFAULT);
  delay(1000); // deep sleep が始まるまで待つ
}

void setupWiFi()
{
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting WiFi...");
  int retryCount = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    if (retryCount++ > 40)
      deepSleep();
    delay(500);
  }
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}

void setupMQTT()
{
  wifiClient.setTrustAnchors(&rootCA);
  wifiClient.setClientRSACert(&certificate, &privateKey);

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  Serial.println("Connecting MQTT...");
  int retryCount = 0;
  while (!mqttClient.connect(THING_NAME))
  {
    Serial.println("Failed, state=" + String(mqttClient.state()));
    if (retryCount++ > 3)
      deepSleep();
    Serial.println("Try again in 5 seconds");
    delay(5000);
  }
  Serial.println("Connected.");
}

String measure()
{
  dht.begin();

  const float temperature = dht.readTemperature();
  const float humidity = dht.readHumidity();

  Serial.println("Temperature: " + String(temperature, 1) + "°C\t" +
                 "Humidity: " + String(humidity, 0) + "%");

  JSONVar data;
  data["temperature"] = round(temperature * 10) / 10.0;
  data["humidity"] = humidity;

  return JSON.stringify(data);
}

void setup()
{
  Serial.begin(74880);
  configTzTime("JST-9", "ntp.nict.jp", "ntp.jst.mfeed.ad.jp");

  setupWiFi();
  setupMQTT();

  String topic = String("data/") + THING_NAME;
  String payload = measure();
  mqttClient.publish(topic.c_str(), payload.c_str());

  deepSleep();
}

void loop() {}
