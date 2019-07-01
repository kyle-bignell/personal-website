window.SceneOverview = function(config) {
    return new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function()
        {
            Phaser.Scene.call(this, { key: 'sceneOverview' });

            this.sceneDimensions = {
                w: config.width,
                h: config.height
            };
            this.rocketDimensions = {
                w: 100,
                h: 125
            };

            var exploreToggleDOM = document.getElementById("explore-toggle");
            exploreToggleDOM.addEventListener("click", function()
            {
                handleVisible(window.inExplore, this.scene);
            }.bind(this));
        },

        init: function(data)
        {
            window.explore.currentScene = "sceneOverview";
        },

        preload: function()
        {
            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
            this.load.image('planet-background-0', 'planet-background-0.jpg');
            this.load.image('planet-background-1', 'planet-background-1.jpg');
            this.load.image('planet-background-2', 'planet-background-2.jpg');
            this.load.image('planet-background-3', 'planet-background-3.jpg');
            this.load.image('planet-background-4', 'planet-background-4.jpg');
            this.load.image('planet-background-5', 'planet-background-5.jpg');
        },

        create: function()
        {
            var camera = this.cameras.main;
            var dragScale = this.plugins.get('rexpinchplugin').add(this);
            dragScale
              .on('drag1', function (dragScale) {
                var drag1Vector = dragScale.drag1Vector;
                camera.scrollX -= drag1Vector.x / camera.zoom;
                camera.scrollY -= drag1Vector.y / camera.zoom;
              }, this)
              .on('pinch', function (dragScale) {
                var scaleFactor = dragScale.scaleFactor;
                camera.zoom *= scaleFactor;
              }, this);

            this.physics.world.gravity.y = 0;
            this.physics.world.setBoundsCollision(true, true, true, true);

            this.starRenderTexture = this.add.renderTexture(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
            this.stars = this.add.graphics();
            this.stars.setVisible(false);
            for(var i = 0; i < window.explore.stars.data.length; i++)
            {
                var starData = window.explore.stars.data[i];
                var intensity = (1 - starData.z / window.explore.stars.MAX_DEPTH);
                this.stars.fillStyle(window.explore.stars.COLOUR, intensity);
                this.stars.fillCircle(starData.x, starData.y, intensity);
            }
            this.starRenderTexture.draw(this.stars);

            window.explore.config.planets.forEach(function(planet) {
                planet.outline = this.add.graphics();
                planet.outline.fillStyle(planet.outlineColour, 1);
                planet.outline.fillCircle(planet.x, planet.y, planet.radius + 3);
                planet.outline.setAlpha(0);

                planet.background = this.add.image(planet.x, planet.y, 'planet-background-' + planet.id);
                planet.background.setOrigin(0.5, 0.5);
                planet.background.scale = (planet.radius * 2) / planet.background.width;

                planet.graphics = this.add.graphics();
                planet.graphics.blendMode = 'MULTIPLY';
                planet.graphics.fillStyle(planet.colour, 1);
                planet.graphics.fillCircle(planet.x, planet.y, planet.radius);
                planet.graphics.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle(-planet.radius, -planet.radius, planet.radius * 2, planet.radius * 2),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    useHandCursor: true
                });
                planet.graphics.on('pointerdown', function (pointer) {
                    this.cameras.main.fadeOut(750, 0, 0, 0, function(camera, progress) {
                        if (progress === 1) {
                            this.scene.start('sceneOrbit', { id: planet.id });
                        }
                    }.bind(this));
                }.bind(this));
                planet.graphics.on('pointerover', function (pointer) {
                    planet.outline.setAlpha(1);
                }.bind(this));
                planet.graphics.on('pointerout', function (pointer) {
                    planet.outline.setAlpha(0);
                }.bind(this));

                planet.background.setMask(planet.graphics.createGeometryMask());

                planet.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, planet.orbitRadius);
                planet.orbitRotation = this.tweens.addCounter({
                    from: 0,
                    to: 6.28,
                    duration: planet.orbitTime,
                    repeat: -1
                });
            }.bind(this));

            this.cameras.main.fadeIn(750);
        },

        update: function()
        {
            window.explore.config.planets.forEach(function(planet) {
                Phaser.Actions.PlaceOnCircle(
                    [planet.background],
                    planet.orbitCircle,
                    (planet.orbitRotation.getValue() + planet.orbitRotationOffset)
                );
                Phaser.Actions.PlaceOnCircle(
                    [planet.graphics],
                    planet.orbitCircle,
                    (planet.orbitRotation.getValue() + planet.orbitRotationOffset)
                );
                Phaser.Actions.PlaceOnCircle(
                    [planet.outline],
                    planet.orbitCircle,
                    (planet.orbitRotation.getValue() + planet.orbitRotationOffset)
                );
            });
        }
    })
}
