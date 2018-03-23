/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

var debug = true;

var mode = 1;
var speed = 1;
var connect = false;

var correctJoints = 0;
var attempts = 0;
var maxLoop = 4;
var maxAttempts = maxLoop * 90;

var exposed = false;
var exposedTime = 0;
var maxExposure = 30 * 12;

var danceTime = 0;
var maxDance = 30 * 12;

// manage the flickering
var screenMode = 1;
// 1 = performer
// 2 = audience

// Declare kinectron
var kinectron = null;
var audience = null;


// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 3000;

var skelColor = "rgba(137,35,253,1)";
var skelAction = "rgba(217,124,238,"
var mjColor = "rgba(24,210,255,1)";
var mjAction = "rgba(140,207,203,";
var boneWeight = 10;

// Mapping Kinect data to projecion
var scvar, xscl, yscl;
var xshift, yshift;
var scl = true;

// Mapping Michael to projection
var mjxscl, mjyscl;
var mjxshift, mjyshift;
var mjscl = true;

// variable to track frame number of MJ dance
var fr = 0;
var accumfr = 1;

// variables for saving
var oldSkeleton = [];
var oldJointsNum = 60;
var allOldSkels = [];



function setup() {
    //make sure the body is hidden to begin with
    $.ajax({
        url: "http://" + localIP + "/hide",
        dataType: 'json',
        success: function(data) {
            // do nothing
        },
        error: function() {
            alert("error");
        },
    });
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    background(0);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron(IP);  // use the camera here
    //audience = new Kinectron(IPaudience);

    // Connect with application over peer
    kinectron.makeConnection();
    // audience.makeConnection();

    // Set individual frame callbacks for KINECT 1
    kinectron.setBodiesCallback(bodyCallback);
    kinectron.setColorCallback(colorCallback);
    kinectron.startMultiFrame(["body", "color"]);

    // audience.setColorCallback(audienceCallback);
    // audience.startColor();

    scvar = 0.45;
    mjscale = .8;

    xscl = (width / 2) * scvar;
    yscl = -(width / 2) * scvar;
    xshift = width / 2;
    yshift = height / 2 - 75;

    mjxscl = 1.45 * mjscale;
    mjyscl = 1.45 * mjscale;
    mjxshift = 0;
    mjyshift = -60;

    // populate 2D array
    oldSkeleton["head"] = [];
    oldSkeleton["leftwrist"] = [];
    oldSkeleton["rightwrist"] = [];
    oldSkeleton["leftfoot"] = [];
    oldSkeleton["rightfoot"] = [];

}

function colorCallback(img) {
  // do nothing here
}

function audienceCallback(img) {
    if (mode == 2) {
        var mapheight = (540 / 960) * windowWidth;

        loadImage(img.src, function(loadedImage) {
            image(loadedImage, 0, 0, windowWidth, mapheight);
        });
    }
}


function bodyCallback(body) {
    //find tracked bodies
    for (var i = 0; i < body.length; i++) {
        if (body[i].tracked === true) {
            bodyTracked(body[i]);
        }
    }
}

function bodyTracked(body) {
    var id = body.trackingId;
    // When there is a new body, add it
    // only do this if bm is empty

    if (bm.getBodies().length == 0) {
        console.log("new body");
        bm.add(body);
    } else if (bm.getBodies().length > 0) {
        // Otherwise, update it
        if (bm.contains(id)) {
            bm.update(body)
        }
        else {
            // disregard this extra body
        };
    }
}


