/* ------ MJ FUNCTIONS ------ */

var ankLeftArray = thriller.ankleleft.slice(0);
var ankRightArray = thriller.ankleright.slice(0);
var headArray = thriller.head.slice(0);
var wristLeftArray = thriller.wristleft.slice(0);
var wristRightArray = thriller.wristright.slice(0);


function getMJpos(joint) {
    return createVector((joint.x * mjxscl) + mjxshift, (joint.y * mjyscl) + mjyshift);
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


    // draw LINES between joints
    switch (mode) {
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
    line(hipLeft.x, hipLeft.y, hipRight.x, hipRight.y);
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
