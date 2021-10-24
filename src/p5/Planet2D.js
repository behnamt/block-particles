class PlanetBody {
  constructor({ p, radius, distance, parent, emission, color, theta = 1, speed = 1, planet = false, tailLength = 10 }) {
    this.p = p;
    this.color = color;
    this.radius = radius;
    this.speed = speed;
    this.distance = distance;
    this.orbitLength = distance * 2 * this.p.PI;
    this.angle = 2 * this.p.PI * theta;
    this.emission = emission;
    this.children = [];
    this.parent = parent;
    this.tail = [];
    this.planet = planet;
    this.tailLength = tailLength;
    if (parent) {
      parent.children.push(this);
    }
  }

  get centerX() {
    return this.parent ? this.parent.distance : 0;
  }

  update = () => {
    if (this.distance) {
      this.angle += (this.speed / this.distance);
    }
    this.children.forEach(child => {
      child.update();
    });
  }

  history = () => {
    if (this.tail.length > this.tailLength) {
      this.tail.shift();
    }
    this.tail.push({ angle: this.angle });
  }

  drawTail = () => {
    for (let i = this.tail.length - 1; i > 0; i--) {
      this.p.push();
      this.p.rotate(-this.tail[i].angle);
      this.p.translate(this.distance, 0);
      this.p.strokeWeight(1);
      this.p.stroke(this.p.color(`rgba(${this.color.r},${this.color.g},${this.color.b},${i*(1/this.tailLength)})`));
      this.p.line(0, 0, 0, 5);
      this.p.noFill();
      
      this.p.pop();
    }
  }

  draw = () => {
    this.p.push()
      if (this.parent) {
        this.p.rotate(-this.parent.angle);
      }
      this.p.translate(this.centerX, 0);
      this.p.rotate(-this.angle);
      this.p.fill(this.p.color(`rgb(${this.color.r},${this.color.g},${this.color.b})`));
      this.p.strokeWeight(0)
      this.p.circle(this.distance, 0, this.radius);
    this.p.pop()

    if (this.children.length) {
      this.children.forEach(child => {
        child.draw();
      })
    }

    if (this.planet) {
      this.history();
      this.drawTail();
    }
  }
}

export default PlanetBody;