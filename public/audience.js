/*
Stephanie Koltun
Accumulation of Movement
*/


// Declare kinectron
var kinectron = null;

function setup() {
    createCanvas(windowWidth, windowHeight);

    frameRate(30);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron(IPaudience);

    // Connect with application over peer
    kinectron.makeConnection();

    // Set individual frame callbacks for KINECT 1
    kinectron.setColorCallback(audienceCallback);



    background(0);

}


function audienceCallback(img) {
        var mapheight = (540 / 960) * windowWidth;

        loadImage(img.src, function(loadedImage) {
            image(loadedImage, 0, 0, windowWidth, mapheight);
        });
}


