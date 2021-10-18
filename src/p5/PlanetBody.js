class PlanetBody {
  constructor({ p, drag, radius, distance, parent, emission, color, theta = 1, speed = 1, planet = false, tailLength = 10 }) {
    this.p = p;
    this.drag = drag;
    this.color = p.color(color) ;
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

  update = () => {
    if (this.orbitLength > 0) {
      this.angle += (this.speed / this.orbitLength) * (2 * this.p.PI);
    }
    for (let body of this.children) {
      body.update();
    }
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
      this.p.stroke(this.color);
      this.p.line(0, 0, 0, 5);
      this.p.noFill();
      
      this.p.pop();
    }
  }

  draw = () => {
    this.p.push();
    if (this.emission) {
      this.p.fill(this.emission);
      this.p.scale(100);
      this.p.pointLight(this.emission, this.drag.x, this.drag.y, 0);
      this.p.scale(0.01);
    }

    this.p.rotate(-this.angle);
    this.p.translate(this.distance, 0);
    if (this.emission) {
      this.p.ambientLight(this.emission);
    }
    this.p.ambientMaterial(this.color);
    this.p.sphere(this.radius);
    for (let body of this.children) {
      body.draw();
    }
    this.p.pop();
    if (this.planet){
      this.history();
      this.drawTail()
    }
  
  }
}

export default PlanetBody;