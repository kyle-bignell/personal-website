window.SceneOrbit = function(config) {
    return new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function()
        {
            Phaser.Scene.call(this, { key: 'sceneOrbit' });

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
            this.physics.world.on("worldbounds", function (body) {
                body.setCollideWorldBounds(false);
                body.onWorldBounds = false;
                timedEvent = this.time.delayedCall(2500, function() {
                    this.scene.start('sceneOverview');
                }, [], this);
            }.bind(this));

            this.config = {
                planetRadius: 200,
                orbitRadius: 300,
                orbitTime: 30000
            };

            var graphics = this.add.graphics();
            graphics.fillGradientStyle(0x000000, 0x000000, 0x333333, 0x333333);
            graphics.fillRect(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);

            graphics.fillStyle(0xff0000, 1);
            graphics.fillCircle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.planetRadius);

            this.rocket = this.physics.add.sprite(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, 'rocket');
            this.rocket.setOrigin(0.5, 0.5)
                       .setScale(0.6, 0.6);
            this.rocket.body.setCollideWorldBounds(true);
            this.rocket.body.onWorldBounds = true;

            this.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.orbitRadius);
            this.orbitRotation = this.tweens.addCounter({
                from: 0,
                to: 6.28,
                duration: this.config.orbitTime,
                repeat: -1
            });

            this.input.once('pointerdown', function()
            {
                this.tweens.add({
                    targets: this.orbitCircle,
                    radius: this.config.orbitRadius * 2.5,
                    ease: Phaser.Math.Easing.Expo.In,
                    duration: 5000
                });
                this.tweens.add({
                    targets: this.orbitRotation,
                    timeScale: 10,
                    ease: Phaser.Math.Easing.Sine.In,
                    duration: 4500
                });
            }.bind(this));

            this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
            this.cameras.main.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
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
    })
}
