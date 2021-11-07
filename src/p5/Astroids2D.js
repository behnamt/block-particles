import Base from "./Base";

class AstroidBody extends Base{
  constructor({ p, size, distance, color, theta = 1, speed = 1, isShape, points }) {
    super(p);
    this.color = color;
    this.size = size;
    this.distance = distance;
    this.isShape = isShape;
    this.points = points;
    this.orbitLength = distance * 2 * this.p.PI;
    this.angle = 2 * this.p.PI * theta;
  }

  update = () => {
    if (this.distance) {
      this.angle += 1/3000;
    }
  }


  draw = () => {
    this.p.push()
      this.p.translate(0,0);
      this.p.rotate(-this.angle);
      this.p.fill(this.p.color(`rgb(${this.color.r},${this.color.g},${this.color.b})`));
      // this.p.strokeWeight(this.size)
      if (!this.isShape){
        this.p.circle(this.distance, 0, this.size);
      }else {
        this.p.push()
          this.p.translate(this.distance,0);
          this.p.beginShape();
            this.points.forEach(vertex => {
              this.p.vertex(vertex.x, vertex.y);
            })
          this.p.endShape(this.p.CLOSE);
          this.p.pop()
      }
    this.p.pop()
  }
}

export default AstroidBody;