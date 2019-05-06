var SceneLaunch = function(config) {
    return new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function()
        {
            Phaser.Scene.call(this, { key: 'sceneLaunch' });

            this.sceneDimensions = {
                w: 3000,
                h: 4000
            };
            this.rocketDimensions = {
                w: 100,
                h: 125
            };
            this.cameraBuffer = 500;
            this.fading = false;

            var exploreToggleDOM = document.getElementById("explore-toggle");
            exploreToggleDOM.addEventListener("click", function()
            {
                handleVisible(window.inExplore, this.scene);
            }.bind(this));
        },

        init: function(data)
        {
            window.explore.currentScene = "sceneLaunch";
        },

        preload: function()
        {
            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
        },

        create: function()
        {
            this.physics.world.gravity.y = 200;

            var graphics = this.add.graphics();
            graphics.fillGradientStyle(0x000000, 0x000000, 0x83EAFF, 0x83EAFF);
            graphics.fillRect(0, this.cameraBuffer, this.sceneDimensions.w, this.sceneDimensions.h);

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
                maxParticles: 50
            }
            particlesManager = this.add.particles('fire');
            this.particlesEmitterLeft = particlesManager.createEmitter(particleConfig);
            this.particlesEmitterRight = particlesManager.createEmitter(particleConfig);

            this.rocket = this.physics.add.sprite(this.sceneDimensions.w / 2,
                                                  this.sceneDimensions.h - (this.rocketDimensions.h / 2),
                                                  'rocket');
            this.rocket.setOrigin(0.5, 0.5)
                       .setCollideWorldBounds(true);

            this.particlesEmitterLeft.startFollow(this.rocket, -this.rocket.width / 4, this.rocket.height / 1.75);
            this.particlesEmitterRight.startFollow(this.rocket, this.rocket.width / 4, this.rocket.height / 1.75);
            this.cameras.main.startFollow(this.rocket);

            zone = this.add.zone(0, 0).setSize(this.sceneDimensions.w, 3);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;

            this.physics.add.overlap(this.rocket, zone, function()
            {
                this.scene.start('sceneOverview');
            }, null, this);

            this.text = this.add.text(this.sceneDimensions.w / 2,
                                 this.sceneDimensions.h - 350,
                                 "Click to Launch",
                                 { font: "65px Roboto", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center" });
            this.text.setOrigin(0.5);
            this.textTween = this.tweens.add({
                targets: this.text,
                alpha: 0.3,
                ease: 'Sine',
                duration: 750,
                yoyo: true,
                repeat: -1
            });

            this.input.once('pointerdown', function()
            {
                this.rocket.body.setAccelerationY(-225);
                this.textTween.loop = false;
                this.textTween.stop();
                this.tweens.add({
                    targets: this.text,
                    alpha: 0,
                    duration: 750
                });
            }.bind(this));

            this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h)
            this.cameras.main.setBounds(0, this.cameraBuffer, this.sceneDimensions.w, this.sceneDimensions.h - this.cameraBuffer);
        },

        update: function()
        {
            if (this.rocket.body.acceleration.y < 0)
            {
                var ratio = this.rocket.y / this.sceneDimensions.h;
                this.cameras.main.shake(100, 0.0025 * ratio);

                var zoom = Math.max(ratio, 0.5);
                this.cameras.main.setZoom(zoom);

                this.particlesEmitterLeft.start();
                this.particlesEmitterRight.start();
            }
            else
            {
                this.particlesEmitterLeft.stop();
                this.particlesEmitterRight.stop();
            }

            var cameraAtTop = this.cameras.main.scrollY === (this.cameraBuffer + (config.height / 2));
            if (!this.fading && cameraAtTop)
            {
                this.fading = true;
                this.cameras.main.fadeOut(750);
            }
        }
    })
}
