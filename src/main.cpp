#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "secrets.h"
#include "DHT.h"

#define DHTPIN 4      // IO4 ピンからセンサーの値を得る
#define DHTTYPE DHT11 // DHT 11 を使う

WiFiClient client;
DHT dht(DHTPIN, DHTTYPE);

void setup()
{
  Serial.begin(115200);

  // WiFi に接続する

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  WiFi.printDiag(Serial);

  // DHT 初期化

  dht.begin();
}

void loop()
{
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  Serial.println("Temperature: " + String(t, 1) + "°C\tHumidity: " + String(h, 0) + "%");

  delay(2000);
}
