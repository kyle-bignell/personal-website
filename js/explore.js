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

function setupExplore()
{
    var SceneLaunch = new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function()
        {
            Phaser.Scene.call(this, { key: 'sceneLaunch' });

            this.sceneDimensions = {
                w: config.width,
                h: 4000
            };
            this.rocketDimensions = {
                w: 100,
                h: 125
            };
            this.cameraBuffer = 500;
        },

        preload: function()
        {
            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
        },

        create: function()
        {
            this.physics.world.gravity.y = 200;

            var graphics = this.add.graphics();
            graphics.fillGradientStyle(0x000000, 0x000000, 0x83EAFF, 0x83EAFF);
            graphics.fillRect(0, this.cameraBuffer, this.sceneDimensions.w, this.sceneDimensions.h);

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
            particlesManager = this.add.particles('fire');
            this.particlesEmitterLeft = particlesManager.createEmitter(particleConfig);
            this.particlesEmitterRight = particlesManager.createEmitter(particleConfig);

            this.rocket = this.physics.add.sprite(this.sceneDimensions.w / 2,
                                                  this.sceneDimensions.h - (this.rocketDimensions.h / 2),
                                                  'rocket');
            this.rocket.setOrigin(0.5, 0.5)
                       .setCollideWorldBounds(true);

            this.particlesEmitterLeft.startFollow(this.rocket, -this.rocket.width / 4, this.rocket.height / 1.75);
            this.particlesEmitterRight.startFollow(this.rocket, this.rocket.width / 4, this.rocket.height / 1.75);
            this.cameras.main.startFollow(this.rocket);

            zone = this.add.zone(0, 0).setSize(this.sceneDimensions.w, 3);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;

            this.physics.add.overlap(this.rocket, zone, function()
            {
                this.scene.start('sceneOrbit');
            }, null, this);

            text = this.add.text(this.sceneDimensions.w / 2,
                                 this.sceneDimensions.h - 350,
                                 "Click to launch",
                                 { font: "65px Arial", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center" });
            text.setOrigin(0.5);
            this.tweens.add({
                targets: text,
                alpha: 0.35,
                ease: 'Sine',
                duration: 750,
                yoyo: true,
                repeat: -1
            });

            this.input.on('pointerdown', function()
            {
                this.rocket.body.setAccelerationY(-225);
                text.destroy();
            }.bind(this));

            this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h)
            this.cameras.main.setBounds(0, this.cameraBuffer, this.sceneDimensions.w, this.sceneDimensions.h - this.cameraBuffer);
        },

        update: function()
        {
            if (this.rocket.body.acceleration.y < 0)
            {
                var ratio = this.rocket.y / this.sceneDimensions.h;
                this.cameras.main.shake(100, 0.0025 * ratio);
                this.particlesEmitterLeft.start();
                this.particlesEmitterRight.start();
            }
            else
            {
                this.particlesEmitterLeft.stop();
                this.particlesEmitterRight.stop();
            }
        }
    });

    var SceneOrbit = new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function()
        {
            Phaser.Scene.call(this, { key: 'sceneOrbit' });

            this.sceneDimensions = {
                w: config.width,
                h: config.height
            };
            this.rocketDimensions = {
                w: 100,
                h: 125
            };
        },

        preload: function()
        {
            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
        },

        create: function()
        {
            this.physics.world.gravity.y = 0;

            this.config = {
                planetRadius: 200,
                orbitRadius: 300,
                orbitTime: 30000
            };

            var graphics = this.add.graphics();
            graphics.fillGradientStyle(0x000000, 0x000000, 0x333333, 0x333333);
            graphics.fillRect(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);

            graphics.fillStyle(0xff0000, 1);
            graphics.fillCircle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.planetRadius);

            this.rocket = this.physics.add.sprite(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, 'rocket');
            this.rocket.setOrigin(0.5, 0.5)
                       .setScale(0.6, 0.6);

            this.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.orbitRadius);
            this.orbitRotation = this.tweens.addCounter({
                from: 0,
                to: 6.28,
                duration: this.config.orbitTime,
                repeat: -1
            });

            this.input.on('pointerdown', function()
            {
                
            }.bind(this));

            this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
            this.cameras.main.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
        },

        update: function()
        {
            Phaser.Actions.PlaceOnCircle(
                [this.rocket],
                this.orbitCircle,
                this.orbitRotation.getValue()
            );
            this.rocket.rotation = this.orbitRotation.getValue() + 3.14;
        }
    });

    var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 680,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
            }
        },
        scene: [SceneOrbit, SceneLaunch],
        parent: "explore"
    };

    new Phaser.Game(config);
}
