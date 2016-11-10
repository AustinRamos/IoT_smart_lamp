

// Heavily based on Bluetooth Low Energy Lock (c) 2014-2015 Don Coleman
// See: https://github.com/MakeBluetooth/ble-lock/blob/master/phonegap/www/js/index.js

var SERVICE_UUID = 'FE84';
var WRITE_UUID = '2d30c083-f39f-4ce6-923f-3484ea480596';
var READ_UUID = '2d30c082-f39f-4ce6-923f-3484ea480596';

//******   Utility functions (not used here yet) ******
function stringToArrayBuffer(str) {
    // assuming 8 bit bytes
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
        console.log(ret[i]);
    }
    return ret.buffer;
}
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}


//******   Actual Application Class/Logic ******

// Note:   Calls to object methods use it's variable name (i.e., app.) rather than
//         "this".  JavaScript's "this" variable doesn't follow the same scope/value
//         rules as in less dynamic languages.  (The "this" is variable dynamically
//         refers to the object that calls code rather than the object in which the "this"
//         is used.  For programmers used to other languages the behavior of "this" in
//         callbacks is often unexpected. To avoid confusion and ambiguity, "this" isn't
//         used at all here.

// Naming Conventions used here:
//   User Interface:
//     Functions that update the user interface or process user interface events start with "ui"
//   Event Handlers:
//     Any code that "responds to an event" has a name that includes the word "on" or "On".
//     Functions that begin with "bleOn" are for BLE based events.
//     Functions that begin with "uiOn" are for user interface events (buttons/touches)

// BLE Object function documentation can be found at:
// https://github.com/don/cordova-plugin-ble-central#api

