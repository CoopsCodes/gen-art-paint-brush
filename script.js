/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 0.2;
// ctx.globalCompositeOperation = "lighten"; //=> watercolour
// ctx.globalCompositeOperation = "destination-over"; //=> reverse

let drawing = false;

class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    this.maxSize = Math.random() * 7 + 5;
    this.size = Math.random() * 1 + 2;
    this.vs = Math.random() * 0.2 + 0.05; //=> velocity of size
    this.angleX = Math.random() * 6.2;
    this.vaX = Math.random() * 0.6 - 0.3; //=> velocity of angle
    this.angleY = Math.random() * 6.2;
    this.vaY = Math.random() * 0.6 - 0.3; //=> velocity of angle
    this.lightness = 10;
    this.hue = 0;
  }

  update() {
    this.x += this.speedX + Math.sin(this.angleX);
    this.y += this.speedY + Math.sin(this.angleY);
    this.size += this.vs;
    this.angleX += this.vaX;
    this.angleY += this.vaY;

    if (this.lightness < 70) this.lightness += 0.5;

    if (this.hue < 259) {
      this.hue += 1;
    } else {
      this.hue = 0;
    }

    if (this.size < this.maxSize) {
      ctx.beginPath();

      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.lightness}%)`;
      ctx.fill();
      ctx.stroke();
      requestAnimationFrame(this.update.bind(this));
    } else {
      const flower = new Flower(this.x, this.y, this.size);
      flower.grow();
    }
  }
}

class Flower {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vs = Math.random() * 0.3 + 0.2; //=> velocity of size
    this.maxFlowerSize = this.size + Math.random() * 100;
    this.image = new Image();
    this.image.src = "flower.png";
    this.size > 11.5 ? (this.willFlower = true) : (this.willFlower = false);
    this.angle = 0;
    this.va = Math.random() * 0.09 - 0.025;
  }

  grow() {
    if (this.size < this.maxFlowerSize && this.willFlower) {
      this.size += this.vs;
      this.angle += this.va;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(
        this.image,
        0 - this.size / 2,
        0 - this.size / 2,
        this.size,
        this.size
      );
      ctx.restore();
      //=> this it some recursion fuckery that keeps calling itself until the if statement is satisfied
      requestAnimationFrame(this.grow.bind(this));
    }
  }
}

window.addEventListener("mousemove", function (e) {
  if (drawing) {
    for (let i = 0; i < 3; i++) {
      const root = new Root(e.x, e.y);
      root.update();
    }
  }
});

window.addEventListener("mousedown", function (e) {
  drawing = true;
  if (drawing) {
    for (let i = 0; i < 30; i++) {
      const root = new Root(e.x, e.y);
      root.update();
    }
  }
});

window.addEventListener("mouseup", function () {
  drawing = false;
});

//=> implement touch controls
// window.addEventListener("touchstart", function (e) {
//   drawing = true;
//   if (drawing) {
//     for (let i = 0; i < 30; i++) {
//       const root = new Root(e.x, e.y);
//       root.update();
//     }
//   }
// });

// window.addEventListener("touchmove", function (e) {
//   if (e.touches) {
//     for (let i = 0; i < 30; i++) {
//       const root = new Root(e.x, e.y);
//       root.update();
//     }
//   }
// });
