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
                    { radius: 40, x: 0, y: 0, colour: 0xff0000, orbitRadius: 0, orbitTime: 30000, orbitRotation: null, orbitCircle: null, graphics: null },
                    { radius: 15, x: 0, y: 0, colour: 0x00ff00, orbitRadius: 75, orbitTime: 30000, orbitRotation: null, orbitCircle: null, graphics: null },
                    { radius: 20, x: 0, y: 0, colour: 0x0000ff, orbitRadius: 120, orbitTime: 30000, orbitRotation: null, orbitCircle: null, graphics: null },
                    { radius: 30, x: 0, y: 0, colour: 0x00ffff, orbitRadius: 180, orbitTime: 30000, orbitRotation: null, orbitCircle: null, graphics: null },
                    { radius: 22, x: 0, y: 0, colour: 0xffff00, orbitRadius: 250, orbitTime: 30000, orbitRotation: null, orbitCircle: null, graphics: null },
                    { radius: 18, x: 0, y: 0, colour: 0xff00ff, orbitRadius: 310, orbitTime: 30000, orbitRotation: null, orbitCircle: null, graphics: null }
                ]
            };

            background = this.add.graphics();
            background.fillGradientStyle(0x000000, 0x000000, 0x333333, 0x333333);
            background.fillRect(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);

            this.config.planets.forEach(function(planet) {
                planet.graphics = this.add.graphics();
                planet.graphics.fillStyle(planet.colour, 1);
                planet.graphics.fillCircle(planet.x, planet.y, planet.radius);
                planet.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, planet.orbitRadius);
                planet.orbitRotation = this.tweens.addCounter({
                    from: 0,
                    to: 6.28,
                    duration: planet.orbitTime,
                    repeat: -1
                });
                // debugger
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
                    planet.orbitRotation.getValue()
                );
                // planet.graphics.rotation = planet.orbitRotation.getValue() + 3.14;
            });
        }
    })
}
