/*
Stephanie Koltun
Accumulation of Movement
*/

console.log("mj");


var thrillerVid;
var playing = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    // Create video
    thrillerVid = createVideo('thriller.mp4');
    thrillerVid.style("visibility", "hidden");
}



function draw() {
  if (!playing) {
      var vidHeight = windowWidth / 654 * 480;
      thrillerVid.style("visibility", "visible");
      thrillerVid.style("position", "absolute");
      thrillerVid.style("top", "0");
      thrillerVid.style("width", windowWidth + "px");
      thrillerVid.style("height", vidHeight + "px");
      thrillerVid.loop();
      playing = true;
  }
}
