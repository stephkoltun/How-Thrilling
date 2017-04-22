/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

var mode = 0;
var speed = 1;
var connect = false;
var actionline = true;

// Declare kinectron
var kinectron = null;

var IP = "172.16.223.185";

// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 1000;

var skelColor = "rgba(255,0,230,.5)";
var mjColor = "rgba(0,247,255,.5)";
var mjDark = "rgba(40,185,225,1)";
var boneWeight = 3;

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
var accumfr = 0;

// variables for saving
var oldSkeleton = [];
var curOldJoint = 0;
var oldJointsNum = 88;


var thrillerVid;
var playing = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(IP);

    frameRate(30);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron(IP);

    // Connect with application over peer
    kinectron.makeConnection();

    // Set individual frame callbacks
    kinectron.setColorCallback(rgbCallback);
    kinectron.setBodiesCallback(bodyCallback);
    kinectron.startMultiFrame(["body", "color"]);


    // Create video
    thrillerVid = createVideo('thriller.mp4');
    thrillerVid.style("visibility", "hidden");

    scvar = 0.9;
    scvar = 0.9;

    xscl = (width / 2) * scvar;
    yscl = -(width / 2) * scvar;
    xshift = width / 2;
    yshift = height / 2;

    mjxscl = 1.45;
    mjyscl = 1.45;
    mjxshift = 0;
    mjyshift = -60;

    background(255);

    // populate 2D array
    for (var i = 0; i < 25; i++) {
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


function rgbCallback(img) {
    if (mode == 3) {
        var mapheight = 540 / 960 * windowWidth;

        loadImage(img.src, function(loadedImage) {
            image(loadedImage, 0, 0, windowWidth, mapheight);
        });
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
    text("connect: " + connect, 20, 60);
    text("yshift: " + yshift, 20, 100);
    text("xscale: " + xscl, 20, 120);
    text("yscale: " + yscl, 20, 140);

    if (mode == 0) {
        var bodies = bm.getBodies();
        for (var b = 0; b < bodies.length; b++) {
            var body = bodies[b];

            // save points to past-position array
            for (var j = 0; j < body.joints.length; j++) {

                var oldJoints = oldSkeleton[j];

                oldJoints.push(getPos(body.getPosition(j)));

                // if (oldJoints.length < 86) {
                //     oldJoints.push(getPos(body.getPosition(j)));
                // } else {

                //     var curPos = getPos(body.getPosition(j));
                //     var lastPos = oldJoints[oldJoints.length-1];
                //     var d = dist(curPos.x, curPos.y, lastPos.x, lastPos.y);
                //     if (d > 1) {
                //         oldJoints.push(getPos(body.getPosition(j)));
                //     }
                    
                // }

                

                if (oldJoints.length > oldJointsNum) {
                    oldJoints.shift();
                }
            }
        }
    }


    switch (mode) {
        case (0): // ACCUMULATION
            // allow background to build up
            background(0, 255, 188, 5);

            // draw mj oldSkeleton
            drawAccumThriller();
            drawAccumSkeleton();
            break;
        case (1): // LIVE INSTRUCTION
            background(255, 120);
            // draw mj oldSkeleton
            if (actionline) {
                drawAction();
            }
            drawThriller();
            drawSkeleton();
            if (connect) {
                drawConnections();
            }
            break;
        case (2): // MJ
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
            break;
        case (3):
            // the body will draw
            break;
    }
}


function drawAction() {

    stroke(200);
    strokeWeight(1);
    noFill();

    for (var i = 0; i < 87; i++) {
        var ankLeft = getMJpos(thriller.ankleleft[i]);
        var ankLeftNext = getMJpos(thriller.ankleleft[i + 1]);
        line(ankLeft.x, ankLeft.y, ankLeftNext.x, ankLeftNext.y);

        var kneeRight = getMJpos(thriller.kneeright[i]);
        var kneeRightNext = getMJpos(thriller.kneeright[i + 1]);
        line(kneeRight.x, kneeRight.y, kneeRightNext.x, kneeRightNext.y);

        var wristRight = getMJpos(thriller.wristright[i]);
        var wristRightNext = getMJpos(thriller.wristright[i + 1]);
        line(wristRight.x, wristRight.y, wristRightNext.x, wristRightNext.y);

        var head = getMJpos(thriller.head[i]);
        var headNext = getMJpos(thriller.head[i + 1]);
        line(head.x, head.y, headNext.x, headNext.y);
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
        stroke(120);
        strokeWeight(2);

        // draw POINTS for each joint
        for (var j = 0; j < body.joints.length; j++) {
            var pos = getPos(body.getPosition(j));

            switch (j) {
                case 3: // head
                    line(pos.x, pos.y, head.x, head.y);
                    break;
                case 10: // right wrist
                    line(pos.x, pos.y, wristRight.x, wristRight.y);
                    break;
                case 13: // right knee
                    line(pos.x, pos.y, kneeRight.x, kneeRight.y);
                    break;
                case 14: // left ankle
                    line(pos.x, pos.y, ankLeft.x, ankLeft.y);
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
                    var r = 5;
                    ellipse(pos.x, pos.y, r, r);
                    break;
                case (1):
                    fill(skelColor);
                    noStroke();
                    var r = 8;
                    break;
            }




            // draw BONES
            // and lines to MJ
            // draw LINES between joints
            switch (mode) {
                case (0):
                    noFill();
                    stroke(skelColor);
                    strokeWeight(0.5);
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

function drawAccumSkeleton() {

    var divider = 10;
    stroke(255);

    var head = oldSkeleton[3];
    var wrist = oldSkeleton[6];
    var ankle = oldSkeleton[18];

    for (var i = 0; i < oldSkeleton[10].length - 3; i++) {
        noFill();
        
        var d = dist(head[i].x, head[i].y, head[i + 1].x, head[i + 1].y);
        strokeWeight(divider / d + 1);
        line(head[i].x, head[i].y, head[i + 1].x, head[i + 1].y);

        var d = dist(wrist[i].x, wrist[i].y, wrist[i + 1].x, wrist[i + 1].y);
        strokeWeight(divider / d + 1);
        line(wrist[i].x, wrist[i].y, wrist[i + 1].x, wrist[i + 1].y);

        var d = dist(ankle[i].x, ankle[i].y, ankle[i + 1].x, ankle[i + 1].y);
        strokeWeight(divider / d + 1);        
        line(ankle[i].x, ankle[i].y, ankle[i + 1].x, ankle[i + 1].y);
    }
}


function drawAccumThriller() {

    var ankLeft = getMJpos(thriller.ankleleft[accumfr]);
    var ankRight = getMJpos(thriller.ankleright[accumfr]);
    var kneeLeft = getMJpos(thriller.kneeleft[accumfr]);
    var kneeRight = getMJpos(thriller.kneeright[accumfr]);
    var hipLeft = getMJpos(thriller.hipleft[accumfr]);
    var hipRight = getMJpos(thriller.hipright[accumfr]);
    var baseSpine = getMJpos(thriller.basespine[accumfr]);
    var midSpine = getMJpos(thriller.midspine[accumfr]);
    var neck = getMJpos(thriller.neck[accumfr]);
    var head = getMJpos(thriller.head[accumfr]);
    var shoulderLeft = getMJpos(thriller.shoulderleft[accumfr]);
    var shoulderRight = getMJpos(thriller.shoulderright[accumfr]);
    var elbowLeft = getMJpos(thriller.elbowleft[accumfr]);
    var elbowRight = getMJpos(thriller.elbowright[accumfr]);
    var wristLeft = getMJpos(thriller.wristleft[accumfr]);
    var wristRight = getMJpos(thriller.wristright[accumfr]);

    noFill();
    stroke(200, 0, 255);
    var divider = 10;

    var ankLeft = getMJpos(thriller.ankleleft[accumfr]);
    var ankLeftNext = getMJpos(thriller.ankleleft[accumfr + 1]);
    var ankDist = dist(ankLeft.x, ankLeft.y, ankLeftNext.x, ankLeftNext.y);
    strokeWeight(divider / ankDist + 1);

    line(ankLeft.x, ankLeft.y, ankLeftNext.x, ankLeftNext.y);

    var kneeRight = getMJpos(thriller.kneeright[accumfr]);
    var kneeRightNext = getMJpos(thriller.kneeright[accumfr + 1]);
    var kneeDist = dist(kneeRight.x, kneeRight.y, kneeRightNext.x, kneeRightNext.y);
    strokeWeight(divider / kneeDist + 1);

    line(kneeRight.x, kneeRight.y, kneeRightNext.x, kneeRightNext.y);

    var wristRight = getMJpos(thriller.wristright[accumfr]);
    var wristRightNext = getMJpos(thriller.wristright[accumfr + 1]);
    var wristDist = dist(wristRight.x, wristRight.y, wristRightNext.x, wristRightNext.y);
    strokeWeight(divider / wristDist + 1);

    line(wristRight.x, wristRight.y, wristRightNext.x, wristRightNext.y);

    var head = getMJpos(thriller.head[accumfr]);
    var headNext = getMJpos(thriller.head[accumfr + 1]);
    var headDist = dist(head.x, head.y, headNext.x, headNext.y);
    strokeWeight(divider / headDist + 1);

    line(head.x, head.y, headNext.x, headNext.y);


    // increment through the frames
    if (accumfr < 87) {
        accumfr++;
    } else {
        accumfr = 0;

    }
}




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
            var r = 5;
            ellipse(ankLeft.x, ankLeft.y, r, r);
            ellipse(kneeRight.x, kneeRight.y, r, r);
            ellipse(wristRight.x, wristRight.y, r, r);
            ellipse(head.x, head.y, r, r);

            break;
        case (1):
            fill(mjColor);
            noStroke();
            var r = 5;
            ellipse(ankLeft.x, ankLeft.y, r * 3, r * 3);
            ellipse(kneeRight.x, kneeRight.y, r * 3, r * 3);
            ellipse(wristRight.x, wristRight.y, r * 3, r * 3);
            ellipse(head.x, head.y, r * 3, r * 3);
            break;
    }


    ellipse(ankRight.x, ankRight.y, r, r);
    ellipse(kneeLeft.x, kneeLeft.y, r, r);
    ellipse(hipLeft.x, hipLeft.y, r, r);
    ellipse(hipRight.x, hipRight.y, r, r);
    ellipse(shoulderLeft.x, shoulderLeft.y, r, r);
    ellipse(shoulderRight.x, shoulderRight.y, r, r);
    ellipse(elbowLeft.x, elbowLeft.y, r, r);
    ellipse(elbowRight.x, elbowRight.y, r, r);
    ellipse(wristLeft.x, wristLeft.y, r, r);

    ellipse(baseSpine.x, baseSpine.y, r, r);
    //ellipse(midSpine.x, midSpine.y, r, r);
    ellipse(neck.x, neck.y, r, r);



    // draw LINES between joints
    switch (mode) {
        case (0):
            noFill();
            stroke(mjColor);
            strokeWeight(0.5);
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
            if (mode != 2 && playing != false) {
                playing = false;
                thrillerVid.style("visibility", "hidden");
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
            connect = !connect;
            break;
        case 65:
            actionline = !actionline;
            break;
        case 84: // t
            scvar += 0.1;
            xscl = (width / 2) * scvar;
            yscl = -(width / 2) * scvar;
            break;
        case 71: // g
            scvar -= 0.1;
            xscl = round((width / 2) * scvar);
            yscl = round(-(width / 2) * scvar);
            break;
        case 89: // y 
            yshift += 50;
            break;
        case 72: // h 
            yshift -= 50;
            break;
        case 82: // r
            mjyshift += 50;
            break;
        case 70: // f
            mjyshift -= 50;
            break;

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
