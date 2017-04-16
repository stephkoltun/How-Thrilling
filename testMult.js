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
    kinectron = new Kinectron(IP);
    // Connect with application over peer
    kinectron.makeConnection();
    kinectron.startTrackedBodies(bodyTracked);

}

function bodyTracked() {
    console.log("body");
}
