console.log("sketch started");



// Declare kinectron
var kinectron = null;

var kinectron2 = null;

var IP = "172.30.13.97";


function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(IP);

    // KINECTRON SETUP
    // Define and create an instance of kinectron

    kinectron2 = new Kinectron(IP);



    kinectron2.makeConnection();
    //Request all tracked bodies and pass data to your callback
    kinectron2.startMultiFrame(["color"], multiFrameCallback);


    // // Set individual frame callbacks
    // kinectron.setColorCallback(rgbCallback);
    // kinectron.setBodiesCallback(bodyCallback);
    // kinectron.startMultiFrame(["color", "body"]);
}



function multiFrameCallback() {
    console.log("hello");
}