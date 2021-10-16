class PlanetBody {
  constructor({ p, drag, radius, distance, parent, emission, color, theta = 1, speed = 1 }) {
    this.p = p;
    this.drag = drag;
    this.color = color;
    this.radius = radius;
    this.speed = speed;
    this.distance = distance;
    this.orbitLength = distance * 2 * this.p.PI;
    this.angle = 2 * this.p.PI * theta;
    this.emission = emission;
    this.children = [];
    this.parent = parent;
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
  }
}

export default PlanetBody;