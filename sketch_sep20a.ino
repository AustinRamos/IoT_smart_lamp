// GROUP: Austin Ramos and Novi Wang

#include <SimbleeBLE.h>
int red = 0;
int blue = 0;
int green = 0;
int buttonA = 0;
int buttonB = 0;
boolean TimerStart = false;
boolean isOn = false;
int hours = 0;
  int minutes = 0;
    int seconds = 0;
    int end_time = 0;
    int start = 0;

    int discoFadeIncr = 0;
      int reddisc = 10;
  int bluedisc = 10;
  int greendisc = 10;
  int reddisco2=255;
  int bluedisco2=0;
  int greendisco2=0;
 
boolean offTimerStart = false;
int hours2 = 0;
int minutes2 = 0; 
int seconds2 =0;
      int end_time2 = 0;
    int start2 = 0;
//fade vars
boolean fadeStart = false;
int fadeduration = 0;
int start3 = 0;
int end_time3 = 0;

boolean discoMode1 = false;
boolean discoMode2 = false;
boolean discoMode3 = false;
boolean fadeDiscoMode = false;
    
char* outData;
void setup() {

    
  // TODO: Change the "ledbtn" string to a unique 2-5 letter code for your group 
  SimbleeBLE.advertisementData = "wwwww";
  Serial.begin(9600);
  pinMode(3, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, INPUT);
  pinMode(6, INPUT);
  // start the BLE stack
  SimbleeBLE.begin();
}

void loop() {
  //Start of group code, checks if button has been pressed and if so send a packet with the button tag (0x01)
  
  //PART 6 MANUAL on/off
  int temp1 = digitalRead(5);//buttonA
  if (buttonA != temp1) {  //Checks to see if the button has changed, so we don't continuously send packets when pressed
    buttonA = temp1;
    if (buttonA == 1) { //Only sends on press, not release
    //  analogWrite(2,200);// simple red light (color not specified_
    //  updateonoff(1); // SENDS a 1 so we know it is right
 
      outData = new char[3];
       outData[0] = 0xFF;
      outData[1] = 0xFF;
      outData[2] = 0xFF;
      SimbleeBLE.send(outData, 3);
red = 0xFF;
blue= 0xFF;
green = 0xFF;
writeLEDs();
    }
  }
   int temp2 = digitalRead(6); //buttonB
  if (buttonB != temp2) {  //Checks to see if the button has changed, so we don't continuously send packets when pressed
    buttonB = temp2;
    if (buttonB == 1) { //Only sends on press, not release
      analogWrite(2,000);// turning red light off 
      analogWrite(3,000);
      analogWrite(4,000);
      red = 0x00;
       green = 0x00;
        blue = 0x00;
      updateonoff(0); // SENDS off if when off button pressed. PART 5
    }
  }
//on timer loop, simple delta time
if(TimerStart == true){
  
  if(millis()>=end_time){

     
Serial.println("   time done");
   
       writeLEDs();
    TimerStart = false;      
  }

  }

//offTimer loop, simple delta time

if(offTimerStart == true){
  
  if(millis()>=end_time2){
   analogWrite(2, 0);
  
  
     analogWrite(3, 0);
  
 
     analogWrite(4, 0);
     updateonoff(0);

      
 

  offTimerStart = false;
}

}

if(discoMode1){ //means discoMode has been activated
  analogWrite(2, 200);
delay(500);
    analogWrite(2, 0);
    analogWrite(3, 200);
    
delay(500);
analogWrite(3, 0);
    analogWrite(4, 200);
      delay(500);
      analogWrite(4, 0);
  }
 if(discoMode2){
  if(bluedisco2==255){
    bluedisco2=0;
  }
    if(greendisco2==255){
      greendisco2=0;
    }
      if(reddisco2==0){
        reddisco2=255;
      }
      
        reddisco2-=17;
        analogWrite(2, reddisco2);
     
     bluedisco2 +=17;
        analogWrite(3, greendisco2); 
  
    greendisco2+=17;
       analogWrite(4, greendisco2); 
      
    
  
 
 
   
delay(150);
  



  
 }

if(fadeDiscoMode){ 

  if(reddisc>=255){ //resetting to 0 if go out of bounds (255)
    reddisc = 10;
    }
     if(bluedisc>=255){
    bluedisc = 10;
    }
     if(greendisc>=255){
    greendisc = 10;
    }
      analogWrite(2, reddisc); //turns just red on
  delay(100);
    analogWrite(2, 0);
    analogWrite(3, bluedisc);
    
 delay(200);
analogWrite(3, 0);
    analogWrite(4, greendisc);
 delay(300);
      analogWrite(4, 0);
      
  reddisc += discoFadeIncr;
   bluedisc += discoFadeIncr;
    greendisc += discoFadeIncr;
  
  }
  
}