var app = {

    // Initialized the app. Hide content / etc.
    initialize: function() {
        console.log("initialize");

        // Do initial screen configuration.
        // This can be done here because this file is loaded from the HTML file.
        deviceListScreen.hidden = false;
        lampControl.hidden = true;
        // Disable the refresh button until the app is completely ready
        refreshButton.disabled = true;

        // Register to be notified when the "device is ready"
        // This delays the execution of any more code until all the Cordova code is loaded.
        // (This file may be loaded before the Cordova.js file is loaded and, consequently,
        //  shouldn't use any of Cordova's features)
        // See: http://cordova.apache.org/docs/en/6.x/cordova/events/events.html#page-toc-source
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    
    //registers every time there is a change in the red slider and sends it to arduino accordingly
     redslidechange : function (){
        console.log("function");
         var red_slide = document.getElementById("red_range");
          //we are printing out the value of the red so the user is aware of what RGB value the colors are
        document.getElementById("red").innerHTML = red_slide.value;
        
         var red = document.getElementById("red_range").value;
           var data = new Uint8Array(2);
        data[0] = 0x01;
        data[1] = red;
         app.writeData(data);
        
        
    },
//registers every time there is a change in the green slider and sends it to arduino accordingly
    greenslidechange : function (){
        console.log("green function");
         var green_slide = document.getElementById("green_range");
          //we are printing out the value of the green so the user is aware of what RGB value the colors are
        document.getElementById("green").innerHTML = green_slide.value;
        
            var green = document.getElementById("green_range").value;
            //writing to the new green val each time a change is made
           var data = new Uint8Array(2);
        data[0] = 0x03;
        data[1] = green;
         app.writeData(data);
    },
     //registers every time there is a change in the blue slider and sends it to arduino accordingly
    blueslidechange : function (){
        console.log(" blue function");
         var blue_slide = document.getElementById("blue_range");
         //we are printing out the value of the blue so the user is aware of what RGB value the colors are
        document.getElementById("blue").innerHTML = blue_slide.value;
        
        var blue = document.getElementById("blue_range").value;
           var data = new Uint8Array(2);
        data[0] = 0x02;
        data[1] = blue;
         app.writeData(data);
    },
    on_Timer_Page : function(){
        //hiding the main control pannel div and showing the ontimer div
        console.log("ontimer");
        //hide the old div and show the new one
        
        //this function is simply setting up the dive for the on timer page
        document.getElementById("lampControl").hidden = true;
        document.getElementById("onTimer").hidden = false;
    },
     //this function is simply setting up the dive for the off timer page
    off_Timer_Page : function(){
        
              console.log("offtimer");
        //hide the old div and show the new one
        document.getElementById("lampControl").hidden = true;
        document.getElementById("offTimer").hidden = false;
    },
    //this function is simply to go back to the main control panel from the off timer button
    back_from_off_timer_function : function(){
        //app logic to hide timer div and go back to main screen 
         document.getElementById("lampControl").hidden = false;
        document.getElementById("offTimer").hidden = true;
    },
     //this function is simply to go back to the main control panel from the on timer button
     back_from_on_timer_function : function(){
        //app logic to hide timer div and go back to main screen 
         document.getElementById("lampControl").hidden = false;
        document.getElementById("onTimer").hidden = true;
    },
    
     //this function is called when the set on timer button is pressed. 
     setontimer_function : function(){
        // we get hours, minutes, and seconds from the ontimer input page, convert them to hex values, and send them to the arduino
        var hours = document.getElementById("onHours").value;
        var minutes = document.getElementById("onMinute").value;
        var seconds = document.getElementById("onSecond").value;
        
        //convert time to string
        hex_hours = hours.toString(16);
        hex_minutes = minutes.toString(16);
        hex_seconds = seconds.toString(16);
             // console.log( "hex_seconds******")
              //console.log( hex_seconds)
              
              //we will both set the timer and start the timer when they press this button
              
              
              //sets the timer
          
         console.log("on timer setting finished");     
        //timer start
        
        var data = new Uint8Array(5);
        data[0] = 0x07;
        data[1] = 0x01;
        data[2] = hex_hours;
        data[3] = hex_minutes;
        data[4] = hex_seconds;

        app.writeData(data);
         
        //the on timer works by saving the RGB values from the previous page before it turns off the lamp to allow it to turn back on again
        //after a certain amount of time
        
        var red = document.getElementById("red_range").value;
        var blue = document.getElementById("green_range").value;
       var green = document.getElementById("blue_range").value;
       
        
        //must turn the lamp off, but save the colors
        //set the color     
             
        var data_n = new Uint8Array(5);
        data_n[0] = 0x07;
        data_n[1] = 0x02;
        data_n[2] = red;
        data_n[3] = green;
        data_n[4] = blue;
        app.uiOnLampOff();
        console.log("on timer color is ready"); 
        app.writeData(data_n); 

        
        

        
        
        
    },
    //this function works in almost an identical way to the one above, although it is simpler because
    //there is no need to save the RGB colors before turning them off
     setofftimer_function : function(){
        
        var hours = document.getElementById("offHours").value;
        var minutes = document.getElementById("offMinute").value;
        var seconds = document.getElementById("offSecond").value;
        
        //convert time to string
        hex_hours = hours.toString(16);
        hex_minutes = minutes.toString(16);
        hex_seconds = seconds.toString(16);
             // console.log( "hex_seconds******")
              //console.log( hex_seconds)
              
              //we will both set the timer and start the timer when they press this button
              
              
              //sets the timer
          
         console.log("off timer setting finished");     
        //timer start
        
        var data = new Uint8Array(5);
        data[0] = 0x08;
        data[1] = 0x01;
        data[2] = hex_hours;
        data[3] = hex_minutes;
        data[4] = hex_seconds;

        app.writeData(data);
        
        
        //must turn the lamp on, but save the colors
        
        var data_n = new Uint8Array(5);
        data_n[0] = 0x08;
        data_n[1] = 0x02;
        data_n[2] = 0x00;
        data_n[3] = 0x00;
        data_n[4] = 0x00;
        app.uiOnLampOn();
        console.log("off timer color is ready"); 
        app.writeData(data_n); 
    },

// **** Callbacks for application "lifecycle" events. These respond to significant events when the App runs ******

    // the device is ready and the app can "start"
    onDeviceReady: function() {
        // Cordova is now ready --- do remaining Cordova setup.
        console.log("onDeviceReady");

        // Button/Touch actions weren't setup in initialize()
        // because they will trigger Cordova specific actions
        refreshButton.ontouchstart = app.uiOnScan;
        refreshButton.disabled = false;
        deviceList.ontouchstart = app.uiOnConnect;
        onButton.ontouchstart = app.uiOnLampOn;
   offButton.ontouchstart = app.uiOnLampOff;
        disconnectButton.ontouchstart = app.uiOnDisconnect;
        
       //hide the divs upon loading
        document.getElementById("onTimer").hidden = true; // hide one of the divs
 
 document.getElementById("offTimer").hidden = true;
     document.getElementById("discoModediv").hidden = true;
        
        //get ranges of rgb
        
        var red_slide = document.getElementById("red_range");
    red_slide.onchange = app.redslidechange;
    
     var green_slide = document.getElementById("green_range");
    green_slide.onchange = app.greenslidechange;
    
     var blue_slide = document.getElementById("blue_range");
    blue_slide.onchange = app.blueslidechange;
    
    var ontimer = document.getElementById("ontimerbutton");
   ontimer.onclick = app.on_Timer_Page;
   
      var offtimer = document.getElementById("offtimerbutton");
   offtimer.onclick = app.off_Timer_Page;

   //buttons to go back to main page from on/off timers
  var back_from_on_timer = document.getElementById("ontimertomainpage");
 
 back_from_on_timer.onclick = app.back_from_on_timer_function;
  
    var back_from_off_timer = document.getElementById("offtimertomainpage");
   back_from_off_timer.onclick = app.back_from_off_timer_function;
   
//below are all the events for all the buttons. a lot of them are simply for showing and hiding divs, and are not worth commenting individually on.
   
   var setontimer = document.getElementById("setontimer");
   setontimer.onclick = app.setontimer_function;
   
    var setofftimer = document.getElementById("setofftimer");
    setofftimer.onclick = app.setofftimer_function;

    var setDuration = document.getElementById("setDuration");
    setDuration.onclick = app.setDuration_function;

   

    var onFade = document.getElementById("onFade");
    onFade.onclick = app.onFade_function;

    var offFade = document.getElementById("offFade");
    offFade.onclick = app.offFade_function;
   
   
   var discoMode = document.getElementById("discoMode");
   discoMode.onclick = app.go_to_disco_div;
   
   
   var back_from_disco = document.getElementById("back_from_disco");
   back_from_disco.onclick = app.back_from_disco_function;
   
   
   var disco1Mode = document.getElementById("discoMode1");
   disco1Mode.onclick = app.disco1_function;
   
   var disco_mode_off = document.getElementById("disco_mode_off");
         disco_mode_off.onclick = app.disco_mode_off_function;
         
         
         
         var disco2Mode = document.getElementById("discoMode2");
   disco2Mode.onclick  = app. disco2_function;
                   
                  app.uiOnScan();
    },
    //this method is a simple
    disco_mode_off_function:function(){
            var data = new Uint8Array(2);
         data[0] = 0x0A;
        data[1] = 0x04;
        app.writeData(data);
    },
    disco1_function:function(){
         var data = new Uint8Array(2);
    //turn on simple mode 1... refer to arduino documentation on how the tags work.
        data[0] = 0x0A;
        data[1] = 0x01;
        app.writeData(data);
        
    },
    disco2_function:function(){
        
        //this write() is necessary to set up. 3 bytes taken in.
          var data_1 = new Uint8Array(3);
          var increment = document.getElementById("disco_increment");
        data_1[0] = 0x0A;
        data_1[1] = 0x02;
        data_1[2] = increment;//increment -> SHOULD BE CONTROLLED BY USER MAKE A SMALL INPUT
        app.writeData(data_1);
//this is necessary to turn it on
         var data = new Uint8Array(2);
        data[0] = 0x0A;
        data[1] = 0x03;
        app.writeData(data);
        
    } ,
    //simply sets up the proper divs to go back to the main screen
    back_from_disco_function:function(){
         document.getElementById("lampControl").hidden = false;
    document.getElementById("discoModediv").hidden = true;
    },
//navigates the user to the disco mode div page
   go_to_disco_div: function(){
     document.getElementById("lampControl").hidden = true;
    document.getElementById("discoModediv").hidden = false;
    
   },
//sets the duration for the fade, by recieving it from the DOM
    setDuration_function:function(){
        console.log("setDuration");
        var data = new Uint8Array(3);
        var duration=document.getElementById("duration").value;
        data[0] = 0x09;
        data[1] = 0x01;
        data[2] = duration;
        console.log(duration);
        app.writeData(data);
    },

//sets up the fading when the button "Fade on" is pressed
    onFade_function:function(){
        console.log("onFade");
        var data = new Uint8Array(2);
        data[0] = 0x09;
        data[1] = 0x03;
        app.uiOnLampOn();
        app.writeData(data);
    },

    offFade_function:function(){
        console.log("offFade");
        var data = new Uint8Array(2);
        data[0] = 0x09;
        data[1] = 0x04;
        app.writeData(data);
    },

    
    


// **** Callbacks from the user interface.  These respond to UI events ****
    // TODO: Add Functions to handle the callbacks (events) on the new controls
    // (Pay close attention to the syntax of functions)

    // Start scanning (also called at startup)
    uiOnScan: function() {
        console.log("uiOnScan");

        deviceList.innerHTML = ""; // clear the list at the start of a uiOnScan
        app.uiShowProgressIndicator("Scanning for Bluetooth Devices...");

        // Start the uiOnScan and setup the "callbacks"
        ble.startScan([],
            app.bleOnDeviceDiscovered,
            function() { alert("Listing Bluetooth Devices Failed"); }
        );

        // Stop uiOnScan after 5 seconds
        setTimeout(ble.stopScan, 5000, app.bleOnScanComplete);
    },

    // An item has been selected, TRY to connect
    uiOnConnect: function (e) {
        console.log("uiOnConnect");
        // Stop scanning
        ble.stopScan();

        // Retrieve the device ID from the HTML element.
        var device = e.target.dataset.deviceId;
        // Request the connection
        ble.connect(device, app.bleOnConnect, app.bleOnDisconnect);

        // Show the status
        app.uiShowProgressIndicator("Requesting connection to " + device);
    },

    // The user has hit the Disconnect button
    uiOnDisconnect: function (e) {
        console.log("uiOnDisconnect");
        if (e) {
            e.preventDefault();
        }

        app.uiSetStatus("Disconnecting...");
        ble.disconnect(app.connectedPeripheral.id, function() {
            app.uiSetStatus("Disconnected");
            setTimeout(app.uiOnScan, 800);
        });
    },

    uiOnLampOn: function() {
        console.log("uiOnLampOn");
        var data = new Uint8Array(4);
       var red = document.getElementById("red_range").value;
        var blue = document.getElementById("green_range").value;
       var green = document.getElementById("blue_range").value;
         
        data[0] = 0x04;
        data[1] = red;
          data[3] = green;
            data[2] = blue;
        
        
        app.writeData(data);
    },

    uiOnLampOff: function() {
        console.log("uiOnLampOff");
        var data = new Uint8Array(4);
        data[0] = 0x04;
        data[1] = 0x00;
         data[2] = 0x00;
          data[3] = 0x00;
        app.writeData(data);
    },



// **** Callbacks from the "ble" Object: These respond to BLE events
    bleOnDeviceDiscovered: function(device) {
        console.log("bleOnDeviceDiscovered");

        // Show the list of devices (if it isn't already shown)
        app.uiShowDeviceListScreen();

        console.log(JSON.stringify(device));

        // Add an item to the list

        // 1. Build the HTML element
        var listItem = document.createElement('li');  // Start list item (li)
        // Add a custom piece of data to the HTML item (so if the HTML item is selected it will
        // be possible to retrieve the device ID).
        listItem.dataset.deviceId = device.id;
        var rssi = "";
        if (device.rssi) {
            rssi = "RSSI: " + device.rssi + "<br/>";
        }
        listItem.innerHTML = device.name + "<br/>" + rssi + device.id;
        // 2. Add it to the list
        deviceList.appendChild(listItem);

        // Update the status
        var deviceListLength = deviceList.getElementsByTagName('li').length;
        app.uiSetStatus("Found " + deviceListLength +
                      " device" + (deviceListLength === 1 ? "." : "s."));
    },

    bleOnScanComplete: function() {
        console.log("bleOnScanComplete");
        var deviceListLength = deviceList.getElementsByTagName('li').length;
        if (deviceListLength === 0) {
            app.uiShowDeviceListScreen();
            app.uiSetStatus("No Bluetooth Peripherals Discovered.");
        }
    },

    // At the completion of a successful connection
    bleOnConnect: function(peripheral) {
        console.log("bleOnConnect");
        // Save the peripheral object for later use
        app.connectedPeripheral = peripheral;
        app.uiShowControlScreen();
        app.uiSetStatus("Connected");
        // TODO: When connected you can start notifications

    },
    // TODO: Create a function to call everytime the notification is "successful"


    bleOnDisconnect: function(reason) {
        console.log("bleOnDisconnect");
        if (!reason) {
            reason = "Connection Lost";
        }
        app.uiHideProgressIndicator();
        app.uiShowDeviceListScreen();
        app.uiSetStatus(reason);
    },

// ***** Functions that update the user interfaces
    uiShowProgressIndicator: function(message) {
        if (!message) { message = "Processing"; }
        progress.firstElementChild.innerHTML = message;
        progress.hidden = false;
        statusDiv.innerHTML = "";
    },

    uiHideProgressIndicator: function() {
        progress.hidden = true;
    },

    uiShowDeviceListScreen: function() {
        lampControl.hidden = true;
        deviceListScreen.hidden = false;
        app.uiHideProgressIndicator();
        statusDiv.innerHTML = "";
    },

    uiShowControlScreen: function() {
        lampControl.hidden = false;
        deviceListScreen.hidden = true;
        app.uiHideProgressIndicator();
        statusDiv.innerHTML = "";
    },

    uiSetStatus: function(message){
        console.log(message);
        statusDiv.innerHTML = message;
    },

// Utility function for writing data
    writeData: function(data) {
        console.log("Write");
        var success = function() {
            console.log("Write success");
        };

        var failure = function() {
            alert("Failed writing data");
        };
        ble.writeWithoutResponse(app.connectedPeripheral.id, SERVICE_UUID, WRITE_UUID, data.buffer, success, failure);
        
    }
};

// When this code is loaded the app.initialize() function is called
// to start setting up the application logic.
app.initialize();