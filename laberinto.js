  jQuery(document).ready(function($) {
      if (document.querySelector("#juegos-online-single.laberinto")) {
          const startScreen = document.getElementById('start-screen');
          const gameCont = document.querySelectorAll('#labgame');
          const gameYunga = document.querySelector('#labgame.yunga');
          const gameLamini = document.querySelector('#labgame.lamini');
          //Canvas
          const canvasLab = document.getElementById("mazeCanvas");
          const ctx = canvasLab.getContext("2d");
          //initial dimention
          var initialCordonne;
          var cols, rows;
          var widthofCell = 100;
          let space = widthofCell / 5;
          var grid;
          var startPosition = [0, 0];
          var endPosition = [7, 7];
          var player;
          //maze walls width
          var line = 3.14;
          var goal;
          //let goalSize = widthofCell*0.7;
          var started = false;
          const Difficulty = (diffuclty) => {
              switch (diffuclty) {
                  case 100:
                      {
                          startPosition = [0, 0];
                          endPosition = [7, 7];
                          break;
                      }
                  case 80:
                      {
                          startPosition = [0, 0];
                          endPosition = [9, 9];
                          break;
                      }
                  case 50:
                      {
                          startPosition = [0, 0];
                          endPosition = [15, 15];
                          break;
                      }
                  case 40:
                      {
                          startPosition = [0, 0];
                          endPosition = [19, 19];
                          break;
                      }
              }
          };

          function init() {
              ctx.clearRect(0, 0, canvasLab.width, canvasLab.height);
              initialCordonne = 800;
              space = widthofCell / 5;
              goalSize = widthofCell;
              cols = Math.floor(initialCordonne / widthofCell);
              rows = Math.floor(initialCordonne / widthofCell);
              grid = new Grid(rows, cols);
              grid.makeMap();
              //where we start the maze
              grid.currentcell = grid.Map[0][0];
              grid.genMap();
              goal = new Goal(endPosition[0], endPosition[1]);
              player = new Player(startPosition[0], startPosition[1]);
          }

          function Cell(x, y) {
              this.x = x;
              this.y = y;
              this.right = true;
              this.left = true;
              this.top = true;
              this.bottom = true;
              this.visited = false;
              this.drawCell = function() {
                  //Draw Top line
                  if (this.top)
                      drawNewLine(this.x, this.y, this.x + widthofCell, this.y);
                  //draw Right Line
                  if (this.right)
                      drawNewLine(this.x + widthofCell, this.y, this.x + widthofCell, this.y + widthofCell);
                  //draw Left Line
                  if (this.left)
                      drawNewLine(this.x, this.y, this.x, this.y + widthofCell);
                  //draw BottomLine
                  if (this.bottom)
                      drawNewLine(this.x, this.y + widthofCell, this.x + widthofCell, this.y + widthofCell);
              };
          }

          function Grid() {
              this.Map = Array.from(Array(cols), () => new Array(rows));
              this.makeMap = function() {
                  //create the Cells
                  for (let i = 0; i < cols; i++) {
                      for (let j = 0; j < rows; j++) {
                          this.Map[i][j] = new Cell(j * widthofCell, i * widthofCell, );
                      }
                  }
              };
              this.stack = [];
              this.numberVisited = 1;
              this.currentcell = this.Map[0][0];
              this.drawMap = () => {
                  for (let i = 0; i < rows; i++) {
                      for (let j = 0; j < cols; j++) {
                          this.Map[i][j].drawCell();
                      }
                  }
              };
              this.genMap = function() {
                  while (this.numberVisited < (cols * rows)) {
                      this.currentcell.visited = true;
                      let nextCell = this.checkNeighborCells(this.currentcell.x, this.currentcell.y);
                      if (nextCell !== undefined) {
                          nextCell.visited = true;
                          this.numberVisited++;
                          //the backtracking aspect it knows the places where it already went
                          grid.stack.push(this.currentcell);
                          this.currentcell = nextCell;
                      } else {
                          if (this.stack.length > 0) {
                              this.currentcell = this.stack.pop();
                          }
                      }
                  }
                  console.log("Maze Generated!");
              };
              this.checkNeighborCells = (x, y) => {
                  let neighbors = [];
                  if ((y / widthofCell - 1 >= 0) && (!this.Map[y / widthofCell - 1][x / widthofCell].visited)) {
                      neighbors.push([this.Map[y / widthofCell - 1][x / widthofCell], "top"]);
                  }
                  if ((y / widthofCell + 1 < cols) && (!this.Map[y / widthofCell + 1][x / widthofCell].visited)) {
                      neighbors.push([this.Map[y / widthofCell + 1][x / widthofCell], "bottom"]);
                  }
                  if ((x / widthofCell - 1 >= 0) && (!this.Map[y / widthofCell][x / widthofCell - 1].visited)) {
                      neighbors.push([this.Map[y / widthofCell][x / widthofCell - 1], "left"]);
                  }
                  if ((x / widthofCell + 1 < rows) && (!this.Map[y / widthofCell][x / widthofCell + 1].visited)) {
                      neighbors.push([this.Map[y / widthofCell][x / widthofCell + 1], "right"]);
                  }
                  //console.log(neighbors);
                  if (neighbors.length > 0) {
                      let randomneighbor = Math.floor(Math.random() * neighbors.length);
                      let currentDirection = neighbors[randomneighbor][1];
                      switch (currentDirection) {
                          case "top":
                              {
                                  this.currentcell.top = false;
                                  neighbors[randomneighbor][0].bottom = false;
                                  break;
                              }
                          case "right":
                              {
                                  this.currentcell.right = false;
                                  neighbors[randomneighbor][0].left = false;
                                  break;
                              }
                          case "left":
                              {
                                  this.currentcell.left = false;
                                  neighbors[randomneighbor][0].right = false;
                                  break;
                              }
                          case "bottom":
                              {
                                  this.currentcell.bottom = false;
                                  neighbors[randomneighbor][0].top = false;
                                  break;
                              }
                      }
                      return (neighbors[randomneighbor][0]);
                  } else {
                      return (undefined);
                  }
              };
          }

          function Player(x, y) {
              this.x = x * widthofCell + space;
              this.y = y * widthofCell + space;
              this.i = 0;
              this.j = 0;
              //the speed
              this.dx = 8;
              this.dy = 8;
              this.animating = false;
              this.destination = [this.x, this.y];
              this.img = new Image();
              this.img.src = baseUrl + '/wp-content/themes/turismo/images/laberinto/ico-turista-01.png'; // default image


              this.moveUp = function() {
                  if (!grid.Map[this.j][this.i].top && !this.animating) {
                      this.destination = [grid.Map[this.j - 1][this.i].x + space, grid.Map[this.j - 1][this.i].y + space];
                      audioBoop.play();
                  }
                  //checkWin();
              };
              this.moveLeft = function() {
                  if (!grid.Map[this.j][this.i].left && !this.animating) {
                      this.destination = [grid.Map[this.j][this.i - 1].x + space, grid.Map[this.j][this.i - 1].y + space];
                      audioBoop.play();
                  }
                  //checkWin();
              };
              this.moveDown = function() {
                  if (!grid.Map[this.j][this.i].bottom && !this.animating) {
                      this.destination = [grid.Map[this.j + 1][this.i].x + space, grid.Map[this.j + 1][this.i].y + space];
                      audioBoop.play();
                  }
                  //checkWin();
              };
              this.moveRight = function() {
                  {
                      if (!grid.Map[this.j][this.i].right && !this.animating) {
                          this.destination = [grid.Map[this.j][this.i + 1].x + space, grid.Map[this.j][this.i + 1].y + space];
                          audioBoop.play();
                      }
                      //checkWin();
                  }
              };
              this.move = function() {
                  if (Key.isDown(Key.UP)) this.moveUp();
                  if (Key.isDown(Key.LEFT)) this.moveLeft();
                  if (Key.isDown(Key.DOWN)) this.moveDown();
                  if (Key.isDown(Key.RIGHT)) this.moveRight();
              };
              this.draw = function() {
                  this.x = x * widthofCell + space;
                  this.y = y * widthofCell + space;
                  this.draw = () => {
                      ctx.drawImage(this.img, convertCordonne(this.x - 10), convertCordonne(this.y - 10), convertCordonne(goalSize), convertCordonne(goalSize));
                  };
              };
              this.animate = function() {
                  //wigle fix :
                  let testx = (this.destination[0] - this.x);
                  let testy = (this.destination[1] - this.y);
                  let wiggleRoom = {
                      x: 1,
                      y: 0
                  };
                  if (testx < this.dx) {
                      wiggleRoom.x = testx
                  }
                  if (testy < this.dy) {
                      wiggleRoom.y = testy
                  }
                  if (this.x < (this.destination[0] - wiggleRoom.x)) {
                      this.x += this.dx;
                      this.animating = true;
                  } else if (this.x > this.destination[0]) {
                      this.x -= this.dx;
                      this.animating = true;
                  } else if (this.x === (this.destination[0] - wiggleRoom.x)) {
                      this.x = this.destination[0];
                  }
                  if (this.y < (this.destination[1] - wiggleRoom.y)) {
                      this.y += this.dy;
                      this.animating = true;
                  } else if (this.y > this.destination[1]) {
                      this.y -= this.dy;
                      this.animating = true;
                  } else if (this.y === (this.destination[1] - wiggleRoom.y)) {
                      this.y = this.destination[1];
                  }
                  this.i = Math.floor(this.x / widthofCell);
                  this.j = Math.floor(this.y / widthofCell);
                  if (this.x === this.destination[0] && this.y === this.destination[1]) {
                      this.animating = false;
                  }
              };
              this.reset = function() {
                  this.x = x * widthofCell + space;
                  this.y = y * widthofCell + space;
                  this.i = 0;
                  this.j = 0;
                  //the speed
                  this.dx = 8;
                  this.dy = 8;
                  this.animating = false;
                  this.destination = [this.x, this.y];
              }
          }


          function Goal(x, y) {
              this.x = x * widthofCell + space;
              this.y = y * widthofCell + space;
              this.img = new Image();
              this.img.src = baseUrl + '/wp-content/themes/turismo/images/laberinto/ico-flecha.png';
              this.draw = () => {
                  ctx.drawImage(this.img, convertCordonne(this.x - 10), convertCordonne(this.y - 10), convertCordonne(goalSize), convertCordonne(goalSize));
              };
              // Destroy method
              this.destroy = function() {
                  this.x = null;
                  this.y = null;
                  this.width = null;
                  this.height = null;
                  this.drawGoal = null;
              };
          }

          function checkWin() {
              return (player.i === endPosition[0] && player.j === endPosition[1]);
          };
          //our game logic
          function update() {

              player.move();
              player.animate();

          }
          //we Draw Here
          function draw() {
              //draw here
              grid.drawMap();
              goal.draw();

              player.draw();

          }

          function animate() {
              //reset the canvas
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = 'rgba(255, 247, 203, 1)';
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

              update();
              draw();
              // Check if player has won
              if (checkWin()) {

    
                  console.log("you win :D ");
                  setTimeout(() => {
                      // confettiRunning = true; 
                      render();
                      initConfetti();
                      //  $("canvas").hide();
                      audioWin.loop = false;
                      audioWin.play();
                      document.querySelector('.laberinto.success').classList.add("active");
                      // init()
                            if (typeof player !== "undefined") {
              player.reset();
              return;
          }
        //  player = new Player();
                  }, 500);

             
          
  
                  cancelAnimationFrame(animationId);
              } else {
                  animationId = requestAnimationFrame(animate);
              }
          }

          let animationId;

          function cancelAnimation() {
              cancelAnimationFrame(animationId);

          }

          function startAnimation() {

              animationId = requestAnimationFrame(animate);
          }

          //helper Functions
          function convertCordonne(x) {
              return ((ctx.canvas.width / initialCordonne) * x);
          }
          document.getElementById('lamini').addEventListener('click', function() {
              ctx.strokeStyle = '#d76086';
          });
          document.getElementById('yunga').addEventListener('click', function() {
              ctx.strokeStyle = '#432e28';
          });
          document.getElementById('martin').addEventListener('click', function() {
              ctx.strokeStyle = '#902b2a';
          });
          document.getElementById('copla').addEventListener('click', function() {
              ctx.strokeStyle = '#609ad2';
          });
          document.getElementById('qumir').addEventListener('click', function() {
              ctx.strokeStyle = '#879f75';
          });
          document.getElementById('kuntur').addEventListener('click', function() {
              ctx.strokeStyle = '#49558e';
          });
          document.getElementById('vallista').addEventListener('click', function() {
              ctx.strokeStyle = '#9a4b56';
          });

          function drawNewLine(xfrom, yfrom, xto, yto) {
              ctx.beginPath();
              ctx.lineWidth = line;
              ctx.moveTo(convertCordonne(xfrom), convertCordonne(yfrom));
              ctx.lineTo(convertCordonne(xto), convertCordonne(yto));
              ctx.closePath();
              ctx.stroke();
          }

          function changeStrokeStyle() {
              // Update the stroke style
              ctx.strokeStyle = 'red'; // replace 'red' with the desired stroke style
          }
          //resize for the first time on load
          const parentWidth = canvasLab.parentNode.clientWidth;
          const parentHeight = canvasLab.parentNode.clientHeight;
          if (innerHeight < innerWidth) {
              //canvas.style.width  = outerWidth - 100 +"px" ;
              ctx.canvas.width = parentHeight - parentHeight / 100;
              ctx.canvas.height = parentHeight - parentHeight / 100;
              canvasLab.style.height = ctx.canvas.height - 50 + "px";
              canvasLab.style.width = ctx.canvas.width - 50 + "px";
          } else {
              ctx.canvas.width = parentWidth - parentWidth / 100;
              ctx.canvas.height = parentWidth - parentWidth / 100;
              canvasLab.style.height = ctx.canvas.height - 50 + "px";
              canvasLab.style.width = ctx.canvas.width - 50 + "px";
          }
          // resize on resize
          addEventListener('resize', () => {
              if (innerHeight < innerWidth) {
                  //canvas.style.width  = outerWidth - 100 +"px" ;
                  ctx.canvas.width = parentHeight - parentHeight / 100;
                  ctx.canvas.height = parentHeight - parentHeight / 100;
                  canvasLab.style.height = ctx.canvas.height - 50 + "px";
                  canvasLab.style.width = ctx.canvas.width - 50 + "px";
              } else {
                  ctx.canvas.width = parentWidth - parentWidth / 100;
                  ctx.canvas.height = parentWidth - parentWidth / 100;
                  canvasLab.style.height = ctx.canvas.height - 50 + "px";
                  canvasLab.style.width = ctx.canvas.width - 50 + "px";
              }
          });
          //our Keyboard Input
          //helper Object for syc
          const Key = {
              _pressed: {},
              LEFT: 37,
              UP: 38,
              RIGHT: 39,
              DOWN: 40,
              isDown: function(keyCode) {
                  return this._pressed[keyCode];
              },
              onKeydown: function(event) {
                  this._pressed[event.keyCode] = true;
                  audioBoop.play();
              },
              onKeyup: function(event) {
                  delete this._pressed[event.keyCode];
              }
          };
          //hookup the object
          window.addEventListener('keyup', function(event) {
              Key.onKeyup(event);
          }, false);
          window.addEventListener('keydown', function(event) {
              Key.onKeydown(event);
          }, false);

          function startGame(game) {
              startScreen.style.display = 'none';
              game.style.display = 'flex';
              const canvasLab = document.getElementById(game + "mazeCanvas");
          }
          //////////////////////////////////////////////////////////////////////////////////////
          function initMaze() {

              document.querySelector('.laberinto.success').classList.remove("active");
              gameCont.forEach((game) => {
                  game.style.display = 'none';
              });
              startScreen.style.display = 'flex';
              // 40 50 80 100
              widthofCell = parseInt(100);
              Difficulty(widthofCell);

              // Check if a player object already exists

             if (typeof player !== "undefined") {
              player.reset();
              return;
             }
             player = new Player();
          

              $.when(init()).then(animate());
              // cancelAnimation(); 
              // $(".welcome").hide();
              // Create a new player object
     
              //setTimeout(() => {startAnimation(); }, 1500);
              $("#mazeCanvas").show();
              console.log("hi");
              started = true;
          };
          canvasLab.addEventListener("touchstart", function(event) { event.preventDefault() })
          canvasLab.addEventListener("touchmove", function(event) { event.preventDefault() })
          canvasLab.addEventListener("touchend", function(event) { event.preventDefault() })
          canvasLab.addEventListener("touchcancel", function(event) { event.preventDefault() })
          // Swipe / Drag functionality
          canvasLab.addEventListener('touchstart', handleTouchStart, false);
          canvasLab.addEventListener('touchmove', handleTouchMove, false);
          canvasLab.addEventListener('mousedown', handleMouseDown, false);
          canvasLab.addEventListener('mousemove', handleMouseMove, false);
          canvasLab.addEventListener('mouseup', handleMouseUp, false);
          var xDown = null;
          var yDown = null;
          var mouseDown = false;

          function getTouches(evt) {
              return evt.touches || // browser API
                  evt.originalEvent.touches; // jQuery
          }

          function handleTouchStart(evt) {
              const firstTouch = getTouches(evt)[0];
              xDown = firstTouch.clientX;
              yDown = firstTouch.clientY;
          };

          function handleMouseDown(evt) {
              xDown = evt.clientX;
              yDown = evt.clientY;
              mouseDown = true;
          }

          function handleTouchMove(evt) {
              if (!xDown || !yDown) {
                  return;
              }
              var xUp = evt.touches[0].clientX;
              var yUp = evt.touches[0].clientY;
              handleSwipe(xUp, yUp);
          }

          function handleMouseMove(evt) {
              if (!mouseDown) {
                  return;
              }
              var xUp = evt.clientX;
              var yUp = evt.clientY;
              handleSwipe(xUp, yUp);
          }

          function handleSwipe(xUp, yUp) {
              var xDiff = xDown - xUp;
              var yDiff = yDown - yUp;
              if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
                  if (xDiff > 0) {
                      /* left swipe / drag */
                      player.moveLeft();
                  } else {
                      /* right swipe / drag */
                      player.moveRight();
                  }
              } else {
                  if (yDiff > 0) {
                      /* up swipe / drag */
                      player.moveUp();
                  } else {
                      /* down swipe / drag */
                      player.moveDown();
                  }
              }
              /* reset values */
              xDown = null;
              yDown = null;
              mouseDown = false;
          }

          function handleMouseUp(evt) {
              mouseDown = false;
          }
          document.querySelector(".botones-container .arriba").addEventListener('click', () => {
              player.moveUp();
          });
          document.querySelector(".botones-container .izq").addEventListener('click', () => {
              player.moveLeft();
          });
          document.querySelector(".botones-container .der").addEventListener('click', () => {
              player.moveRight();
          });
          document.querySelector(".botones-container .abajo").addEventListener('click', () => {
              player.moveDown();
          });
          window.addEventListener('keydown', function(event) {
              if (event.keyCode === 40) {
                  event.preventDefault();
                  return false;
              }
              if (event.keyCode === 38) {
                  event.preventDefault();
                  return false;
              }
          });
          window.addEventListener('keyup', function(event) {
              if (event.keyCode === 40) {
                  event.preventDefault();
                  return false;
              }
              if (event.keyCode === 38) {
                  event.preventDefault();
                  return false;
              }
          });
          initMaze();
          //////////////////////////////////////

          document.querySelector(".cerrar-laberinto").addEventListener('click', () => {
              document.querySelector('.laberinto.success').classList.remove("active");
              initMaze();
          });
          document.querySelectorAll(".pie .boton").forEach(el => {
              el.addEventListener('click', function(e) {
                  initMaze();
              });
          });

          // add event listeners to the buttons
          button1 = $('#start-screen #yunga');
          button1.click(function() {
              $('#mazeCanvas').appendTo('#labgame.yunga .maze');
              $('.botones-container').appendTo('#labgame.yunga .botonera');
              initMaze();
              changeStrokeStyle();
              const newPlayerImg = new Image();
              newPlayerImg.src = baseUrl + '/wp-content/themes/turismo/images/laberinto/ico-turista-02.png';
              player.img = newPlayerImg;
              startGame(gameYunga);
          });
          // add event listeners to the buttons
          button1 = $('#start-screen #lamini');
          button1.click(function() {
              $('#mazeCanvas').appendTo('#labgame.lamini .maze');
              $('.botones-container').appendTo('#labgame.lamini .botonera');
              initMaze();
              startGame(gameLamini)
          });

      } ///
  });