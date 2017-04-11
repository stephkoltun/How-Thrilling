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

// variables for saving
var oldSkeleton = [];
var oldJointsNum = 50;


function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log("172.30.13.5");

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron("172.30.13.5");
    // Connect with application over peer
    kinectron.makeConnection();

    // Request all tracked bodies and pass data to your callback
    kinectron.startTrackedBodies(bodyTracked);

    xscl = (width / 2) * .8;
    yscl = -(width / 2) * .8;
    xshift = width / 2;
    yshift = height / 2;

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
