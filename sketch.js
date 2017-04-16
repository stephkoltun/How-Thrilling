/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

var mode = 1;
var speed = 1;
var connect = true;

// Declare kinectron
var kinectron = null;

var kinectron2 = null;

var IP = "172.30.13.97";

// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 1000;

var skelColor = "rgba(255,0,230,.5)";
var mjColor = "rgba(0,247,255,.5)";
var boneWeight = 10;

// Mapping Kinect data to projecion
var xscl, yscl;
var xshift, yshift;
var scl = true;

// Mapping Michael to projection
var mjxscl, mjyscl;
var mjxshift, mjyshift;
var mjscl = true;

// variables for saving
var oldSkeleton = [];
var oldJointsNum = 88;

var thrillerVid;
var playing = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(IP);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron(IP);

    // Connect with application over peer
    kinectron.makeConnection();

    // Set individual frame callbacks
    kinectron.setColorCallback(rgbCallback);
    kinectron.setBodiesCallback(bodyCallback);
    kinectron.startMultiFrame(["color", "body"]);


    // Create video
    thrillerVid = createVideo('thriller.mp4');
    thrillerVid.style("visibility","hidden");


    xscl = (width / 2) * .6;
    yscl = -(width / 2) * .6;
    xshift = width / 2;
    yshift = height / 2;

    mjxscl = 1.2;
    mjyscl = 1.2;
    mjxshift = 0;
    mjyshift = 60;

    background(255);

    // populate 2D array
    for (var i = 0; i < 26; i++) {
        oldSkeleton[i] = [];
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
    if (!bm.contains(id)) bm.add(body);
    // Otherwise, update it
    else bm.update(body);
}

function draw() {

    textSize(12);
    fill(0);
    noStroke();
    text("mode: " + mode, 20, 20);
    text("speed: " + speed, 20, 40);

    if (mode != 2) {
        var bodies = bm.getBodies();
        for (var b = 0; b < bodies.length; b++) {
            var body = bodies[b];

            // save points to past-position array
            for (var j = 0; j < body.joints.length; j++) {

                var oldJoints = oldSkeleton[j];
                oldJoints.push(getPos(body.getPosition(j)));

                if (oldJoints.length > oldJointsNum) {
                    oldJoints.shift();
                }
            }
        }
    }


    switch (mode) {
        case (0): // ACCUMULATION
            // allow background to build up
            background(255, 10);
            // draw mj oldSkeleton
            drawThriller();
            drawSkeleton();
            break;
        case (1): // LIVE INSTRUCTION
            background(255, 180);
            // draw mj oldSkeleton
            drawThriller();
            drawSkeleton();
            if (connect) {
                drawConnections();
            }
            
            break;
        case (2): // KINECT IMAGE

            break;
        case (3): // MJ VIDEO
            if (!playing) {
                thrillerVid.style("visibility","visible");
                thrillerVid.style("position","absolute");
                thrillerVid.style("top","0");
                thrillerVid.loop();
                playing = true;
            }
            break;
    }
}

function rgbCallback(img) {
    if (mode == 2) {
        var mapheight = 540 / 960 * windowWidth;

        loadImage(img.src, function(loadedImage) {
            image(loadedImage, 0, 0, windowWidth, mapheight);
        });
    }
}

