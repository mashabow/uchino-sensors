#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 4      // IO4 ピンからセンサーの値を得る
#define DHTTYPE DHT11 // DHT 11 を使う

DHT dht(DHTPIN, DHTTYPE);

void setup()
{
  Serial.begin(115200);
  dht.begin();
}

void loop()
{
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  Serial.println("Temperature: " + String(t, 1) + "°C\tHumidity: " + String(h, 0) + "%");

  delay(2000);
}
