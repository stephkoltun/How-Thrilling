/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

// Declare kinectron
var kinectron = null;

// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 1000;


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
var oldJointsNum = 50;


function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log("172.30.13.97");

        // KINECTRON SETUP
        // Define and create an instance of kinectron
        kinectron = new Kinectron("172.30.13.97");
        // Connect with application over peer
        kinectron.makeConnection();

        // Request all tracked bodies and pass data to your callback
        kinectron.startTrackedBodies(bodyTracked);

    xscl = (width / 2) * .8;
    yscl = -(width / 2) * .8;
    xshift = width / 2;
    yshift = height / 2;

    mjxscl = 1;
    mjyscl = 1;
    mjxshift = 0;
    mjyshift = 0;

    background(255);

    // populate 2D array
    for (var i = 0; i < 26; i++) {
        oldSkeleton[i] = [];
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
    background(255);


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

        drawSkeleton();
}

var curFrame = 0;

function drawHistoryThriller() {
    for (var i = 0; i < thriller.ankleleft.length; i++) {
        var ankLeft = getMJpos(thriller.ankleleft[i]);
        var ankRight = getMJpos(thriller.ankleright[i]);
        var kneeLeft = getMJpos(thriller.kneeleft[i]);
        var kneeRight = getMJpos(thriller.kneeright[i]);
        var hipLeft = getMJpos(thriller.hipleft[i]);
        var hipRight = getMJpos(thriller.hipright[i]);
        var baseSpine = getMJpos(thriller.basespine[i]);
        var midSpine = getMJpos(thriller.midspine[i]);
        var neck = getMJpos(thriller.neck[i]);
        var head = getMJpos(thriller.head[i]);
        var shoulderLeft = getMJpos(thriller.shoulderleft[i]);
        var shoulderRight = getMJpos(thriller.shoulderright[i]);
        var elbowLeft = getMJpos(thriller.elbowleft[i]);
        var elbowRight = getMJpos(thriller.elbowright[i]);
        var wristLeft = getMJpos(thriller.wristleft[i]);
        var wristRight = getMJpos(thriller.wristright[i]);

        var opacInc = 255/thriller.ankleleft.length;
        var opacVal = opacInc*i;

        fill(0, opacVal);
        noStroke();

        var r = 5;

        // draw each type of joint
        ellipse(ankLeft.x, ankLeft.y, r, r);
        ellipse(ankRight.x, ankRight.y, r, r);
        ellipse(kneeLeft.x, kneeLeft.y, r, r);
        ellipse(kneeRight.x, kneeRight.y, r, r);
        //ellipse(hipLeft.x, hipLeft.y, r, r);
        //ellipse(hipRight.x, hipRight.y, r, r);
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

    }

    // increment through the frames
    if (curFrame < 88) {
        curFrame++;
    } else {
        curFrame = 0;
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

    fill(0);
    noStroke();

    var r = 5;

    // draw each type of joint
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

    // draw lines between joints
    noFill();
    stroke(0);
    strokeWeight(1);
    line(neck.x, neck.y, head.x, head.y);
    line(elbowRight.x, elbowRight.y, shoulderRight.x, shoulderRight.y);
    line(elbowRight.x, elbowRight.y, wristRight.x, wristRight.y);
    line(elbowLeft.x, elbowLeft.y, shoulderLeft.x, shoulderLeft.y);
    line(elbowLeft.x, elbowLeft.y, wristLeft.x, wristLeft.y);
    line(hipRight.x, hipRight.y, baseSpine.x, baseSpine.y);
    line(hipLeft.x, hipLeft.y, baseSpine.x, baseSpine.y);
    line(baseSpine.x, baseSpine.y, kneeRight.x, kneeRight.y);
    line(baseSpine.x, baseSpine.y, kneeLeft.x, kneeLeft.y);
    line(ankLeft.x, ankLeft.y, kneeLeft.x, kneeLeft.y);
    line(ankRight.x, ankRight.y, kneeRight.x, kneeRight.y);

    // increment through the frames
    if (fr < 88) {
        fr++;
    } else {
        fr = 0;
    }
}


function drawSkeleton() {
    //console.log(prevSkeletons);

    for (var i = 0; i < oldSkeleton.length; i++) {

        var oldJoints = oldSkeleton[i];


        // draw shapes
        if (i == 5) {
            if (oldJoints.length > 49) {

                for (var j = 0; j < oldJoints.length; j++) {

                    var opacIncr = 0.01;
                    var opac = j * opacIncr;
                    var color = 'rgba(50, 160, 200, ' + opac + ')';

                    if (j < 47) {

                        fill(color);
                        noStroke();
                        beginShape();
                        vertex(oldSkeleton[5][j].x, oldSkeleton[5][j].y);
                        vertex(oldSkeleton[5][j + 1].x, oldSkeleton[5][j + 1].y);
                        vertex(oldSkeleton[6][j + 1].x, oldSkeleton[6][j + 1].y);
                        vertex(oldSkeleton[6][j].x, oldSkeleton[6][j].y);
                        endShape();
                    }
                }
            }
        }


        // draw points
        if ((i == 3) || (i == 6) || (i == 10)) {

            for (var j = 0; j < oldJoints.length; j++) {
                var pos = oldJoints[j];

                var opacIncr = 0.01;
                var opac = j * opacIncr;
                var color = 'rgba(50, 160, 200, ' + opac + ')';

                fill(color);
                noStroke();
                ellipse(pos.x, pos.y, 5, 5);
            }
        }

        // draw bones
        for (var j = 0; j < oldJoints.length; j++) {

            var pos = oldJoints[j];

            var opacIncr = 0.01;
            var opac = j * opacIncr;
            var color = 'rgba(50, 160, 200, ' + opac + ')';

            noFill();
            stroke(color);
            strokeWeight(2);

            switch (i) {
                case 0: // spine base to neck
                    line(pos.x, pos.y, oldSkeleton[2][j].x, oldSkeleton[2][j].y);
                    break;
                case 2: // neck to head 
                    line(pos.x, pos.y, oldSkeleton[3][j].x, oldSkeleton[3][j].y);
                    break;
                case 4: // shoulders
                    line(pos.x, pos.y, oldSkeleton[8][j].x, oldSkeleton[8][j].y);
                    break;
                case 5: // Left elbow
                    line(pos.x, pos.y, oldSkeleton[4][j].x, oldSkeleton[4][j].y)
                    line(pos.x, pos.y, oldSkeleton[6][j].x, oldSkeleton[6][j].y);
                    break;
                case 9: // right elbow
                    line(pos.x, pos.y, oldSkeleton[8][j].x, oldSkeleton[8][j].y);
                    line(pos.x, pos.y, oldSkeleton[10][j].x, oldSkeleton[10][j].y);
                    break;
                case 12: // hips
                    line(pos.x, pos.y, oldSkeleton[16][j].x, oldSkeleton[16][j].y);
                    break;
                case 13: // left knee
                    line(pos.x, pos.y, oldSkeleton[12][j].x, oldSkeleton[12][j].y);
                    line(pos.x, pos.y, oldSkeleton[14][j].x, oldSkeleton[14][j].y);
                    break;
                case 17: // right knee
                    line(pos.x, pos.y, oldSkeleton[16][j].x, oldSkeleton[16][j].y);
                    line(pos.x, pos.y, oldSkeleton[18][j].x, oldSkeleton[18][j].y);
                    break;

            }

        }

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
