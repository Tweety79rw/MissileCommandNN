class Enemy extends Missile{
  constructor(turrets, brain) {
    super(createVector(random(width), 0), createVector(random(width), 700));
    if(brain) {
      this.brain = brain;
    } else {
      this.brain = new NeuralNetwork(17, 45, 2);
    }
    this.origin = createVector(this.pos.x, this.pos.y);
    this.maxVel = 1;
    this.killed = false;
    this.r = 0;
    this.turrets = turrets;
    this.points = [];
    this.points.push(createVector(this.pos.x, this.pos.y));
    this.previousHeading = this.vel.heading();
    this.count = 0;
  }
  calculateFit() {
    let closest = Infinity;
    for(let turret of this.turrets) {
      let d = p5.Vector.dist(this.pos, turret.pos);
      closest = Math.min(d, closest);
    }
    return map(closest, 0, height, 100, 0) + this.exploded?100:0;
  }
  getBrainInput() {
    let closest = {dist:Infinity, missile:null};
    let closestE = {dist:Infinity, explosion:null};
    let input = [];
    for(let turret of this.turrets) {
      input.push(this.mapX(turret.pos.x));
      input.push(this.mapY(turret.pos.y));
      for(let missile of turret.missiles) {
        let d = p5.Vector.dist(this.pos, missile.pos);
        if(closest.dist > d) {
          closest.dist = d;
          closest.missile = missile;
        }
      }
      for(let explosion of turret.explosions) {
        let d = p5.Vector.dist(this.pos, createVector(explosion.x, explosion.y));
        if(closestE.dist > d) {
          closestE.dist = d;
          closestE.explosion = createVector(explosion.x, explosion.y);
        }
      }
    }
    let diff = 6 - input.length;
    for(let i = 0; i < diff; i++) {
      input.push(0);
    }
    if(closest.dist < Infinity) {
      input.push(this.mapX(closest.missile.pos.x));
      input.push(this.mapY(closest.missile.pos.y));
      input.push(this.mapV(closest.missile.vel.x));
      input.push(this.mapV(closest.missile.vel.y));
    } else {
      input.push(0);
      input.push(0);
      input.push(0);
      input.push(0);
    }
    if(closestE.dist < Infinity) {
      input.push(this.mapX(closestE.explosion.x));
      input.push(this.mapY(closestE.explosion.y));
    }else {
      input.push(0);
      input.push(0);
    }
    input.push(this.mapX(this.pos.x));
    input.push(this.mapY(this.pos.y));
    input.push(this.mapV(this.vel.x));
    input.push(this.mapV(this.vel.y));
    input.push(this.vel.heading());
    return input;
  }
  mapX(val) {
    return map(val, 0, width, 0, 1);
  }
  mapY(val) {
    return map(val, 0, 700, 0, 1);
  }
  mapV(val) {
    return map(val, -1, 1, 0, 1);
  }
  update() {
    if(this.killed) return;
    this.count++;
    if(this.count >= 60) {
      let out = this.brain.predict(this.getBrainInput());
      this.target = createVector(map(out[0], 0, 1, 0, width), map(out[1], 0, 1, 0, 700));
      this.count = 0;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if(this.pos.y >= 680)
      this.exploded = true;
    if(this.vel.heading() !== this.previousHeading){
      this.points.push(this.pos.copy());
      if(this.points.length > 20) {
        this.points.splice(0,1);
      }
    }
    this.previousHeading = this.vel.heading();
    if(this.pos.x < -10 || this.pos.x > width + 10 || this.pos.y < -10) {
      this.killed = true;
    }
  }
  render() {
    if(this.killed) return;
    push();
    stroke(255);
    noFill();
    let x = this.points[0].x;
    let y = this.points[0].y;
    for(let i = 1; i < this.points.length; i++) {
      line(x, y, this.points[i].x,this.points[i].y);
      x = this.points[i].x;
      y = this.points[i].y;
    }
    line(x, y, this.pos.x,this.pos.y);
    pop();
  }

}
