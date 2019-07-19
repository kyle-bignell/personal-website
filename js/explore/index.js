window.exploreLoaded = false;
window.inExplore = false;
window.moveExploreIntervalID;
window.explore.game = null;
window.explore.currentScene = null;

window.explore.config = {
    planets: [
        { id: 0, radius: 40, x: 0, y: 0, colour: 0xff666e, skyColour: 0x77eee8, outlineColour: 0xffffff, orbitRadius: 0, orbitTime: 1, orbitRotation: null, orbitRotationOffset: 0, orbitCircle: null, graphics: null },
        { id: 1, radius: 18, x: 0, y: 0, colour: 0xffd180, skyColour: 0x8db2f2, outlineColour: 0xffffff, orbitRadius: 75, orbitTime: 5000, orbitRotation: null, orbitRotationOffset: 0, orbitCircle: null, graphics: null },
        { id: 2, radius: 20, x: 0, y: 0, colour: 0xff8a80, skyColour: 0x8becf4, outlineColour: 0xffffff, orbitRadius: 120, orbitTime: 10000, orbitRotation: null, orbitRotationOffset: 1.5, orbitCircle: null, graphics: null },
        { id: 3, radius: 30, x: 0, y: 0, colour: 0x00bcd4, skyColour: 0xdf82d4, outlineColour: 0xffffff, orbitRadius: 180, orbitTime: 30000, orbitRotation: null, orbitRotationOffset: 5.7, orbitCircle: null, graphics: null },
        { id: 4, radius: 22, x: 0, y: 0, colour: 0x00ffa1, skyColour: 0xeb9c14, outlineColour: 0xffffff, orbitRadius: 250, orbitTime: 56000, orbitRotation: null, orbitRotationOffset: 3.3, orbitCircle: null, graphics: null },
        { id: 5, radius: 20, x: 0, y: 0, colour: 0xea80fc, skyColour: 0x98f389, outlineColour: 0xffffff, orbitRadius: 310, orbitTime: 80000, orbitRotation: null, orbitRotationOffset: 4.2, orbitCircle: null, graphics: null }
    ]
};

/* Returns a random number in the range [minVal,maxVal] */
window.explore.randomRange = function(minVal, maxVal)
{
    return (Math.random() * (maxVal - minVal - 1)) + minVal;
}

window.explore.stars = {};
window.explore.stars.MAX_DEPTH = 32;
window.explore.stars.COLOUR = 0xffffff;
window.explore.stars.data = new Array(2048);
window.explore.stars.init = function()
{
    for( var i = 0; i < window.explore.stars.data.length; i++ )
    {
        window.explore.stars.data[i] = {
          x: window.explore.randomRange(-1000, 1000),
          y: window.explore.randomRange(-680, 680),
          z: window.explore.randomRange(1, window.explore.stars.MAX_DEPTH)
         }
    }
}

function handleVisible(visible, scene)
{
    if (scene.settings.key === window.explore.currentScene)
    {
        if (visible)
        {
            scene.resume();
        }
        else
        {
            scene.pause();
        }
    }
}

window.addEventListener("load", function()
{
    var exploreToggleDOM = document.getElementById("explore-toggle");
    exploreToggleDOM.addEventListener("click", function()
    {
        window.inExplore = !window.inExplore;
        exploreToggleDOM.innerText = window.inExplore ? "Home" : "Explore";
        var exploreDOM = document.getElementById("explore");
        if (window.inExplore)
        {
            exploreDOM.classList.add("explore-transform-active");
            loadExplore();
        }
        else
        {
            exploreDOM.classList.remove("explore-transform-active");
        }
    });
});


function loadExplore()
{
    if (window.exploreLoaded)
    {
        return;
    }

    window.exploreLoaded = true;

    var phaserScript = document.createElement('script');
    phaserScript.onload = function()
    {
        window.setTimeout(function()
        {
          setupExplore();
        }, 500);
    };
    phaserScript.src = "js/explore/phaser.min.js";
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
                debug: false
            }
        },
        parent: "explore"
    };

    var sceneLaunch = SceneLaunch(config);
    var sceneOverview = SceneOverview(config);
    var sceneOrbit = SceneOrbit(config);
    config.scene = [sceneLaunch, sceneOverview, sceneOrbit],

    window.explore.game = new Phaser.Game(config);
    window.explore.stars.init();
}
