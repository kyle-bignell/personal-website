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

            this.config = {
                planets: [
                    { id: 1, radius: 40, x: 0, y: 0, colour: 0xff0000, orbitRadius: 0, orbitTime: 1, orbitRotation: null, orbitRotationOffset: 0, orbitCircle: null, graphics: null },
                    { id: 2, radius: 15, x: 0, y: 0, colour: 0x00ff00, orbitRadius: 75, orbitTime: 5000, orbitRotation: null, orbitRotationOffset: 0, orbitCircle: null, graphics: null },
                    { id: 3, radius: 20, x: 0, y: 0, colour: 0x0000ff, orbitRadius: 120, orbitTime: 10000, orbitRotation: null, orbitRotationOffset: 1.5, orbitCircle: null, graphics: null },
                    { id: 4, radius: 30, x: 0, y: 0, colour: 0x00ffff, orbitRadius: 180, orbitTime: 30000, orbitRotation: null, orbitRotationOffset: 5.7, orbitCircle: null, graphics: null },
                    { id: 5, radius: 22, x: 0, y: 0, colour: 0xffff00, orbitRadius: 250, orbitTime: 56000, orbitRotation: null, orbitRotationOffset: 3.3, orbitCircle: null, graphics: null },
                    { id: 6, radius: 18, x: 0, y: 0, colour: 0xff00ff, orbitRadius: 310, orbitTime: 80000, orbitRotation: null, orbitRotationOffset: 4.2, orbitCircle: null, graphics: null }
                ]
            };

            background = this.add.graphics();
            background.fillGradientStyle(0x000000, 0x000000, 0x333333, 0x333333);
            background.fillRect(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);

            this.config.planets.forEach(function(planet) {
                planet.graphics = this.add.graphics();
                planet.graphics.fillStyle(planet.colour, 1);
                planet.graphics.fillCircle(planet.x, planet.y, planet.radius);
                planet.graphics.setInteractive({ hitArea: new Phaser.Geom.Rectangle(-planet.radius, -planet.radius, planet.radius * 2, planet.radius * 2), hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true});
                planet.graphics.on('pointerdown', function (pointer) {
                    this.scene.start('sceneOrbit', { id: planet.id });
                }.bind(this));

                planet.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, planet.orbitRadius);
                planet.orbitRotation = this.tweens.addCounter({
                    from: 0,
                    to: 6.28,
                    duration: planet.orbitTime,
                    repeat: -1
                });
            }.bind(this))

            // this.rocket = this.physics.add.sprite(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, 'rocket');
            // this.rocket.setOrigin(0.5, 0.5)
            //            .setScale(0.6, 0.6);
            // this.rocket.body.setCollideWorldBounds(true);
            // this.rocket.body.onWorldBounds = true;

            // this.input.once('pointerdown', function()
            // {
            //     this.tweens.add({
            //         targets: this.orbitCircle,
            //         radius: this.config.orbitRadius * 2.5,
            //         ease: Phaser.Math.Easing.Expo.In,
            //         duration: 5000
            //     });
            //     this.tweens.add({
            //         targets: this.orbitRotation,
            //         timeScale: 10,
            //         ease: Phaser.Math.Easing.Sine.In,
            //         duration: 4500
            //     });
            // }.bind(this));

            // this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
            // this.cameras.main.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
        },

        update: function()
        {
            this.config.planets.forEach(function(planet) {
                Phaser.Actions.PlaceOnCircle(
                    [planet.graphics],
                    planet.orbitCircle,
                    (planet.orbitRotation.getValue() + planet.orbitRotationOffset)
                );
            });
        }
    })
}
