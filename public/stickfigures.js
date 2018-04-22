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
var maxExposure = 30 * 5;

var danceTime = 0;
var maxDance = 30 * 12;

// Declare kinectron
var kinectron = null;
var audienceKinectron = null;

var audienceImage;

// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 3000;

var skelColor = "rgba(137,35,253,1)";
var mjColor = "rgba(24,210,255,1)";
var boneWeight = 10;

// Mapping Kinect data to projecion
var scvar, xscl, yscl;
var xshift, yshift, yoffset;
var scl = true;

// Mapping Michael to projection
var mjxscl, mjyscl;
var mjxshift, mjyshift;
var mjscl = true;

// variable to track frame number of MJ dance
var fr = 0;
var accumfr = 1;


function setup() {
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

    audienceKinectron = new Kinectron("audience",
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

    audienceKinectron.makeConnection();
    audienceKinectron.setColorCallback(audienceCallback);

    scvar = 0.4;
    mjscale = 1.8;

    xscl = (width / 2) * scvar;
    yscl = -(width / 2) * scvar;
    xshift = width / 2;
    yshift = height / 2;


    mjxscl = 1.45 * mjscale;
    mjyscl = 1.45 * mjscale;
    mjxshift = 0;
    mjyshift = -50;
}

function draw() {

  // manage the different screens
  switch (mode) {
      case (1): // LIVE INSTRUCTION
        var bodies = bm.getBodies();
        // save the old skeletons
        if (bodies.length != 0) {
            var body = bodies[0];
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
            }
        }

        drawSkeleton(1, [skelColor]);

        break;
    case (2): // audience
        //keep track of timing
        // hide the sketch
        if (audienceImage != null) {
          image(audienceImage, 0, 0, windowWidth, windowHeight);
        }

        if (exposedTime < maxExposure) {
            exposedTime++;
        } else {
            exposedTime = 0;
            // go back to dancing
            mode = 1;
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

function audienceCallback(img) {
  if (mode == 2) {
    loadImage(img.src, function(loadedImage) {
      audienceImage = loadedImage;
    })
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
    var bodies = bm.getBodies();

    if (bodies.length == 0) {
        console.log("new body");
        bm.add(body);

        var mjFoot = getMJpos(thriller.ankleleft[0]);
        console.log(mjFoot);
        var mjHead = getMJpos(thriller.head[0]);
        var mjHeight = mjFoot.y - mjHead.y;
        console.log("mj " + mjHeight);

        var thisbody = bm.getBodies();
        var head = getPos(thisbody[0].getPosition(3));
        var leftfoot = getPos(thisbody[0].getPosition(18));
        //console.log(leftfoot);
        var newYOffset = leftfoot.y - mjFoot.y;
        yshift = yshift - newYOffset;

        // get the new values
        head = getPos(thisbody[0].getPosition(3));
        leftfoot = getPos(thisbody[0].getPosition(18));
        var height = leftfoot.y - head.y;
        console.log("me " + height);

        var diffHeight = mjHeight/height;

        scvar = scvar * diffHeight - 0.05;
        xscl = (width / 2) * scvar;
        yscl = -(width / 2) * scvar;

        // set offset again
        head = getPos(thisbody[0].getPosition(3));
        leftfoot = getPos(thisbody[0].getPosition(18));
        newYOffset = leftfoot.y - mjFoot.y;
        yshift = yshift - newYOffset;


    } else if (bodies.length > 0) {
        // Otherwise, update it
        if (bm.contains(id)) {
            bm.update(body)
        }
        else {
            // disregard this extra body
        };
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
    }
}
