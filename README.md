# IoT_smart_lamp


This is an iphone application written to contain all the basic features of
a smart lamp. the UI and UI logic is written in javascript and html, and uses
Apache Cordova. Additionally, the smart lamp logic is written entirely in 
Arduino C, and uses Simblee and BLE technology to communicate with the
front end. The UI allows the user to set the light color using a standard 
3 byte RGB value. it also supports a timer for on/off functionality, 
as well as "disco" modes. the app and the smart lamp communicate in both directions,
meaning the phone can write to the smart lamp(when it sets the color or
timer), and can also read from the smart lamp(when it makes a request to see
if the lamp is on or off, what color it is currently set to, or how much
time is remaining on the timer).
