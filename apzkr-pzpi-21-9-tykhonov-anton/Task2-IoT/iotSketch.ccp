#include <WiFi.h>
#include <WebSocketsClient.h>
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h>

const char* ssid = "Wokwi-GUEST";  // Wokwi default WiFi
const char* password = "";         // No password

#define MAC_ADDR "00-B0-D0-63-C2-26" // Corrected macro definition
#define POT_PIN 19
#define BTN_PIN 4
#define LED_PIN 26
#define BUZ_PIN 27 // Changed to a different pin for the buzzer

WebSocketsClient webSocket;
LiquidCrystal_I2C lcd(0x27, 20, 4); // Updated to 20x4 for larger display

bool isWsConnected = false;
bool isConfigReceived = false;
bool isAlert = false; // Flag to indicate if configuration has been received
DynamicJsonDocument configData(1024); // To store the received configuration

unsigned long previousMillis = 0; // Store the last time the message was sent
const long interval = 5000; // Interval at which to send the message (milliseconds)

float currentGas = 0.0; // Variable to store the current gas value

void setup() {
  Serial.begin(115200);

  pinMode(BTN_PIN, INPUT_PULLUP); // Button pin with internal pull-up resistor
  pinMode(LED_PIN, OUTPUT);       // LED pin
  pinMode(BUZ_PIN, OUTPUT);       // Buzzer pin
  pinMode(POT_PIN, INPUT);        // Potentiometer pin as input

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting to");
  lcd.setCursor(0, 1);
  lcd.print("WiFi...");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Update LCD to show WiFi connection success
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connected to");
  lcd.setCursor(0, 1);
  lcd.print("WiFi!");

  // Connect to WebSocket server
  webSocket.begin("host.wokwi.internal", 8080, "/ws");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); // Automatically try to reconnect every 5 seconds
}

void loop() {
  webSocket.loop(); // Handle WebSocket communication

  int buttonState = digitalRead(BTN_PIN);

  if (buttonState == LOW) { // Button pressed (assuming active-low button)
    sendEmergencyAlert();
    isAlert = true;
  } else {
    isAlert = false;
  }

  if (isAlert) {
    tone(BUZ_PIN, 2960);
    digitalWrite(LED_PIN, HIGH);   // Turn LED on
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("ALERT!");
  } else {
    noTone(BUZ_PIN);
    digitalWrite(LED_PIN, LOW);    // Turn LED off
    lcd.clear();
  }

  // Read the potentiometer value and map it to the range for gas level
  int potValue = analogRead(POT_PIN);
  currentGas = map(potValue, 0, 4095, 0, 100); // Map the potentiometer value (0-100)
  Serial.println(currentGas);

  // Check if currentGas exceeds gasLimit and send an alert if so
  if (isConfigReceived && currentGas >= configData["gasLimit"].as<float>()) {
      Serial.println(configData["gasLimit"]);
    sendEmergencyAlert(); // Send emergency alert immediately if gas level is too high
  }

  // Regular interval-based check
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    sendEmergencyAlert(); // Send emergency alert at regular intervals
  }
}

// Request configuration values using the MAC address
void requestConfigurationValues() {
  if (isWsConnected) {
    DynamicJsonDocument jsonDoc(1024); // Create a JSON document
    jsonDoc["type"] = "init"; // Initialization message type
    jsonDoc["MACADDR"] = MAC_ADDR; // Add MAC address to JSON document

    String request;
    serializeJson(jsonDoc, request); // Serialize JSON document to String

    webSocket.sendTXT(request); // Send the request over WebSocket
  }
}

// Send an emergency alert with the data received during initialization
void sendEmergencyAlert() {
  if (isConfigReceived && isWsConnected) {
    DynamicJsonDocument jsonDoc(1024); // Create a JSON document
    jsonDoc["type"] = "emergency_alert"; // Emergency alert message type
    jsonDoc["MACADDR"] = MAC_ADDR; // Add MAC address to JSON document
    jsonDoc["gasLimit"] = configData["gasLimit"];
    jsonDoc["defaultZoneRadius"] = configData["defaultZoneRaduis"]; // Fix typo in the key name
    jsonDoc["longitude"] = configData["longitude"];
    jsonDoc["latitude"] = configData["latitude"];
    jsonDoc["currentGas"] = currentGas; // Include the current gas value

    String alertMessage;
    serializeJson(jsonDoc, alertMessage); // Serialize JSON document to String

    webSocket.sendTXT(alertMessage); // Send the emergency alert
  }
}

// Handle WebSocket events
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected");
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("WebSocket");
      lcd.setCursor(0, 1);
      lcd.print("Disconnected");
      isWsConnected = false;
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket Connected");
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("WebSocket");
      lcd.setCursor(0, 1);
      lcd.print("Connected");
      isWsConnected = true;

      // Request initial configuration values after connection
      requestConfigurationValues();
      break;
    case WStype_TEXT:
      Serial.printf("Received: %s\n", payload);

      // Parse the received JSON message
      DynamicJsonDocument jsonDoc(1024);
      DeserializationError error = deserializeJson(jsonDoc, payload);

      if (error) {
        Serial.print("JSON parse error: ");
        Serial.println(error.c_str());
        return;
      }

      // Check and handle specific fields in the received JSON
      if (jsonDoc.containsKey("gasLimit")) {
        configData["gasLimit"] = jsonDoc["gasLimit"];
      }

      if (jsonDoc.containsKey("defaultZoneRaduis")) {
        configData["defaultZoneRaduis"] = jsonDoc["defaultZoneRaduis"];
      }

      if (jsonDoc.containsKey("longitude")) {
        configData["longitude"] = jsonDoc["longitude"];
      }

      if (jsonDoc.containsKey("latitude")) {
        configData["latitude"] = jsonDoc["latitude"];
      }

      // Mark configuration as received
      isConfigReceived = true;

      break;
  }
}