function drawConnections() {

    // MJ's points
    var ankLeft = getMJpos(thriller.ankleleft[fr]);
    var ankRight = getMJpos(thriller.ankleright[fr]);
    var kneeLeft = getMJpos(thriller.kneeleft[fr]);
    var kneeRight = getMJpos(thriller.kneeright[fr]);
    var hipLeft = getMJpos(thriller.hipleft[fr]);
    var hipRight = getMJpos(thriller.hipright[fr]);
    var baseSpine = getMJpos(thriller.basespine[fr]);
    var midSpine = getMJpos(thriller.midspine[fr]);
    var neck = getMJpos(thriller.neck[fr]);
    var head = getMJpos(thriller.head[fr]);
    var shoulderLeft = getMJpos(thriller.shoulderleft[fr]);
    var shoulderRight = getMJpos(thriller.shoulderright[fr]);
    var elbowLeft = getMJpos(thriller.elbowleft[fr]);
    var elbowRight = getMJpos(thriller.elbowright[fr]);
    var wristLeft = getMJpos(thriller.wristleft[fr]);
    var wristRight = getMJpos(thriller.wristright[fr]);


    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
        var body = bodies[b];

        

        noFill();
        stroke(0);
        strokeWeight(1);

        // draw POINTS for each joint
        for (var j = 0; j < body.joints.length; j++) {
            var pos = getPos(body.getPosition(j));

            switch (j) {
                case 2: // neck 
                    line(pos.x, pos.y, neck.x, neck.y);
                    break;
                case 8: // left shoulder
                    line(pos.x, pos.y, shoulderLeft.x, shoulderLeft.y);
                    break;
                case 5: // right elbow
                    line(pos.x, pos.y, elbowRight.x, elbowRight.y);
                    break;
                case 9: // Left elbow
                    line(pos.x, pos.y, elbowLeft.x, elbowLeft.y);
                    break;
                case 16: // hips
                    line(pos.x, pos.y, hipLeft.x, hipLeft.y);
                    break;
                case 17: // left knee
                    line(pos.x, pos.y, kneeLeft.x, kneeLeft.y);
                    break;
                case 13: // right knee
                    line(pos.x, pos.y, kneeRight.x, kneeRight.y);
                    break;

            }

        }
    }

}


function drawSkeleton() {
    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
        var body = bodies[b];

        // draw POINTS for each joint
        for (var j = 0; j < body.joints.length; j++) {

            var pos = getPos(body.getPosition(j));

            switch (mode) {
                case (0):
                    fill(skelColor);
                    noStroke();
                    var r = 4;
                    break;
                case (1):
                    fill(skelColor);
                    noStroke();
                    var r = 3;
                    break;
            }
            //ellipse(pos.x, pos.y, r, r);


            // draw BONES
            // and lines to MJ
            // draw LINES between joints
            switch (mode) {
                case (0):
                    noFill();
                    stroke(skelColor);
                    strokeWeight(boneWeight);
                    break;
                case (1):
                    noFill();
                    stroke(skelColor);
                    strokeWeight(boneWeight);
                    break;
            }
            switch (j) {
                case 2: // neck to head 
                    line(pos.x, pos.y, getPos(body.getPosition(3)).x, getPos(body.getPosition(3)).y);
                    stroke(0);
                    strokeWeight(5);
                    break;
                case 4: // shoulders
                    line(pos.x, pos.y, getPos(body.getPosition(8)).x, getPos(body.getPosition(8)).y);
                    break;
                case 5: // Left elbow
                    line(pos.x, pos.y, getPos(body.getPosition(4)).x, getPos(body.getPosition(4)).y)
                    line(pos.x, pos.y, getPos(body.getPosition(6)).x, getPos(body.getPosition(6)).y);
                    break;
                case 9: // right elbow
                    line(pos.x, pos.y, getPos(body.getPosition(8)).x, getPos(body.getPosition(8)).y);
                    line(pos.x, pos.y, getPos(body.getPosition(10)).x, getPos(body.getPosition(10)).y);
                    break;
                case 12: // hips
                    line(pos.x, pos.y, getPos(body.getPosition(16)).x, getPos(body.getPosition(16)).y);
                    break;
                case 13: // left knee
                    line(pos.x, pos.y, getPos(body.getPosition(12)).x, getPos(body.getPosition(12)).y);
                    line(pos.x, pos.y, getPos(body.getPosition(14)).x, getPos(body.getPosition(14)).y);
                    break;
                case 17: // right knee
                    line(pos.x, pos.y, getPos(body.getPosition(16)).x, getPos(body.getPosition(16)).y);
                    line(pos.x, pos.y, getPos(body.getPosition(18)).x, getPos(body.getPosition(18)).y);
                    break;

            }

        }
    }

}


// variable to track frame number of MJ dance
var fr = 0;

