class Explosion {
  constructor(x, y, enemies){
    this.x = x;
    this.y = y;
    this.r = 2;
    this.enemies = enemies;
    this.rMax = 30;
    this.lifeTime = 100;
    this.dead = false;
  }
  update() {
    for(let e of this.enemies) {
      let d = p5.Vector.dist(e.pos, createVector(this.x, this.y));
      if(d < this.r + e.r)
        e.killed = true;
    }
  }
  render() {
    push();
    translate(this.x, this.y);
    ellipse(0, 0, this.r*2);
    this.r = map(this.lifeTime, 100, 0, 2, this.rMax);
    this.lifeTime--;
    if(this.lifeTime === 0)
      this.dead = true;
    pop();
  }
}
