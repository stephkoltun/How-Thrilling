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
        stroke(40, 70, 170);
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
