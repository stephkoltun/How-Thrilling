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
        url: "https://" + liveIP + "/hide",
        dataType: 'json',
        success: function(data) {
            // do nothing
        },
        error: function() {
            alert("error");
        },
    });
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("cnv");  // set parent of canvas
    frameRate(30);
    //background(0);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    // connect to our peer server
    kinectron = new Kinectron("dancing",
    {
      "host": "sk6385.itp.io",
      "port": "9000",
      "path": "/peerjs",
      "secure":"true"
    });

    // Connect with application over peer
    kinectron.makeConnection();

    // Set individual frame callbacks for KINECT 1
    kinectron.setBodiesCallback(bodyCallback);
    kinectron.setColorCallback(colorCallback);
    kinectron.startMultiFrame(["body", "color"]);

    scvar = 0.6;
    mjscale = .8;

    xscl = (width / 2) * scvar;
    yscl = -(width / 2) * scvar;
    xshift = width / 2;
    yshift = height / 2 - 25;

    mjxscl = 1.45 * mjscale;
    mjyscl = 1.45 * mjscale;
    mjxshift = 0;
    mjyshift = -20;

    // populate 2D array
    oldSkeleton["head"] = [];
    oldSkeleton["leftwrist"] = [];
    oldSkeleton["rightwrist"] = [];
    oldSkeleton["leftfoot"] = [];
    oldSkeleton["rightfoot"] = [];
}

function draw() {

  // manage the different screens
  switch (mode) {
      case (1): // LIVE INSTRUCTION
        var bodies = bm.getBodies();
        // save the old skeletons
        if (bodies.length != 0) {
                var body = bodies[0];
                saveBodyPoints(body);
        }

        background(0);
        //draw mj oldSkeleton
        drawThriller();

        if (bm.getBodies().length > 0) {

            if (danceTime < maxDance) {
                danceTime++;
            } else {
                danceTime = 0;
                // switch to audience camera
                mode = 2;
                $("#cnv").hide();
                console.log("say hello to your audience");
            }
        }

        drawSkeleton(1, [skelColor]);

        break;
    case (2): // audience
        //keep track of timing
        // hide the sketch
        if (exposedTime < maxExposure) {
            exposedTime++;
        } else {
            exposedTime = 0;
            // go back to dancing
            mode = 1;
            $("#cnv").show();
        }
        break;
  }

  if (debug) {
    showDebugText()
  }
}

function showDebugText() {
  textSize(16);
  fill(255);
  noStroke();
  text("yshift (y/h): " + round(yshift), 20, 20);
  text("xscale (t/g): " + round(xscl), 20, 40);
  text("yscale: (t/g)" + round(yscl), 20, 60);

  text("mjY (r/f): " + round(mjyshift), 150, 20);
  text("mjX (b): " + round(mjxshift), 150, 40);
  text("mjscale (u/j): " + mjscale, 150, 660);

  text("framerate: " + frameRate().toFixed(2), 20, 90);
}


function colorCallback(img) {
  // do nothing here
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

function saveBodyPoints(body) {
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
            if (mode < 2) {
                mode++;
            } else {
                mode = 1;
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
                url: "https://" + liveIP + "/expose",
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
