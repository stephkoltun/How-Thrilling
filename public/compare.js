var correctThreshold = 10;

function compareJoint(skeljoint, mjjoint) {
    // need to map MJs joints
    var mjx = 0;
    var mjy = 0;
    for (var j = 0; j < mjjoint.length; j++) {
        var mjPos = getMJpos(mjjoint[j]);
        mjx += mjPos.x;
        mjy += mjPos.y;
    }
    var avgMjX = round(mjx / mjjoint.length);
    var avgMjY = round(mjy / mjjoint.length);


    // skelJoints are mapped already
    var xtotal = 0;
    var ytotal = 0;
    for (var i = 0; i < skeljoint.length; i++) {
        xtotal += skeljoint[i].x;
        ytotal += skeljoint[i].y;
    }
    var avgSkelX = round(xtotal / skeljoint.length);
    var avgSkelY = round(ytotal / skeljoint.length);

    var compareX = abs(avgMjX - avgSkelX);
    var compareY = abs(avgMjY - avgSkelY);

    if ((compareX < correctThreshold) &&  (compareY < correctThreshold)) {
        if (correctJoints < 4) {
            correctJoints++;
            attempts = 0;
        } else {
        	// reset
        	correctJoints = 0;
        	exposed = true;
        }
    };
}
