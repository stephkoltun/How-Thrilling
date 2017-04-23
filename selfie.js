/*
Stephanie Koltun
Accumulation of Movement
*/

var mode = 1;
// 1 = selfie 
// 2 = mj

// Declare kinectron
var kinectron = null;

var IP = "172.16.226.69";

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
        fill(0);
        noStroke(0);
        rect(0, 0, windowWidth, windowHeight);

        loadImage(img.src, function(loadedImage) {
            image(loadedImage, 0, 0, windowWidth, mapheight);
        });
    }

}

function draw() {
    if (frameCount % 10 == 0) {
        // check if mode should change 
        $.ajax({
            url: "http://sk6385.itp.io:1234/check",
            dataType: 'json',
            success: function(data) {
                // do nothing

                if (data.exposed) {
                    // change to mj
                    mode = 2;
                } else {
                    // change to selfie
                    mode = 1;
                    if (playing == true) {
                        thrillerVid.style("visibility", "hidden");
                        thrillerVid.pause();
                        playing = false;
                    }
                }
            },
            error: function() {

            },
        });
    }

    if (mode == 2) { // MJ
        if (!playing) {
            var vidHeight = windowWidth / 654 * 480;
            thrillerVid.style("visibility", "visible");
            thrillerVid.style("position", "absolute");
            thrillerVid.style("top", "0");
            thrillerVid.style("width", windowWidth + "px");
            thrillerVid.style("height", vidHeight + "px");
            thrillerVid.loop();
            playing = true;
        }
    }
}
