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
    background(255,10);

        var bodies = bm.getBodies();
        for (var b = 0; b < bodies.length; b++) {
            var body = bodies[b];

            // save points to past-position array
            for (var j = 0; j < body.joints.length; j++) {

                var pos = getPos(body.getPosition(j));

                fill(50,160,200);
                noStroke();
                ellipse(pos.x, pos.y, 5, 5);

                var oldJoints = oldSkeleton[j];
                oldJoints.push(getPos(body.getPosition(j)));

                if (oldJoints.length > oldJointsNum) {
                    oldJoints.shift();
                }
            }
        }

}



function drawSkeleton() {
    //console.log(prevSkeletons);



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
