window.exploreLoaded = false;
window.inExplore = false;
window.moveExploreIntervalID;

window.explore.config = {
    planets: [
        { id: 0, radius: 40, x: 0, y: 0, colour: 0xff0000, outlineColour: 0xffffff, orbitRadius: 0, orbitTime: 1, orbitRotation: null, orbitRotationOffset: 0, orbitCircle: null, graphics: null },
        { id: 1, radius: 15, x: 0, y: 0, colour: 0x00ff00, outlineColour: 0xffffff, orbitRadius: 75, orbitTime: 5000, orbitRotation: null, orbitRotationOffset: 0, orbitCircle: null, graphics: null },
        { id: 2, radius: 20, x: 0, y: 0, colour: 0x0000ff, outlineColour: 0xffffff, orbitRadius: 120, orbitTime: 10000, orbitRotation: null, orbitRotationOffset: 1.5, orbitCircle: null, graphics: null },
        { id: 3, radius: 30, x: 0, y: 0, colour: 0x00ffff, outlineColour: 0xffffff, orbitRadius: 180, orbitTime: 30000, orbitRotation: null, orbitRotationOffset: 5.7, orbitCircle: null, graphics: null },
        { id: 4, radius: 22, x: 0, y: 0, colour: 0xffff00, outlineColour: 0xffffff, orbitRadius: 250, orbitTime: 56000, orbitRotation: null, orbitRotationOffset: 3.3, orbitCircle: null, graphics: null },
        { id: 5, radius: 18, x: 0, y: 0, colour: 0xff00ff, outlineColour: 0xffffff, orbitRadius: 310, orbitTime: 80000, orbitRotation: null, orbitRotationOffset: 4.2, orbitCircle: null, graphics: null }
    ]
};

function handleVisible(visible, scene)
{
    debugger;
    // if (scene.settings.active)
    // {
    //     if (visible)
    //     {
    //         scene.resume();
    //     }
    //     else
    //     {
    //         scene.pause();
    //     }
    // }
}

window.addEventListener("load", function()
{
    var exploreToggleDOM = document.getElementById("explore-toggle");
    exploreToggleDOM.addEventListener("click", function()
    {
        window.inExplore = !window.inExplore;
        exploreToggleDOM.innerText = window.inExplore ? "Home" : "Explore";
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

    clearInterval(window.moveExploreIntervalID);
    window.moveExploreIntervalID = setInterval(frame, 5);

    function frame()
    {
        if (currentPos === endPos)
        {
            clearInterval(window.moveExploreIntervalID);
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
    if (window.exploreLoaded)
    {
        return;
    }

    window.exploreLoaded = true;

    var phaserScript = document.createElement('script');
    phaserScript.onload = function()
    {
      setupExplore();
    };
    phaserScript.src = "js/phaser.js";
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

    new Phaser.Game(config);
}
