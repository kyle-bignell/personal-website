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
            create: create
        },
        parent: "explore"
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
        this.load.path = 'assets/explore/';

        this.load.image('rocket', 'rocket.png');
    }

    function create ()
    {
        this.physics.world.setBounds(0, 0, 1000, 680);

        var rocket = this.add.image(500, 320, 'rocket');
        this.physics.add.existing(rocket);
        rocket.body.setBounce(0.1).setCollideWorldBounds(true);

        this.input.on('pointerdown', function () {
            rocket.body.setAccelerationY(-350);
        });

        this.input.on('pointerup', function () {
            rocket.body.setAccelerationY(0);
        });
    }
}
