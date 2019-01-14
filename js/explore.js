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
            graphics.fillRect(0, 0, 1000, 3000);

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

            this.rocket = this.physics.add.sprite(500, 2937.5, 'rocket');
            this.rocket.setOrigin(0.5, 0.5)
                       .setBounce(0.1)
                       .setCollideWorldBounds(true);

            this.particlesEmitterLeft.startFollow(this.rocket, -this.rocket.width / 4, this.rocket.height / 1.75);
            this.particlesEmitterRight.startFollow(this.rocket, this.rocket.width / 4, this.rocket.height / 1.75);
            this.cameras.main.startFollow(this.rocket);

            zone = this.add.zone(0, 0).setSize(1000, 3);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;

            this.physics.add.overlap(this.rocket, zone, function()
            {
                this.scene.start('sceneOrbit');
            }, null, this);

            text = this.add.text(500, 2650, "Click to launch", { font: "65px Arial", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center" });
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

            this.physics.world.setBounds(0, 0, 1000, 3000);
            this.cameras.main.setBounds(0, 500, 1000, 2500);
        },

        update: function()
        {
            if (this.rocket.body.acceleration.y < 0)
            {
                var ratio = this.rocket.y / 3500;
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

            var graphics = this.add.graphics();
            graphics.fillGradientStyle(0x000000, 0x000000, 0x333333, 0x333333);
            graphics.fillRect(0, 0, 1000, 680);

            this.rocket = this.physics.add.sprite(500, 340, 'rocket');
            this.rocket.setOrigin(0.5, 0.5);

            this.orbitCircle = new Phaser.Geom.Circle(500, 320, 250);
            this.orbitRotation = this.tweens.addCounter({
                from: 0,
                to: 6.28,
                duration: 20000,
                repeat: -1
            })

            this.physics.world.setBounds(0, 0, 1000, 680);
            this.cameras.main.setBounds(0, 0, 1000, 680);
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
        scene: [SceneLaunch, SceneOrbit],
        parent: "explore"
    };

    new Phaser.Game(config);
}
