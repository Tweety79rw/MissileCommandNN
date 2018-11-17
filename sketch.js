let turrets = [];
let enemies = [];
let enemyExplosion = [];
let starterEnemies = [];
let savedEnemies = [];
let score = 0;
let maxEnemies = 100;
function setup() {
  createCanvas(1600,800);
  turrets.push(new Turret(width/4, 700));
  turrets.push(new Turret(width/2, 700));
  turrets.push(new Turret(width - width/4, 700));
  enemies.push(new Enemy(turrets));
  for(let i = 1; i < maxEnemies; i++) {
    starterEnemies.push(new Enemy(turrets));
  }
}
function mousePressed() {
  for(let turret of turrets) {
    turret.fire(enemies);
  }
}
function draw() {
  background(0);
  fill(200);
  rect(-1,700, 1601,101);
  if(random(1) < 0.008) {
    if(starterEnemies.length > 0) {
      enemies.push(starterEnemies[0]);
      starterEnemies.splice(0,1);
    }
  }
  for(let i = turrets.length - 1; i >= 0; i--) {
    if(turrets[i].killed) {
      turrets.splice(i,1);
      score-=5;
      continue;
    }
    turrets[i].update();
    turrets[i].render();
  }
  if(turrets.length === 0) {
    fill(255);
    textSize(72);
    textAlign(CENTER);
    text('GAME OVER',width/2, height/2);
    textSize(24);
    text('Refresh to start a new game.', width/2, height/2 + 30);
    noLoop();
  }
  for(let i = enemies.length - 1; i >= 0; i--) {
    if(enemies[i].exploded) {
      enemyExplosion.push(new Explosion(enemies[i].pos.x, enemies[i].pos.y, turrets));
      score--;
      savedEnemies.push(enemies[i]);
      enemies.splice(i,1);
      continue;
    }
    if(enemies[i].killed) {
      savedEnemies.push(enemies[i]);
      enemies.splice(i,1);
      score++;
      continue;
    }
    enemies[i].steer();
    enemies[i].update();
    enemies[i].render();
  }
  for(let i = enemyExplosion.length - 1; i >= 0; i--) {
    if(enemyExplosion[i].dead) {
      enemyExplosion.splice(i,1);
      continue;
    }
    enemyExplosion[i].update();
    enemyExplosion[i].render();
  }
  if(enemies.length === 0 && starterEnemies.length === 0) {
    var maxFitness = -Infinity;
    for(let se of savedEnemies) {
      maxFitness = Math.max(maxFitness, se.calculateFit());
    }
    let options = {
      sanity: 0,
      maxFit: maxFitness,
      increment:function(){
        this.sanity++;
      }
    };
    for(let i = 0; i < maxEnemies; i++) {
      let p = acceptReject(options);
      let b = p.brain.copy();
      b.mutate(mutate);
      starterEnemies.push(new Enemy(turrets, b))
    }
    savedEnemies = [];
  }
  fill(255);
  textSize(24);
  text('Score: ' + score, width - 150, 30);
}
function acceptReject(ops) {
   if(ops.sanity > 1000)
       return null;
   let partner = random(savedEnemies);
   let r = random(ops.maxFit);
   if(r < partner.calculateFit()) {
     return partner;
   }
   ops.increment();
   return acceptReject(ops);
 }
 function mutate(x) {
   if (random(1) < 0.1) {
     let offset = randomGaussian() * 0.5;
     let newx = x + offset;
     return newx;
   } else {
     return x;
   }
 }
