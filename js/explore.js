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
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        parent: "explore"
    };

    var game = new Phaser.Game(config);
    var rocket;
    var particlesEmitterLeft;
    var particlesEmitterRight;

    function preload()
    {
        this.load.path = 'assets/explore/';

        this.load.image('rocket', 'rocket.png');
        this.load.image('fire', 'fire.png');
    }

    function create()
    {
        var graphics = this.add.graphics();
        graphics.fillGradientStyle(0x000000, 0x000000, 0x0000ff, 0x0000ff);
        graphics.fillRect(0, 0, 1000, 2500);

        particlesManager = this.add.particles('fire');

        rocket = this.physics.add.sprite(500, 2437.5, 'rocket');
        rocket.setOrigin(0.5, 0.5)
              .setBounce(0.1)
              .setCollideWorldBounds(true);

        this.input.on('pointerdown', function () {
            rocket.body.setAccelerationY(-225);
        });

        this.input.on('pointerup', function () {
            rocket.body.setAccelerationY(0);
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

        this.cameras.main.setBounds(0, 0, 1000, 2500);
        this.cameras.main.startFollow(rocket);
        particlesEmitterLeft.startFollow(rocket, -rocket.width / 4, rocket.height / 2);
        particlesEmitterRight.startFollow(rocket, rocket.width / 4, rocket.height / 2);
    }

    function update()
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
}
