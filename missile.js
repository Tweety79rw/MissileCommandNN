class Missile {
  constructor(start, target, enemies) {
    this.pos = createVector(start.x,start.y);
    this.target = target;
    this.enemies = enemies;
    this.vel = createVector();
    this.acc = createVector();
    this.maxVel = 3;
    this.maxForce = 3;
    this.exploded = false;
  }
  steer() {
    let desired = p5.Vector.sub(this.target, this.pos);
    desired.setMag(this.maxVel);
    let force = p5.Vector.sub(desired, this.vel);
    force.limit(this.maxForce);
    this.applyForce(force);
  }
  applyForce(force) {
    this.acc.add(force);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    let d = p5.Vector.dist(this.target, this.pos);
    if(d <= 5)
      this.exploded = true;
  }
  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    stroke(255);
    noFill();
    line(0,0, 10,0);
    pop();
  }
}
