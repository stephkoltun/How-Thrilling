// Scale the data to fit the screen
// Move it to the center of the screen
// Return it as a vector
function getPos(joint) {
    return createVector((joint.x * xscl) + xshift, (joint.y * yscl) + yshift);
}

function drawSkeleton(maxSkeletons, boneColors) {

    var bodies = bm.getBodies();
    var drawEllipse = false;

    if (bodies.length != 0) {
        for (var b = 0; b < maxSkeletons; b++) {
            var body = bodies[b];

            // draw LINES between joints
            noFill();
            stroke(boneColors[b]);
            strokeWeight(boneWeight);

            // loop through each joint
            for (var j = 0; j < body.joints.length; j++) {

                var pos = getPos(body.getPosition(j));

                switch (j) {
                    case 2: // neck to head
                        line(pos.x, pos.y, getPos(body.getPosition(3)).x, getPos(body.getPosition(3)).y);
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

            if (drawEllipse) {
              var r = 20;
              var curpos;
              switch (correctJoints) {
                  case (1):
                      curpos = getPos(body.getPosition(kinectron.ANKLELEFT));
                      break;
                  case (0):
                      curpos = getPos(body.getPosition(kinectron.ANKLERIGHT));
                      break;
                  case (2):
                      curpos = getPos(body.getPosition(kinectron.WRISTRIGHT));
                      break;
                  case (3):
                      curpos = getPos(body.getPosition(kinectron.WRISTLEFT));
                      break;
                  case (4):
                      curpos = getPos(body.getPosition(3));
                      break;
              }
              fill(skelColor);
              noStroke();
              ellipse(curpos.x, curpos.y, r, r);
            }
        }
    }

}
