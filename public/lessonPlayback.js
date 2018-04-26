// Declare kinectron
var kinectron = null;

const saveForSeconds = 10;
const maxFramesToSave = 30*saveForSeconds;
var savedFrames = [];
var playbackFrame = 0;  // tracking number

var timingSwitch = saveForSeconds;

var currentImage;

var live = true;
// const widthRatio = $(window).width / $(window).height;
// const mapheight = 540*widthRatio;
// const heightRatio = $(window).height / $(window).width;
// const mapwidth = 960*heightRatio;

var song;
var thrillerCutout;

function preload() {
  song = loadSound('assets/thriller.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    // KINECTRON SETUP
    // Define and create an instance of kinectron
    kinectron = new Kinectron("dancing",
    {
      "host": "sk6385.itp.io",
      "port": "9000",
      "path": "/peerjs",
      "secure":"true"
    });

    // Connect with application over peer
    kinectron.makeConnection();
    // Set individual frame callbacks for KINECT 1
    kinectron.setColorCallback(rgbCallback);

    background(0);

    thrillerCutout = createVideo('assets/thriller-cutout.mp4');
    thrillerCutout.hide();
    thrillerCutout.loop();

    //song.play();
    //song.jump(71);
}

function draw() {
  if (live) {
    if (currentImage != null) {

      image(currentImage, 0, 0, windowWidth, windowHeight);
      //var crop = thrillerCutout.get(250,100,100,350);
      //image(crop,250,400,100,350);
      thrillerCutout.loadPixels();


      for (var i = 0; i < thrillerCutout.pixels.length; i += 4) {
        var r = thrillerCutout.pixels[i];
        var g = thrillerCutout.pixels[i+1];
        var b = thrillerCutout.pixels[i+2];

        var total = r+g+b;

        if (total < 15) {
          thrillerCutout.pixels[i+3] = 0;
        }
      }
      thrillerCutout.updatePixels();

      image(thrillerCutout,-250, -150, windowWidth*1.15, windowHeight*1.15);
    }
  } else {
    //image(savedFrames[playbackFrame], 0, 0, windowWidth, mapheight);
    image(savedFrames[playbackFrame], 0, 0, windowWidth, windowHeight);

    // var now = floor(Date.now()/1000)
    // if (now % timingSwitch == 0) {
    //   console.log("change");
    //   live = true;
    //   //song.jump(71);
    //   savedFrames = [];
    //   playbackFrame = 0;
    // } else {
    //   if (playbackFrame < savedFrames.length-1) {
    //     playbackFrame++;
    //   } else {
    //     playbackFrame = 0;
    //   }
    // }

    if (playbackFrame < savedFrames.length-1) {
      if (frameCount % 3 == 0) {
        playbackFrame++;
      }



    } else {
      live = true;
      clear();
      //song.jump(71);
      // reset tracking
      playbackFrame = 0;
      // empty array
      savedFrames = [];
    }
  }
}

function rgbCallback(img) {
    loadImage(img.src, function(loadedImage) {
        currentImage = loadedImage;
        if (live) {
          savedFrames.push(loadedImage);
          // if (Date.now() % timingSwitch == 0) {
          //   live = false;
          //   //song.jump(71);
          // }
          if (savedFrames.length == maxFramesToSave) {
            live = false;
            //song.jump(71);
          }
        }
    });
}
