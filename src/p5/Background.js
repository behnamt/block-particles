class Background {
  constructor(_p) {
    this.p = _p;
  }

  draw() {
    this.p.background(0);
    //background -- stars
    this.p.randomSeed(500)
    for (var j = 0; j <= 500; j++) {
      this.p.fill(this.p.random(120, 255), this.p.random(120, 255), this.p.random(120, 255), this.p.random(80, 150))
      this.p.circle(this.p.random(800), this.p.random(800), this.p.random(3))
    }

  }
}

export default Background;