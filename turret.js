class Turret {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.missiles = [];
    this.explosions = [];
    this.killed = false;
    this.r = 40;
  }
  getHeading() {
    let targetVect = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
    return targetVect.heading();
  }
  fire(enemies) {
    let target = createVector(mouseX, mouseY);
    this.missiles.push(new Missile(this.pos, target, enemies));
  }
  update() {
    for(let i = this.missiles.length - 1; i >= 0; i--) {
      if(this.missiles[i].exploded) {
        this.explosions.push(new Explosion(this.missiles[i].pos.x, this.missiles[i].pos.y, this.missiles[i].enemies));
        this.missiles.splice(i,1);
        continue;
      }
      this.missiles[i].steer();
      this.missiles[i].update();
      this.missiles[i].render();
    }
    for(let i = this.explosions.length - 1; i >= 0; i--) {
      if(this.explosions[i].dead) {
        this.explosions.splice(i, 1);
        continue;
      }
      this.explosions[i].update();
      this.explosions[i].render();
    }
  }
  render() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(0,0,255);
    fill(0,0,230);
    arc(0, 0, this.r*2, this.r*2, PI, TWO_PI);
    stroke(0,100,200);
    strokeWeight(4);
    rotate(this.getHeading());
    line(0,0, this.r, 0);
    pop();

  }
}
