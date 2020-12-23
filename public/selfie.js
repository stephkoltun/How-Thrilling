/*
Stephanie Koltun
Accumulation of Movement
*/



var mode = 1;
// 1 = selfie 
// 2 = mj

// Declare kinectron
var kinectron = null;

var thrillerVid;
var playing = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    frameRate(30);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron(IP);

    // Connect with application over peer
    kinectron.makeConnection();

    // Set individual frame callbacks for KINECT 1
    kinectron.setColorCallback(performCallback);
    kinectron.setBodiesCallback(bodyCallback);
    //kinectron.startMultiFrame(["body", "color"]);

    // Create video
    thrillerVid = createVideo('thriller.mp4');
    thrillerVid.style("visibility", "hidden");

    background(0);

}

function bodyCallback(body) {

}

function performCallback(img) {
    if (mode == 1) {
        var mapheight = (540 / 960) * windowWidth;

        loadImage(img.src, function(loadedImage) {
            image(loadedImage, 0, 0, windowWidth, mapheight);
        });
    }

}

var counter = 0;

function draw() {


    if (mode == 2) { // MJ


        if (!playing) {
            var vidHeight = windowWidth / 654 * 480;
            thrillerVid.style("visibility", "visible");
            thrillerVid.style("position", "absolute");
            thrillerVid.style("bottom", "0px");
            thrillerVid.style("width", windowWidth + "px");
            thrillerVid.style("height", vidHeight + "px");
            thrillerVid.loop();
            playing = true;
        }

        if (counter < 180) {
            counter++;
        } else {
            console.log("switch back to live feed");
            counter == 0;
            mode = 1;
            if (playing == true) {
                thrillerVid.style("visibility", "hidden");
                thrillerVid.pause();
                playing = false;
            }
        }
    }

    if (mode == 1) {
        if (frameCount > 9000) {
            location.reload();
        }

        if (frameCount % 1600 == 0) {
            console.log("switch to MJ");
            mode = 2;
        }
    }

}
