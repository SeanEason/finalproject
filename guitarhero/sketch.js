let song;
let buttons = [];
let notes = [];
let score = 0;
let bpm = 152; // Blue Bird Naruto Opening BPM
let serial;


// fill in the name of your serial port here:
//copy this from the serial control app
var portName = "/dev/tty.usbmodem14201";

//this array will hold transmitted data
var inMessage = "0";


function preload() {
  song = loadSound('bb.mp3');
}

function setup() {
  console.log(notes);
  createCanvas(500, 200);
  
 
  serial = new p5.SerialPort();
  serial.open('/dev/tty.usbmodem14201'); 
  
  // serial.list();
  
  serial.on('data',gotData);
  // serial.on('list', gotList);

  buttons.push(new GameButton(100, height / 1.2, 'A'));
  buttons.push(new GameButton(200, height / 1.2, 'S'));
  buttons.push(new GameButton(300, height / 1.2, 'D'));
  buttons.push(new GameButton(400, height / 1.2, 'F'));

  for (let i = 0; i < 4; i++) {
    notes[i] = new Note();
  }

  song.play();
  frameRate(60);
}

// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

function gotData() {
  var currentString = serial.readLine();  // read the incoming data
  trim(currentString);                    // trim off trailing whitespace
  if (!currentString) return;             // if the incoming string is empty, do no more
  // console.log(currentString);
      inMessage = currentString;   // save the currentString to use for the text
}


function draw() {
  // inMessage = "0";
  background(255);

  // Draw buttons
  for (let button of buttons) {
    button.display();
  }

  // Draw notes
  for (let i = notes.length - 1; i >= 0; i--) {
    notes[i].display();
    notes[i].move();
  
    //Correct note
    let noteHit = false;
    for (let button of buttons) {
      if (notes[i].checkHit(button) && notes[i].isActive() && button.isPressed()) {
        score += 1; // Increase the score for hitting a note
        notes[i].deactivate();
        noteHit = true;
      }
      if (notes[i].checkHit(button) && notes[i].isActive() && notes[i].x == 100 && inMessage == "A"){
        score += 1; // Increase the score for hitting a note
        notes[i].deactivate();
        noteHit = true;
          }
      
      if (notes[i].checkHit(button) && notes[i].isActive() && notes[i].x == 200 && inMessage == "S"){
        score += 1; // Increase the score for hitting a note
        notes[i].deactivate();
        noteHit = true;
          }
      
      if (notes[i].checkHit(button) && notes[i].isActive() && notes[i].x == 300 && inMessage == "D"){
        score += 1; // Increase the score for hitting a note
        notes[i].deactivate();
        noteHit = true;
          }
      
      if (notes[i].checkHit(button) && notes[i].isActive() && notes[i].x == 400 && inMessage == "F"){
        score += 1; // Increase the score for hitting a note
        notes[i].deactivate();
        noteHit = true;
          }
    }
    
    // if (notes[0].y > 100 && notes[0].y < 200 && inMessage == "A"){
    //           score += 1; // Increase the score for hitting a note
    //     notes[0].deactivate();
    //     noteHit = true;
    // }
    
    // if (notes[0].isActive){
    //   console.log("pressA");
    // }
     // Penalty for missing notes
    if (!noteHit && notes[i].isActive() && notes[i].y > height) {
      score -= 1; // Penalize for missing a note
      notes[i].deactivate();
    }

    // Remove notes that are off-screen
    if (notes[i].y > height) {
      notes.splice(i, 1);

      // Create a new note when one is removed
      let note = new Note();
      notes.push(note);
    }
  }

  // Display score
  fill(0);
  textSize(24);
  text('Score: ' + score, 20, 30);

  // Check for new notes based on music beats
  if (song.isPlaying() && frameCount % calculateFrameFromBPM(bpm) === 0) {
    console.log('Creating note');
    let note = new Note();
    notes.push(note);
  }

  // Check if the song has finished playing
  if (!song.isPlaying()) {
    noLoop(); // Stop the game loop
    console.log('Game Over');
  }
}





class GameButton {
  constructor(x, y, key) {
    this.x = x;
    this.y = y;
    this.key = key;
    this.size = 50;
    this.active = false;
  }

  display() {
    fill(this.active ? 'green' : 'white');
    ellipse(this.x, this.y, this.size, this.size);
    fill(0);
    textSize(20);
    text(this.key, this.x - 8, this.y + 8);
  }

  isPressed() {
    return keyIsDown(this.key.charCodeAt(0));
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  isActive() {
    return this.active;
  }
}

class Note {
  constructor() {
     let buttonIndex = floor(random(0, 4));
    
    this.x = buttons[buttonIndex].x;
    this.y = 0;
    this.speed = 3;
    this.size = 30;
    this.active = true;
  }

  move() {
    this.y += this.speed;
  }

  display() {
    fill(this.active ? 'red' : 'green');
    ellipse(this.x, this.y, this.size, this.size);
  }

  checkHit(button) {
    return dist(this.x, this.y, button.x, button.y) < this.size / 1.5;
  }

  deactivate() {
    this.active = false;
  }

  isActive() {
    return this.active;
  }
}

function calculateFrameFromBPM(bpm) {
  // Calculate frames per beat based on BPM
  let beatsPerSecond = bpm / 60;
  let framesPerBeat = 120 / beatsPerSecond;
  return framesPerBeat;
}

