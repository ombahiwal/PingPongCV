var KEY = { UP: 38, DOWN: 40, W: 87, S: 83 };
var pressedKeys = [];
var ball = { speed: 3, x: 290, y: 140, directionX: 1, directionY: 1 };
var pauseBall = false;
var soundPing = document.getElementById("bounceLeft");
var soundBom = document.getElementById("bounceWall");
var soundPong = document.getElementById("bounceRight");
var scoreA = 0;
var scoreB = 0;
var scoreBoardA=document.getElementById("scoreA");
var scoreBoardB=document.getElementById("scoreB");
var winner = document.getElementById("winner");
var xcoord = 0;
var ycoord = 0;

window.onload = function() {
      var video = document.getElementById('video');
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
        var test = document.getElementById("status");
      var tracker = new tracking.ColorTracker();
        
        
        
      tracking.track('#video', tracker, { camera: true });

        tracking.ColorTracker.registerColor('green', function(r, g, b) {
  if (r < 50 && g > 200 && b < 50) {
    return true;
  }
  return false;
});
      tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function(rect) {
          if (rect.color === 'custom') {
            rect.color = tracker.customColor;
          }

          context.strokeStyle = rect.color;
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          context.font = '11px Helvetica';
          context.fillStyle = "#fff";
          context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
            test.innerHTML = "stats color="+rect.color+" x= "+rect.x+" y="+rect.y;
            xcoord = rect.x;
            ycoord = rect.y;
            
        });
      });

     initGUIControllers(tracker);
    };

scoreBoardA.innerHTML = "PlayerA = "+scoreA+" ";
scoreBoardB.innerHTML = "PlayerB = "+scoreB;
//var canvas = document.getElementById("canvas_parent").getContext("2d");

setInterval(function(){ ball.speed += 1;  }, 1000*20);

$(function() {

	// Store in buffer keyboard events
	$(document).keydown(function(e) {
		pressedKeys[e.which] = true;
	});
	$(document).keyup(function(e) {
		pressedKeys[e.which] = false;
	});
    

	// Set main loop to be called on the desired frame rate
	setInterval(gameLoop, 1000/80);
});

// Main loop of the game
function gameLoop() {
	moveBall();
	movePaddles();
    scoreKeeper();

}

//Score keeper
function scoreKeeper(){
    if(scoreA == 20 || scoreB == 20){
        /*pauseBall = true;
        if(scoreA > scoreB){
            winner.innerHTML = "Player-A Wins!!";
        }else if(scoreA<scoreB){
                 winner.innerHTML = "Player-B Wins!!";
        }else{
            winner.innerHTML = "Its a Tie!!";
        }*/
    pauseBall = true;
    winner.innerHTML = "You Loose!!";
    }
    
}

// Control movement of paddles based on keyboard events
function movePaddles() {
	// Paddle Speed
    var paddleSpeed = 15;
    //Image Move Paddles
    
    
    if (ycoord <=275) {
		// Move the paddles up
		var top = parseInt($("#paddleA").css("top"));
		if (top >= -parseInt($("#paddleA").css("height"))/2) {
			$("#paddleA").css("top", top - paddleSpeed);
		}
        var top = parseInt($("#paddleB").css("top"));
		if (top >= -parseInt($("#paddleB").css("height"))/2) {
			$("#paddleB").css("top", top - paddleSpeed);
		}
	}

	if (ycoord >=125) {
		// Move the paddles down
		var top = parseInt($("#paddleB").css("top"));
		if (top <= (parseInt($("#game").css("height")) - (parseInt($("#paddleB").css("height")))/2)) {
			$("#paddleB").css("top", top + paddleSpeed);
		} 
        var top = parseInt($("#paddleA").css("top"));
		if (top <= (parseInt($("#game").css("height")) - (parseInt($("#paddleA").css("height")))/2)) {
			$("#paddleA").css("top", top + paddleSpeed);
		}
	}
    
    
var paddleSpeed=8;
    
    //End Image Move Paddles
	// Check keyboard events
	if (pressedKeys[KEY.W]) {
		// Move the paddle A up
		var top = parseInt($("#paddleA").css("top"));
		if (top >= -parseInt($("#paddleA").css("height"))/2) {
			$("#paddleA").css("top", top - paddleSpeed);
		}
	}
	if (pressedKeys[KEY.S]) {
		// Move the paddle B down
		var top = parseInt($("#paddleA").css("top"));
		if (top <= (parseInt($("#game").css("height")) - (parseInt($("#paddleA").css("height")))/2)) {
			$("#paddleA").css("top", top + paddleSpeed);
		}
	}
	if (pressedKeys[KEY.UP]) {
		// Move the paddle B up
		var top = parseInt($("#paddleB").css("top"));
		if (top >= -parseInt($("#paddleB").css("height"))/2) {
			$("#paddleB").css("top", top - paddleSpeed);
		}
	}
	if (pressedKeys[KEY.DOWN]) {
		// Move the paddle B down
		var top = parseInt($("#paddleB").css("top"));
		if (top <= (parseInt($("#game").css("height")) - (parseInt($("#paddleB").css("height")))/2)) {
			$("#paddleB").css("top", top + paddleSpeed);
		}
	}
}

