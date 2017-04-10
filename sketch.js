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

var prevSkeletons = [];

function setup() {
    createCanvas(windowWidth, windowHeight);


    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron("172.30.5.103");
    // Connect with application over peer
    kinectron.makeConnection();

    // Request all tracked bodies and pass data to your callback
    kinectron.startTrackedBodies(bodyTracked);

    xscl = (width / 2) * .8;
    yscl = -(width / 2) * .8;
    xshift = width / 2;
    yshift = height / 2;

    background(255);
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

    // Get array of bodies
    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
        var body = bodies[b];

        prevSkeletons.push(getPos(body.getPosition(kinectron.HEAD)));

        if (prevSkeletons.length > 100) {
            prevSkeletons.shift();
        }
    }

    drawSkeleton();
}

function getPos(joint) {
    return createVector((joint.x * xscl) + xshift, (joint.y * yscl) + yshift);
}


function drawSkeleton() {
    //console.log(prevSkeletons);

    for (var i = 0; i < prevSkeletons.length; i++) {
        var pos = prevSkeletons[i];
        //console.log(pos);

        var opac = i/(prevSkeletons.length-1);
        var color = 'rgba(50, 160, 200, ' + opac +')';

        fill(color);
        noStroke();
        ellipse(pos.x, pos.y, 10, 10);
    }

    // }

    //  // Mid-line
    //  var head = getPos(body.getPosition(kinectron.HEAD));
    //  var neck = getPos(body.getPosition(kinectron.NECK));
    //  var spineShoulder = getPos(body.getPosition(kinectron.SPINESHOULDER));
    //  var spineMid = getPos(body.getPosition(kinectron.SPINEMID));
    //  var spineBase = getPos(body.getPosition(kinectron.SPINEBASE));


    //  // Right Arm
    //  var shoulderRight = getPos(body.getPosition(kinectron.SHOULDERRIGHT));
    //  var elbowRight = getPos(body.getPosition(kinectron.ELBOWRIGHT));
    //  var wristRight = getPos(body.getPosition(kinectron.WRISTRIGHT));

    //  // Left Arm
    //  var shoulderLeft = getPos(body.getPosition(kinectron.SHOULDERLEFT));
    //  var elbowLeft = getPos(body.getPosition(kinectron.ELBOWLEFT));
    //  var wristLeft = getPos(body.getPosition(kinectron.WRISTLEFT));

    //  // Right Leg
    //  var hipRight = getPos(body.getPosition(kinectron.HIPRIGHT));
    //  var kneeRight = getPos(body.getPosition(kinectron.KNEERIGHT));
    //  var ankleRight = getPos(body.getPosition(kinectron.ANKLERIGHT));
    //  var footRight = getPos(body.getPosition(kinectron.FOOTRIGHT));

    //  // Left Leg
    //  var hipLeft = getPos(body.getPosition(kinectron.HIPLEFT));
    //  var kneeLeft = getPos(body.getPosition(kinectron.KNEELEFT));
    //  var ankleLeft = getPos(body.getPosition(kinectron.ANKLELEFT));
    //  var footLeft = getPos(body.getPosition(kinectron.FOOTLEFT));

    //  noFill();
    //  stroke(50,160,220);
    //  strokeWeight(1);

    //  // Draw Bust
    //  beginShape();
    //  vertex(head.x, head.y);
    //  vertex(neck.x, neck.y);
    //  vertex(spineShoulder.x, spineShoulder.y);
    //  vertex(spineMid.x, spineMid.y);
    //  vertex(spineBase.x, spineBase.y);
    //  endShape();

    //   // Draw shoulders
    //  line(spineShoulder.x, spineShoulder.y, shoulderRight.x, shoulderRight.y);
    //  line(spineShoulder.x, spineShoulder.y, shoulderLeft.x, shoulderLeft.y);

    // // Draw Right Arm
    //  beginShape();
    //  vertex(shoulderRight.x, shoulderRight.y);
    //  vertex(elbowRight.x, elbowRight.y);
    //  vertex(wristRight.x, wristRight.y);
    //  endShape();

    //  // Draw Left Arm
    //  beginShape();
    //  vertex(shoulderLeft.x, shoulderLeft.y);
    //  vertex(elbowLeft.x, elbowLeft.y);
    //  vertex(wristLeft.x, wristLeft.y);
    //  endShape();

    //  // Draw hips
    //  line(spineBase.x, spineBase.y, hipRight.x, hipRight.y);
    //  line(spineBase.x, spineBase.y, hipLeft.x, hipLeft.y);

    //  // Draw Right Leg
    //  beginShape();
    //  vertex(hipRight.x, hipRight.y);
    //  vertex(kneeRight.x, kneeRight.y);
    //  vertex(ankleRight.x, ankleRight.y);
    //  vertex(footRight.x, footRight.y);
    //  endShape();

    //  // Draw Left Leg
    //  beginShape();
    //  vertex(hipLeft.x, hipLeft.y);
    //  vertex(kneeLeft.x, kneeLeft.y);
    //  vertex(ankleLeft.x, ankleLeft.y);
    //  vertex(footLeft.x, footLeft.y);
    //  endShape();
}





// Scale the data to fit the screen
// Move it to the center of the screen
// Return it as a vector




function keyPressed() {
    fill(255);
    noStroke();
    rect(0, 0, windowWidth, windowHeight);
}
