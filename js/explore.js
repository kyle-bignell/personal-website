var exploreLoaded = false;
var inExplore = false;
var moveExploreIntervalID;

window.addEventListener("load", function()
{
    var exploreToggleDOM = document.getElementById("explore-toggle");
    exploreToggleDOM.addEventListener("click", function()
    {
        inExplore = !inExplore;
        exploreToggleDOM.innerText = inExplore ? "Home" : "Explore";
        moveExplore();
    });
});

function moveExplore()
{
    var exploreDOM = document.getElementById("explore");

    var startPos = inExplore ? -100 : 0;
    var endPos = inExplore ? 0 : -100;
    var delta = inExplore ? 1 : -1;
    var currentPos = parseFloat(exploreDOM.style.left) || startPos;

    clearInterval(moveExploreIntervalID);
    moveExploreIntervalID = setInterval(frame, 5);

    function frame()
    {
        if (currentPos === endPos)
        {
            clearInterval(moveExploreIntervalID);
            loadExplore();
        }
        else
        {
            currentPos += delta;
            exploreDOM.style.left = currentPos + '%';
        }
    }
}

function loadExplore()
{
    if (exploreLoaded)
    {
        return;
    }

    exploreLoaded = true;

    var phaserScript = document.createElement('script');
    phaserScript.onload = function()
    {
      setupExplore();
    };
    phaserScript.src = "js/phaser.min.js";
    phaserScript.async = true;
    document.getElementsByTagName('head')[0].appendChild(phaserScript);
}

var rocket;
var particlesEmitterLeft;
var particlesEmitterRight;

function setupExplore()
{
    var SceneLaunch = new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function()
        {
            Phaser.Scene.call(this, { key: 'sceneLaunch' });
        },

        preload: function()
        {
            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
        },

        create: function()
        {
            var graphics = this.add.graphics();
            graphics.fillGradientStyle(0x000000, 0x000000, 0x0000ff, 0x0000ff);
            graphics.fillRect(0, 0, 1000, 2500);

            particlesManager = this.add.particles('fire');

            rocket = this.physics.add.sprite(500, 2437.5, 'rocket');
            rocket.setOrigin(0.5, 0.5)
                  .setBounce(0.1)
                  .setCollideWorldBounds(true);

            zone = this.add.zone(0, 0).setSize(1000, 3);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;

            this.physics.add.overlap(rocket, zone, function()
            {
                this.scene.start('sceneOrbit');
            }, null, this);

            text = this.add.text(500, 2150, "Click to launch", { font: "65px Arial", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center" });
            text.setOrigin(0.5);
            var tween = this.tweens.add({
                targets: text,
                alpha: 0.35,
                ease: 'Sine',
                duration: 750,
                yoyo: true,
                repeat: -1
            });

            this.input.on('pointerdown', function()
            {
                rocket.body.setAccelerationY(-225);
                text.destroy();
            });

            var particleConfig = {
                on: false,
                alpha: { start: 1, end: 0 },
                scale: { start: 0.65, end: 1.5 },
                accelerationY: 225,
                gravityY: 200,
                angle: { min: -85, max: -95 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 500, max: 600 },
                blendMode: 'ADD',
                frequency: 100,
                maxParticles: 35
            }
            particlesEmitterLeft = particlesManager.createEmitter(particleConfig);
            particlesEmitterRight = particlesManager.createEmitter(particleConfig);

            this.physics.world.setBounds(0, 0, 1000, 2500);

            this.cameras.main.setBounds(0, 300, 1000, 2200);
            this.cameras.main.startFollow(rocket);
            particlesEmitterLeft.startFollow(rocket, -rocket.width / 4, rocket.height / 2);
            particlesEmitterRight.startFollow(rocket, rocket.width / 4, rocket.height / 2);
        },

        update: function()
        {
            if (rocket.body.acceleration.y < 0)
            {
                var ratio = rocket.y / 2500;
                this.cameras.main.shake(100, 0.0025 * ratio);
                particlesEmitterLeft.start();
                particlesEmitterRight.start();
            }
            else
            {
                particlesEmitterLeft.stop();
                particlesEmitterRight.stop();
            }
        }
    });

    var SceneOrbit = new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function()
        {
            Phaser.Scene.call(this, { key: 'sceneOrbit' });
        },

        preload: function()
        {
            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
        },

        create: function()
        {
            var graphics = this.add.graphics();
            graphics.fillGradientStyle(0x000000, 0x000000, 0x0000ff, 0x0000ff);
            graphics.fillRect(0, 0, 1000, 2500);

            particlesManager = this.add.particles('fire');

            rocket = this.physics.add.sprite(500, 2437.5, 'rocket');
            rocket.setOrigin(0.5, 0.5)
                  .setBounce(0.1)
                  .setCollideWorldBounds(true);

            text = this.add.text(500, 2150, "Click to launch", { font: "65px Arial", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center" });
            text.setOrigin(0.5);

            var tween = this.tweens.add({
                targets: text,
                alpha: 0.35,
                ease: 'Sine',
                duration: 750,
                yoyo: true,
                repeat: -1
            });

            this.input.on('pointerdown', function()
            {
                rocket.body.setAccelerationY(-225);
                text.destroy();
            });

            var particleConfig = {
                on: false,
                alpha: { start: 1, end: 0 },
                scale: { start: 0.65, end: 1.5 },
                accelerationY: 225,
                gravityY: 200,
                angle: { min: -85, max: -95 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 500, max: 600 },
                blendMode: 'ADD',
                frequency: 100,
                maxParticles: 35
            }
            particlesEmitterLeft = particlesManager.createEmitter(particleConfig);
            particlesEmitterRight = particlesManager.createEmitter(particleConfig);

            this.physics.world.setBounds(0, 0, 1000, 2500);

            this.cameras.main.setBounds(0, 300, 1000, 2200);
            this.cameras.main.startFollow(rocket);
            particlesEmitterLeft.startFollow(rocket, -rocket.width / 4, rocket.height / 2);
            particlesEmitterRight.startFollow(rocket, rocket.width / 4, rocket.height / 2);
        },

        update: function()
        {
            if (rocket.body.acceleration.y < 0)
            {
                var ratio = rocket.y / 2500;
                this.cameras.main.shake(100, 0.0025 * ratio);
                particlesEmitterLeft.start();
                particlesEmitterRight.start();
            }
            else
            {
                particlesEmitterLeft.stop();
                particlesEmitterRight.stop();
            }
        }
    });

    var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 680,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
                debug: true
            }
        },
        scene: [SceneLaunch, SceneOrbit],
        parent: "explore"
    };

    new Phaser.Game(config);
}
