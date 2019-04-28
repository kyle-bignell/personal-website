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
        },

        init: function(data)
        {

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
            this.physics.world.setBoundsCollision(true, true, true, true);

            background = this.add.graphics();
            background.fillGradientStyle(0x000000, 0x000000, 0x333333, 0x333333);
            background.fillRect(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);

            window.explore.config.planets.forEach(function(planet) {
                planet.outline = this.add.graphics();
                planet.outline.fillStyle(planet.outlineColour, 1);
                planet.outline.fillCircle(planet.x, planet.y, planet.radius + 3);
                planet.outline.setAlpha(0);
                planet.graphics = this.add.graphics();
                planet.graphics.fillStyle(planet.colour, 1);
                planet.graphics.fillCircle(planet.x, planet.y, planet.radius);
                planet.graphics.setInteractive({
                    hitArea: new Phaser.Geom.Rectangle(-planet.radius, -planet.radius, planet.radius * 2, planet.radius * 2),
                    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                    useHandCursor: true
                });
                planet.graphics.on('pointerdown', function (pointer) {
                    this.scene.start('sceneOrbit', { id: planet.id });
                }.bind(this));
                planet.graphics.on('pointerover', function (pointer) {
                    planet.outline.setAlpha(1);
                }.bind(this));
                planet.graphics.on('pointerout', function (pointer) {
                    planet.outline.setAlpha(0);
                }.bind(this));

                planet.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, planet.orbitRadius);
                planet.orbitRotation = this.tweens.addCounter({
                    from: 0,
                    to: 6.28,
                    duration: planet.orbitTime,
                    repeat: -1
                });
            }.bind(this));
        },

        update: function()
        {
            window.explore.config.planets.forEach(function(planet) {
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
