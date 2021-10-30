import Base from "./Base";

class Habitable extends Base {
  constructor({p, innerRadius, outerRadius}){
    super(p);
    this.strokeWeight = outerRadius - innerRadius;
    this.outerRadius = outerRadius;
    this.color = p.color('rgba(34,171,44,0.5)')
  };

  draw = () => {
    this.p.noFill();
    this.p.strokeWeight(this.strokeWeight);
    this.p.circle(0,0,this.outerRadius);
  }
}

export default Habitable;