void SimbleeBLE_onReceive(char data[], int len) {
  //If statement for 0x01 through 0x05 and the default case written as a group.
  if (len < 8) {
    if (data[0] == 0x01 && len >= 2) {
       red = data[1];
       writeLEDs();
    } else if (data[0] == 0x02 && len >=2) {
       blue = data[1];
       writeLEDs();
    } else if (data[0] == 0x03 && len >=2) {
       green = data[1];
       writeLEDs();
    } else if (data[0] == 0x04 && len >= 4) {
       red = data[1];
       green = data[2];
       blue = data[3]; 
       writeLEDs();

        //tag 5: should return 6 byte value, 2 bytes for each color.
    } else if (data[0] == 0x05){
      outData = new char[4];
      outData[0] = 0x05;
      outData[1] = red;
      outData[2] = green;
      outData[3] = blue;
      SimbleeBLE.send(outData, 4);
      
    } 
    //TAG 6 returns 1 if on, 0 if off
    else if (data[0] == 0x06){

     SimbleeBLE.send(isOn);
     if(isOn){
     Serial.println("Light is on");
  
     }
     if(!isOn){
     Serial.println("Light is off");
      
     }
      }
      //tag 7: should be a otimer. 6 byte value, 2 bytes for each color.
 else if (data[0] == 0x07){

  //using second tag for timer. for example
  //0x0701HHMMSS will "set the on-timer"
  //0x0702RGGBB will start the on timer
  //0x0703 will get the time left on the timer
  //recieving 2 bytes for hour, 2 for min 2 bytes for seconds.
 


//**** so write now it is saving the min and secs as hex values, which I suspect is messing up the 
//3rd bit when they are all options. try converting to decimal first.
  if(data[1] == 01){ //first subtag -> sets time
     //0x0701HHMMSS sets timer, HH - hours, MM= mins, SS = secs
    //set the timer.
    hours = data[2];
   
 minutes = data[3];
 //minutes and hours working. not sending
   seconds = data[4];

    Serial.print(" hours: ");
      Serial.print(hours);
       Serial.print("      minutes: ");
      Serial.print(minutes);
       Serial.print("      seconds: ");
      Serial.print(seconds);
    }
if(data[1] == 02){
  //0x0702RRGGBB starts timer where RRGGBB represents
  //each bit of the 6 bit RGB value
 red = data[2];
       green = data[3];
       blue = data[4]; 


//use millis()


//delta time;
 start = millis();

 end_time = start + ((3600*hours +60*minutes+ seconds)*1000);
 TimerStart = true;
  Serial.print("Timer Starting!");
 
  }
  if(data[1] == 03){
    //0x0703 will get time on ontimer
    if(TimerStart == false){
    Serial.println("    Timer not currently running.");
    
    }
      if(TimerStart == true){
   
    
 Serial.println("    Time remaining (in ms): ");
  Serial.print(end_time- millis());
  SimbleeBLE.send(end_time- millis()); //notification to the phon
      }
 }
 }
  else if (data[0] == 0x08){ //off timer
  //almost copying code from above exactly

   if(data[1] == 01){ //first subtag -> sets time
    //set the timer.
    //0x0801HHMMSS sets timer, HH - hours, MM= mins, SS = secs
    hours2 = data[2];
   
 minutes2 = data[3];
 //minutes and hours working. not sending
   seconds2 = data[4];

    Serial.print(" hours: ");
      Serial.print(hours2);
       Serial.print("      minutes: ");
      Serial.print(minutes2);
       Serial.print("      seconds: ");
      Serial.print(seconds2);
    }
if(data[1] == 02){
  // 0x0802 starts timer

//use millis()
//delta time;
 start2 = millis();
//below gets total time in seconds
 end_time2 = start2 + ((3600*hours2 +60*minutes2+ seconds2)*1000);
 offTimerStart = true;
  Serial.print("    Off Timer Starting!");
 
  }
  if(data[1] == 03){
    //0x0903 will return time left on offTimer and send it to phone and
    //serial monitor
    if(offTimerStart == false){
    Serial.println("   Off Timer not currently running.");
    
    }
      if(offTimerStart == true){
   
    
 Serial.print("Time remaining (in ms): ");
  Serial.println(end_time2- millis());
 // SimbleeBLE.send(end_time2- millis()); //notification to the phone but doesnt make any sense...
      }
 }}



// TAG 9: for Part 7: Color fade
      else if (data[0] == 0x09){ 

   if(data[1] == 01){ //first subtag -> sets duration of fade;
    //set the timer. 
    //0x0901SS sets the fade duration, where SS is the duration in seconds
  fadeduration = data[2]; //gets fade duration only in seconds(since only 1-10 seconds.
   Serial.print("fade duration: ");
    Serial.println(fadeduration);
    SimbleeBLE.send(fadeduration);
    }
if(data[1] == 02){ //get current duration used for fades

 start3 = millis();

 end_time3 = start3 + (fadeduration)*1000;
  fadeStart = true;
  Serial.print("  fade duration: ");
  Serial.println(fadeduration); // just "getting" current duration
  SimbleeBLE.send(fadeduration); //sending it to phone.
  }
  if(data[1] == 03){ // tag 0x0903 turns fade mode on
fadeStart = true;
Serial.println("Fade Mode on");
 }
 if(data[1] == 04){  // tag 0x0903 turns fade mode off
fadeStart = false;
Serial.println("Fade Mode off");
fadeduration = 0;

 }
 }
    //TAG 10: Disco Mode
    else if (data[0] == 0x0A){


  if(data[1] == 0x01){//tag to turn regular disco mode on: 0x0A01
   
       discoMode1 = true;
      }

       if(data[1] == 0x02){// fade disco mode on 
        //user will set an increment value. every half second each RBG value will
        //increment by that much. when it hits 255, we will reset to 0 and keep going.
        //the time is also set to red is on only for 100ms, green 200ms, and blue 300ms
          fadeDiscoMode = true;

            discoFadeIncr = data[02];// gets increment value
        
        }
       if(data[1] == 0x03){
        discoMode2=true;
       }
      if(data[1] == 0x04){// Tag to urn off: 0A03
       discoMode1 = false;
       discoMode2= false;
       fadeDiscoMode = false;
      }
      
      }
       
    else {
     for (int i = 0; i < len; i++) {
       char cur = data[i];
       Serial.print(cur, HEX);
       Serial.print(" ");
     }
     Serial.println(" ");
    }}
    
  }

