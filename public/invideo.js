/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("sketch started");

var debug = true;

var mode = 1;
var speed = 1;
var connect = false;

var danceTime = 0;
var maxDance = 30 * 12;


var thrillerVid;
var playingVideo = false;

// Declare kinectron
var kinectron = null;

// Managing kinect bodies
var bm = new BodyManager();
var DEATH_TH = 3000;

var skelColor = "rgba(137,35,253,1)";
var skelAction = "rgba(217,124,238,"
var boneWeight = 10;

// Mapping Kinect data to projecion
var scvar, xscl, yscl;
var xshift, yshift;
var scl = true;

// variables for saving
var oldSkeleton = [];
var oldJointsNum = 60;
var allOldSkels = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    background(0);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron(inVideoIP);  // use the camera here
    // Connect with application over peer
    kinectron.makeConnection();
    // Set individual frame callbacks for KINECT 1
    kinectron.setBodiesCallback(bodyCallback);
    kinectron.startMultiFrame(["body"]);

    thrillerVid = createVideo('thriller.mp4');
    thrillerVid.hide();
    thrillerVid.play();
    thrillerVid.loop();

    scvar = 0.45;
    xscl = (width / 2) * scvar;
    yscl = -(width / 2) * scvar;
    xshift = width / 2;
    yshift = height / 2 - 75;


    // populate 2D array
    oldSkeleton["head"] = [];
    oldSkeleton["leftwrist"] = [];
    oldSkeleton["rightwrist"] = [];
    oldSkeleton["leftfoot"] = [];
    oldSkeleton["rightfoot"] = [];

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
    // only do this if bm is empty

    if (bm.getBodies().length == 0) {
        console.log("new body");
        bm.add(body);
    } else if (bm.getBodies().length > 0) {
        // Otherwise, update it
        if (bm.contains(id)) {
            bm.update(body)
        }
        else {
            // disregard this extra body
        };
    }
}



function draw() {
  var vidHeight = windowWidth / 654 * 480;
  image(thrillerVid,0,0,windowWidth,vidHeight);

  // if (!playingVideo) {
  //
  //     thrillerVid.style("visibility", "visible");
  //     thrillerVid.style("position", "absolute");
  //     thrillerVid.style("top", "0");
  //     thrillerVid.style("width", windowWidth + "px");
  //     thrillerVid.style("height", vidHeight + "px");
  //     thrillerVid.loop();
  //     playingVideo = true;
  // }

    // save the old skeletons
    if (mode == 1) {
        var bodies = bm.getBodies();
        if (bodies.length != 0) {
            var body = bodies[0];
            saveBodyPoints(body);
        }
    }

    // manage the different screens
    switch (mode) {
        case (1): // LIVE INSTRUCTION

            if (bm.getBodies().length > 0) {

                if (danceTime < maxDance) {
                    danceTime++;
                } else {
                    danceTime = 0;

                    // expose the performer and audience
                    // $.ajax({
                    //     url: "http://" + localIP + "/expose",
                    //     dataType: 'json',
                    //     success: function(data) {
                    //         fill(0);
                    //         noStroke(0);
                    //         rect(0, 0, windowWidth, windowHeight);
                    //         exposed = !exposed;
                    //         console.log("say hello to your audience");
                    //         // switch to audience camera
                    //         mode = 2;
                    //     },
                    //     error: function() {
                    //         alert("error");
                    //     },
                    // });
                }
            }
            drawSkeleton();
            break;
        case (2): // audience
            //keep track of timing
            if (exposedTime < maxExposure) {
                exposedTime++;
            } else {
                exposedTime = 0;
                // go back to dancing
                mode = 1;

                // $.ajax({
                //     url: "http://" + localIP + "/hide",
                //     dataType: 'json',
                //     success: function(data) {
                //         // do nothing
                //     },
                //     error: function() {
                //         alert("error");
                //     },
                // });
            }
            break;
    }

    if (debug) {
        textSize(16);
        fill(255);
        noStroke();
        //text("screen (s): " + screenMode, 20, 20);
    }
}

function saveBodyPoints(body) {
  // save only the particular joints
  oldSkeleton["head"].push(getPos(body.getPosition(kinectron.HEAD)));
  if (oldSkeleton["head"].length > oldJointsNum) {
      oldSkeleton["head"].shift();
  }
  oldSkeleton["leftwrist"].push(getPos(body.getPosition(kinectron.WRISTLEFT)));
  if (oldSkeleton["leftwrist"].length > oldJointsNum) {
      oldSkeleton["leftwrist"].shift();
  }
  oldSkeleton["rightwrist"].push(getPos(body.getPosition(kinectron.WRISTRIGHT)));
  if (oldSkeleton["rightwrist"].length > oldJointsNum) {
      oldSkeleton["rightwrist"].shift();
  }

  oldSkeleton["leftfoot"].push(getPos(body.getPosition(kinectron.ANKLELEFT)));
  if (oldSkeleton["leftfoot"].length > oldJointsNum) {
      oldSkeleton["leftfoot"].shift();
  }

  oldSkeleton["rightfoot"].push(getPos(body.getPosition(kinectron.ANKLERIGHT)));
  if (oldSkeleton["rightfoot"].length > oldJointsNum) {
      oldSkeleton["rightfoot"].shift();
  }
}