// Control movement of the ball doing collision checking
function moveBall() {
	var gameWidth = parseInt($("#game").width());
	var gameHeight = parseInt($("#game").height());

	if (pauseBall) return;

	// Check collision to the bottom border and change the moving orientation on Y axis
	if (ball.y + ball.speed * ball.directionY > (gameHeight - parseInt($("#ball").height()))) {
            soundBom.play();
		ball.directionY = -1
        
	}
	
	// Check collision to the top border and change the moving orientation on Y axis
	if (ball.y + ball.speed * ball.directionY < 0) {
        soundBom.play();
		ball.directionY = 1
	}
	
	// Check collision to the right border and re-initialize ball position
	if (ball.x + ball.speed * ball.directionX > gameWidth ) {
		ball.x = gameWidth /2;
		ball.y = gameHeight/2;

		pauseBall = true;
		$("#ball").animate({ "left": ball.x, "top": ball.y }, 2000, function() { pauseBall = false; });
		ball.directionX = -1;
        soundBom.play();
        scoreA +=1;
        scoreBoardA.innerHTML = "PlayerA = "+scoreA;
        
		return;
	}

	// Check collision to the left border and re-initialize ball position
	if (ball.x + ball.speed * ball.directionX < 0) {
		ball.x = gameWidth /2;
		ball.y = gameHeight/2;
		pauseBall = true;
		$("#ball").animate({ "left": ball.x, "top": ball.y }, 2000, function() { pauseBall = false; });
		ball.directionX = 1;
        soundBom.play();
        scoreB += 1;
        scoreBoardB.innerHTML = "PlayerB = "+scoreB;
		return;
	}

	// Update ball position on X and Y axes based on speed and orientation
	ball.x += ball.speed * ball.directionX;
	ball.y += ball.speed * ball.directionY;

	// Check collision to the paddle A and change the moving orientation on X axis
	var paddleAX = parseInt($("#paddleA").css("left")) + parseInt($("#paddleA").css("width"));
	if (ball.x + ball.speed * ball.directionX < paddleAX) {
		var paddleAYBottom = parseInt($("#paddleA").css("top")) + parseInt($("#paddleA").css("height"));
		var paddleAYTop = parseInt($("#paddleA").css("top"));

		if ((ball.y + ball.speed * ball.directionY <= paddleAYBottom) && (ball.y + ball.speed * ball.directionY >= paddleAYTop)) {
                        soundPing.play();

			ball.directionX = 1
		}
	}

	// Check collision to the paddle B and change the moving orientation on X axis
	var paddleBX = parseInt($("#paddleB").css("left")) - parseInt($("#paddleB").css("width"));
	if (ball.x + ball.speed * ball.directionX >= paddleBX) {
        
		var paddleBYBottom = parseInt($("#paddleB").css("top")) + parseInt($("#paddleB").css("height"));
		var paddleBYTop = parseInt($("#paddleB").css("top"));

		if ((ball.y + ball.speed * ball.directionY <= paddleBYBottom) && (ball.y + ball.speed * ball.directionY >= paddleBYTop)) {
            soundPong.play();
            
			ball.directionX = -1
		}
	}

	// Render the updated ball position
	$("#ball").css({ "left": ball.x, "top": ball.y });
}