function draw() {
    // save the old skeletons
    if (mode == 1) {
        var bodies = bm.getBodies();
        if (bodies.length != 0) {

                var body = bodies[0];

                // save only the particular joints
                oldSkeleton["head"].push(getPos(body.getPosition(kinectron.HEAD)));
                if (oldSkeleton["head"].length > oldJointsNum) {
                    oldSkeleton["head"].shift();
                }

                oldSkeleton["leftwrist"].push(getPos(body.getPosition(kinectron.WRISTLEFT)));
                if (oldSkeleton["leftwrist"].length > oldJointsNum) {
                    oldSkeleton["leftwrist"].shift();
                }

                oldSkeleton["rightwrist"].push(getPos(body.getPosition(kinectron.WRISTRIGHT)));
                if (oldSkeleton["rightwrist"].length > oldJointsNum) {
                    oldSkeleton["rightwrist"].shift();
                }

                oldSkeleton["leftfoot"].push(getPos(body.getPosition(kinectron.ANKLELEFT)));
                if (oldSkeleton["leftfoot"].length > oldJointsNum) {
                    oldSkeleton["leftfoot"].shift();
                }

                oldSkeleton["rightfoot"].push(getPos(body.getPosition(kinectron.ANKLERIGHT)));
                if (oldSkeleton["rightfoot"].length > oldJointsNum) {
                    oldSkeleton["rightfoot"].shift();
                }

        }

    }

    // manage the different screens
    switch (mode) {
        case (1): // LIVE INSTRUCTION
            background(0);
            //draw mj oldSkeleton
            drawThriller();

            if (bm.getBodies().length > 0) {

                if (danceTime < maxDance) {
                    danceTime++;
                } else {
                    danceTime = 0;

                    // expose the performer and audience
                    $.ajax({
                        url: "http://" + localIP + "/expose",
                        dataType: 'json',
                        success: function(data) {
                            fill(0);
                            noStroke(0);
                            rect(0, 0, windowWidth, windowHeight);
                            exposed = !exposed;
                            console.log("say hello to your audience");
                            // switch to audience camera
                            mode = 2;
                        },
                        error: function() {
                            alert("error");
                        },
                    });
                }
            }

            drawSkeleton();

            if (connect) {
                drawConnections();
            }
            break;
        case (2): // audience
            //keep track of timing
            if (exposedTime < maxExposure) {
                exposedTime++;
            } else {
                exposedTime = 0;
                // go back to dancing
                mode = 1;

                $.ajax({
                    url: "http://" + localIP + "/hide",
                    dataType: 'json',
                    success: function(data) {
                        // do nothing
                    },
                    error: function() {
                        alert("error");
                    },
                });
            }
            break;
    }

    if (debug) {
        textSize(16);
        fill(255);
        noStroke();
        text("screen (s): " + screenMode, 20, 20);
        text("mode (>): " + mode, 20, 40);
        text("connect: " + connect, 20, 70);
        text("attempt: " + floor(attempts / 90), 20, 90)
        text("yshift (y/h): " + round(yshift), 20, 120);
        text("xscale (t/g): " + round(xscl), 20, 140);
        text("yscale: (t/g)" + round(yscl), 20, 160);

        text("mjY (r/f): " + round(mjyshift), 150, 120);
        text("mjX (b): " + round(mjxshift), 150, 140);
        text("mjscale (u/j): " + mjscale, 150, 160);

        text("framerate: " + frameRate().toFixed(2), 280, 20);

    }
}


function keyPressed() {
    switch (keyCode) {

        case LEFT_ARROW:
            connect = !connect;
            break;

        case 84: // t
            scvar += 0.03;
            xscl = (width / 2) * scvar;
            yscl = -(width / 2) * scvar;
            break;
        case 71: // g
            scvar -= 0.03;
            xscl = round((width / 2) * scvar);
            yscl = round(-(width / 2) * scvar);
            break;
        case 89: // y
            yshift += 30;
            break;
        case 72: // h
            yshift -= 30;
            break;
        case 82: // r
            mjyshift += 50;
            break;
        case 70: // f
            mjyshift -= 50;
            break;
        case 66: // b
            mjxshift += 20;
        case 85: // u
            mjscale += 0.05;
            mjxscl = round(1.45 + mjscale);
            mjyscl = round(1.45 + mjscale);
            break;
        case 74: // j
            mjscale -= 0.05;
            mjxscl = round(1.45 + mjscale);
            mjyscl = round(1.45 + mjscale);
            break;

            // control screen mode for flickering rules
        case 83: // s
            if (screenMode < 2) {
                screenMode++;
            } else {
                screenMode = 1;
            }
            break;

        case 69: // e
            if (correctJoints < 4) {
                correctJoints++;
            } else {
                correctJoints = 0;
            }
            break;

        case 68: // d
            debug = !debug;
            break;

        case 90: // z
            $.ajax({
                url: "http://" + localIP + "/expose",
                dataType: 'json',
                success: function(data) {
                    // do nothing

                    exposed = !exposed;
                    console.log("say hello to your audience");
                    // switch to audience camera

                    if (mode == 1) {
                        fill(0);
                        noStroke(0);
                        rect(0, 0, windowWidth, windowHeight);
                        mode = 4;
                    } else {
                        mode = 1;
                    }

                },
                error: function() {
                    alert("error");
                },
            });
            break;
    }

}