function drawThriller() {

    var ankLeft = getMJpos(thriller.ankleleft[fr]);
    var ankRight = getMJpos(thriller.ankleright[fr]);
    var kneeLeft = getMJpos(thriller.kneeleft[fr]);
    var kneeRight = getMJpos(thriller.kneeright[fr]);
    var hipLeft = getMJpos(thriller.hipleft[fr]);
    var hipRight = getMJpos(thriller.hipright[fr]);
    var baseSpine = getMJpos(thriller.basespine[fr]);
    var midSpine = getMJpos(thriller.midspine[fr]);
    var neck = getMJpos(thriller.neck[fr]);
    var head = getMJpos(thriller.head[fr]);
    var shoulderLeft = getMJpos(thriller.shoulderleft[fr]);
    var shoulderRight = getMJpos(thriller.shoulderright[fr]);
    var elbowLeft = getMJpos(thriller.elbowleft[fr]);
    var elbowRight = getMJpos(thriller.elbowright[fr]);
    var wristLeft = getMJpos(thriller.wristleft[fr]);
    var wristRight = getMJpos(thriller.wristright[fr]);


    // draw POINTS each type of joint
    switch (mode) {
        case (0):
            fill(mjColor);
            noStroke();
            var r = 4;
            break;
        case (1):
            fill(mjColor);
            noStroke();
            var r = 4;
            break;
    }

    ellipse(ankLeft.x, ankLeft.y, r, r);
    ellipse(ankRight.x, ankRight.y, r, r);
    ellipse(kneeLeft.x, kneeLeft.y, r, r);
    ellipse(kneeRight.x, kneeRight.y, r, r);
    ellipse(hipLeft.x, hipLeft.y, r, r);
    ellipse(hipRight.x, hipRight.y, r, r);
    ellipse(shoulderLeft.x, shoulderLeft.y, r, r);
    ellipse(shoulderRight.x, shoulderRight.y, r, r);
    ellipse(elbowLeft.x, elbowLeft.y, r, r);
    ellipse(elbowRight.x, elbowRight.y, r, r);
    ellipse(wristLeft.x, wristLeft.y, r, r);
    ellipse(wristRight.x, wristRight.y, r, r);
    ellipse(baseSpine.x, baseSpine.y, r, r);
    //ellipse(midSpine.x, midSpine.y, r, r);
    ellipse(neck.x, neck.y, r, r);
    ellipse(head.x, head.y, r, r);


    // draw LINES between joints
    switch (mode) {
        case (0):
            noFill();
            stroke(mjColor);
            strokeWeight(boneWeight);
            break;
        case (1):
            noFill();
            stroke(mjColor);
            strokeWeight(boneWeight);
            break;
    }


    line(neck.x, neck.y, head.x, head.y);
    line(elbowRight.x, elbowRight.y, shoulderRight.x, shoulderRight.y);
    line(elbowRight.x, elbowRight.y, wristRight.x, wristRight.y);
    line(elbowLeft.x, elbowLeft.y, shoulderLeft.x, shoulderLeft.y);
    line(elbowLeft.x, elbowLeft.y, wristLeft.x, wristLeft.y);
    line(shoulderRight.x, shoulderRight.y, shoulderLeft.x, shoulderLeft.y);
    line(hipRight.x, hipRight.y, baseSpine.x, baseSpine.y);
    line(hipLeft.x, hipLeft.y, baseSpine.x, baseSpine.y);
    line(hipRight.x, hipRight.y, kneeRight.x, kneeRight.y);
    line(hipLeft.x, hipLeft.y, kneeLeft.x, kneeLeft.y);
    line(ankLeft.x, ankLeft.y, kneeLeft.x, kneeLeft.y);
    line(ankRight.x, ankRight.y, kneeRight.x, kneeRight.y);




    if (frameCount % speed == 0) {
        // increment through the frames
        if (fr < 88) {
            fr++;
        } else {
            fr = 0;
        }
    }
}




function keyPressed() {
    switch (keyCode) {
        case RIGHT_ARROW:
            fill(255);
            noStroke();
            rect(0, 0, windowWidth, windowHeight);

            if (mode < 3) {
                mode++;
            } else {
                mode = 0;
            }

            // pause and hide video
            if (mode != 3 && playing != false) {
                playing = false;
                thrillerVid.style("visibility","hidden");
                thrillerVid.pause();
            }
            break;
        case UP_ARROW:
            speed += 1;
            break;
        case DOWN_ARROW:
            speed -= 1;
            break;
        case LEFT_ARROW:
            connect != connect;
    }

}

// Scale the data to fit the screen
// Move it to the center of the screen
// Return it as a vector
function getPos(joint) {
    return createVector((joint.x * xscl) + xshift, (joint.y * yscl) + yshift);
}

function getMJpos(joint) {
    return createVector((joint.x * mjxscl) + mjxshift, (joint.y * mjyscl) + mjyshift);
}
