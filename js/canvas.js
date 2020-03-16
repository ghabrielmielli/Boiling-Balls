
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#78C0A8', '#5E412F', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Ball {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color

    this.mass = radius * 0.1;

    this.velocity = {
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 3
    }

    this.gravity = 0.06;
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    //Impulses the ball if it touches the ground
    if (this.y + this.radius >= innerHeight){
      this.velocity.y = Math.random() * 4 + 0.1;
    }
    else{
      this.velocity.y += this.gravity;
    }

    this.restrictToCanvas();

    for (var i = 0; i < balls.length; i++){
      if (this === balls[i]) continue;
      if (distance(this.x, this.y, balls[i].x, balls[i].y) - (this.radius + balls[i].radius) * 0.7 < 0){
        resolveCollision(this, balls[i]);
      }
    }


    this.draw()
  }

  restrictToCanvas(){
    //Swap the velocity on colision
    if(this.x - this.radius < 0 || this.x + this.radius > innerWidth){
      this.velocity.x = - this.velocity.x;
    }
    if(this.y - this.radius < 0 || this.y + this.radius > innerHeight){
      this.velocity.y = - this.velocity.y;
    }

    //Debug 'eternal colision'
    if (this.x - this.radius < 0){
      this.x = this.radius;
    }
    else if(this.x + this.radius > innerWidth){
      this.x = innerWidth - this.radius;
    }

    if (this.y - this.radius < 0){
      this.y = this. radius;
    }
    else if (this.y + this.radius > innerHeight){
      this.y = innerHeight - this.radius;
    }
  }
}

var title = {
  title: "Boiling Balls",
  subtitle: "by: Ghabriel Mielli",
  draw: () => {
      c.save();

      c.translate(canvas.width / 2, canvas.height / 2);
      c.textAlign = "center";
      c.textBaseline = "middle";

      c.fillStyle = "rgba(101, 101, 231, 0.4)";
      c.font = "90px Corben";
      c.fillText(title.title, 0, -50);
      c.font = "20px Corben";
      c.fillText(title.subtitle, 0, 40);
      c.restore();
  }
}


// Implementation
var balls, x, y, radius, color;
function init() {
  balls = [];

  for (var i = 0; i < 50; i++) {
    radius = Math.random() * 30 + 10;
    x = randomIntFromRange(radius, innerWidth - radius)
    y = randomIntFromRange(radius, innerHeight - radius)
    
    if (i > 0){
      for(var i = 0; i < balls.length; i++) {
        if (distance(x, y, balls[i].x, balls[i].y) - (radius + balls[i].radius) < 0){
          radius = Math.random() * 30 + 10;
          x = randomIntFromRange(radius, innerWidth - radius);
          y = randomIntFromRange(radius, innerHeight - radius);
          i = -1;
        }
      };
    }

    balls.push(new Ball(
      x,
      y,
      radius,
      colors[randomIntFromRange(0, 3)]
    ));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
   balls.forEach(ball => {
    ball.update();
   })
  title.draw();
}

init()
animate()
