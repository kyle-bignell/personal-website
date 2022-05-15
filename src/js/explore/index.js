window.exploreLoaded = false;
window.inExplore = false;
window.moveExploreIntervalID;
window.explore.game = null;
window.explore.currentScene = null;

window.explore.config = {
    planets: [
        {
            id: 0,
            radius: 40,
            colour: 0xff666e,
            skyColour: 0x77eee8,
            outlineColour: 0xffffff,
            orbitRadius: 0,
            orbitTime: 1,
            orbitRotationOffset: 0,
            rotationSpeed: 4,
            element: "CREATIVISIUM",
            elementColour: 0xff666e,
            description: "An element essential for the solution development process. \
            Incorportating this into a pipeline vastly increases the likelihood \
            of generating an efficient or novel final end product. As such it \
            is highly sought after as a catalyst for use in production pipelines."
        },
        {
            id: 1,
            radius: 18,
            colour: 0xffd180,
            skyColour: 0x8db2f2,
            outlineColour: 0xffffff,
            orbitRadius: 75,
            orbitTime: 5000,
            orbitRotationOffset: 0,
            rotationSpeed: 1,
            element: "DISCIPLINONIUM",
            elementColour: 0xffd180,
            description: "An important element for ensuring throughput of development \
            pipelines. DISCIPLINONIUM is valued for its ability to regulate flow rates \
            and ensure that output stays at reliable levels."
        },
        {
            id: 2,
            radius: 20,
            colour: 0xff8a80,
            skyColour: 0x8becf4,
            outlineColour: 0xffffff,
            orbitRadius: 120,
            orbitTime: 10000,
            orbitRotationOffset: 1.5,
            rotationSpeed: 3,
            element: "INSIGHTINE",
            elementColour: 0xff8a80,
            description: "When amassed in enough quantity INSIGHTINE can be used \
            in instruments to predict the suitability of early stage solutions for \
            their intended problems. This makes it a valued element as it allows \
            for better efficiency in development processes."
        },
        {
            id: 3,
            radius: 30,
            colour: 0x00bcd4,
            skyColour: 0xdf82d4,
            outlineColour: 0xffffff,
            orbitRadius: 180,
            orbitTime: 30000,
            orbitRotationOffset: 5.7,
            rotationSpeed: 3,
            element: "LOGICAGEN",
            elementColour: 0x00bcd4,
            description: "An essential element for the breakdown of complex matter \
            into its basic elements. This makes LOGICAGEN important for the early \
            stages of pipelines as it allows starting components to be broken down \
            for reassembly into the target solution."
        },
        {
            id: 4,
            radius: 22,
            colour: 0x00ffa1,
            skyColour: 0xeb9c14,
            outlineColour: 0xffffff,
            orbitRadius: 250,
            orbitTime: 56000,
            orbitRotationOffset: 3.3,
            rotationSpeed: 2,
            element: "ADAPTIUM",
            elementColour: 0x00ffa1,
            description: "ADAPTIUM serves a critical role in stabilisation of pipeline \
            flow rate variance. It is a core component of regulators that can \
            absorb peaks in throughput whilst continuing to release at a stable rate \
            protecting later components from these surges."
        },
        {
            id: 5,
            radius: 20,
            colour: 0xea80fc,
            skyColour: 0x98f389,
            outlineColour: 0xffffff,
            orbitRadius: 310,
            orbitTime: 80000,
            orbitRotationOffset: 4.2,
            rotationSpeed: 4,
            element: "PRAGMATIGEN",
            elementColour: 0xea80fc,
            description: "An element renowned for its stability. PRAGMATIGEN can \
            serve as a base in many reactions making it very versatile. As such \
            it is typically incorporated in multiple stages of a pipeline due to its \
            ability to be useful in almost any situation."
        }
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

window.explore.state =
{
    data: {
        visited: 0,
        planets: {
            0: false
        },
    },

    recordVisit: function(id)
    {
        window.explore.state.data.planets[id] = true;
        window.explore.state.updateVisited();
        window.explore.state.save();
    },

    updateVisited: function()
    {
        var visited = 0;
        for (var key in window.explore.state.data.planets)
        {
            if (!window.explore.state.data.planets.hasOwnProperty(key))
            {
                continue;
            }

            if (window.explore.state.data.planets[key])
            {
                visited++;
            }
        }
        window.explore.state.data.visited = visited;
    },

    save: function()
    {
        window.localStorage.setItem('kyle_bignell_explore', JSON.stringify(window.explore.state.data));
    },

    load: function()
    {
        var storedData = JSON.parse(window.localStorage.getItem('kyle_bignell_explore')) || {};
        if (storedData.planets)
        {
            window.explore.state.data = storedData;
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
        moveExplore();
        loadExplore();
    });
});

function moveExplore()
{
    var exploreDOM = document.getElementById("explore");

    var startPos = window.inExplore ? -100 : 0;
    var endPos = window.inExplore ? 0 : -100;
    var delta = window.inExplore ? 1 : -1;
    var currentPos = parseFloat(exploreDOM.style.left) || startPos;

    clearInterval(window.moveExploreIntervalID);
    window.moveExploreIntervalID = setInterval(frame, 5);

    function frame()
    {
        if (currentPos === endPos)
        {
            clearInterval(window.moveExploreIntervalID);
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

    window.explore.state.load();
    window.explore.game = new Phaser.Game(config);
    window.explore.stars.init();
}