void writeLEDs() {
updatecolor();// updating color and sending to phone
  
  if(red==0 && green ==0 && blue ==0){
    isOn=false;
    updateonoff(0); // SENDS zeroes if off. PART 5
    }
    else{
      if(!isOn){// if it is not already on
        updateonoff(1); // SENDS one if on. PART 5
        }
      isOn=true;
       
      }
     


      
if(fadeStart){
//the fading method is a bit confusing. 
//so, it gets the max val of the three, and runs a for loop to that 
//then, it checks each iteration if the rgb val and increments  
 // when their respective values are less then the max val, sets it
 //to i (one RGB value higher than before)
int maxrgb = 0;
maxrgb = max(red, blue);
maxrgb = max(maxrgb, green);
  
 for(int i = 0; i<=maxrgb;i++){// fade to current color level of red over course of fadeduration

if(red >=maxrgb){
   analogWrite(2, i);
  }

  if(green >=maxrgb){
     analogWrite(3, i);
  }
  if(blue >=maxrgb){
     analogWrite(4, i);
  }
  

    
    delay(fadeduration*1000/(maxrgb+1));
//    delay(red/fadeduration * (double)5/13);
    if(i==maxrgb){
      Serial.println("Color has fully appeared!");
    }
      }}

      //just a regular writeled, if fade mode is not activiated
      else if (!fadeStart){
           analogWrite(2, red);       
    analogWrite(3, green);
    analogWrite(4, blue);
      
}}
//fade method. num is 2, 3, or 4 representing red green and blue;

//Part 5 status notifications. we will call this whenever we are turning it on or off
//to send  notification to phone. if you pass 0 to it it sends off notification.
//pass 1 to it for on notification.


void updateonoff(int x){
  if(x==0){
    SimbleeBLE.send(0);
    }
  if(x==1){
    SimbleeBLE.send(1);
    }
    
  }
void updatecolor(){ //will send the color each time an led color is changed
  outData = new char[3];
      
      outData[0] = red;
      outData[1] = green;
      outData[2] = blue;
      SimbleeBLE.send(outData, 3);
  
  
  
  }
  
  


