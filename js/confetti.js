// adapted from http://jsfiddle.net/hcxabsgh/
const maxParticles = 150;
const minParticleSize = 20;
const maxParticleSize = 50;
// smaller is faster
const dropCoefficient = 4;

const RandomFromTo = (from, to) => {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

const colorManager = {
    colorOptions: [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "pink",
        "SlateBlue",
        "lightblue",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson"
    ],
    colorIndex: 0,
    getColor: function () {
        this.colorIndex = this.colorIndex % this.colorOptions.length;
        return this.colorOptions[this.colorIndex++];
    }
};

function ConfettiParticle(color, parent) {
    this.parent= parent;
    this.x = Math.random() * parent.W;
    this.y = RandomFromTo(-parent.H, 0);
    this.radius = RandomFromTo(minParticleSize, maxParticleSize);
    this.density = (Math.random() * maxParticles) + 10;
    this.color = color;
    this.tilt = Math.floor(Math.random() * 10) - 10;
    this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
    this.tiltAngle = 0;

    this.draw = function () {
        const ctx = this.parent.ctx;
        ctx.beginPath();
        ctx.lineWidth = this.radius / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + (this.radius / 4), this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.radius / 4));
        return ctx.stroke();
    };

    this.update = function (index) {
        this.tiltAngle += this.tiltAngleIncremental;
        // increase this number to increase drop speed
        this.y += (Math.cos(parent.angle + this.density) + 3 + this.radius / 2) / dropCoefficient;
        this.x += Math.sin(parent.angle);
        this.tilt = (Math.sin(this.tiltAngle - (index / 3))) * 15;

        this.checkBounds(index);
    };

    this.reposition = function (x, y, tilt) {
        this.x = x;
        this.y = y;
        this.tilt = tilt;
    };

    this.checkBounds= function (index) {
        if (parent.confettiActive){
            if (this.x > parent.W + 20 || this.x < -20) {
                 //66.67% of the flakes
                if (index % 5 > 0 || index % 2 == 0) {
                    this.reposition(Math.random() * parent.W, -10, Math.floor(Math.random() * 10) - 10);
                } else {
                    if (Math.sin(parent.angle) > 0) {
                        //Enter from the left
                        this.reposition(-5, this.y, Math.floor(Math.random() * 10) - 10);
                    } else {
                        //Enter from the right
                        this.reposition(parent.W + 5, this.y, Math.floor(Math.random() * 10) - 10);
                    }
                }
            }
            if (this.y > parent.H){
                this.reposition(Math.random() * parent.W, RandomFromTo(-parent.H * 0.10, 0), Math.floor(Math.random() * 10) - 10);
            }
        }
    };
};

function Confetti(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.W;
    this.H;
    this.particles = [];
    this.angle = 0;
    this.confettiActive = false;
    this.animationComplete = true;
    this.deactivationTimerHandler;
    this.reactivationTimerHandler;
    this.animationHandler;

    this.resetCanvas = () => {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.canvas.width = this.W;
        this.canvas.height = this.H;
    }

    this.setup = () => {
        this.resetCanvas();

        this.particles = [];
        for (let i = 0; i < maxParticles; i++) {
            this.particles.push(new ConfettiParticle(colorManager.getColor(), this));
        }
    }

    this.update = () => {
        if (this.animationComplete) return;

        let remainingFlakes = 0;
        let particle;
        this.angle += 0.01;

        for (let i = 0; i < maxParticles; i++) {
            particle = this.particles[i];
            particle.update(i);

            if (particle.y <= this.H) {
                remainingFlakes++;
            }
        }

        if (remainingFlakes === 0) {
            this.stopConfetti();
        }
    }

    this.draw = () => {
        this.update();

        this.ctx.clearRect(0, 0, this.W, this.H);
        for (let i = 0; i < maxParticles; i++) {
            this.particles[i].draw();
        }

        if (!this.animationComplete){
            requestAnimationFrame(this.draw);
        }
    }

    this.startConfetti = () => {
        if (this.animationComplete && !this.confettiActive) {
            this.confettiActive = true;
            this.animationComplete = false;
            this.setup();
            this.draw();
        }
    }

    this.deactivateConfetti = () => {
        this.confettiActive = false;
    }

    this.stopConfetti = () => {
        this.animationComplete = true;
        this.ctx.clearRect(0, 0, this.W, this.H);
    }
};