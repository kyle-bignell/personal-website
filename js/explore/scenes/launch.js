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
            this.config = {
                planetRadius: 2000,
                orbitRadius: 270,
                orbitTime: 30000,
                rocketStart: 148
            };
            this.cameraBuffer = 500;

            var exploreToggleDOM = document.getElementById("explore-toggle");
            exploreToggleDOM.addEventListener("click", function()
            {
                handleVisible(window.inExplore, this.scene);
            }.bind(this));
        },

        initCamera: function()
        {
            this.cameras.main.setBounds(0, this.cameraBuffer, this.sceneDimensions.w, this.sceneDimensions.h - this.cameraBuffer);
        },

        initPhysics: function()
        {
            this.physics.world.gravity.y = 200;
            this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h - this.config.rocketStart);

            if (this.rocket)
            {
                this.physics.add.existing(this.rocket);
            }
        },

        init: function(data)
        {
            window.explore.currentScene = "sceneLaunch";

            this.planetID = data.id || 0;
            this.fading = false;

            this.initCamera();
            this.initPhysics();
        },

        preload: function()
        {
            var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexpinchplugin.min.js';
            this.load.plugin('rexpinchplugin', url, true);

            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
            this.load.image('planet-background-high-0', 'planets/planet-background-high-0.jpg');
            this.load.image('planet-background-high-1', 'planets/planet-background-high-1.jpg');
            this.load.image('planet-background-high-2', 'planets/planet-background-high-2.jpg');
            this.load.image('planet-background-high-3', 'planets/planet-background-high-3.jpg');
            this.load.image('planet-background-high-4', 'planets/planet-background-high-4.jpg');
            this.load.image('planet-background-high-5', 'planets/planet-background-high-5.jpg');
            this.load.image('element-0', 'elements/element-0.png');
            this.load.image('element-1', 'elements/element-1.png');
            this.load.image('element-2', 'elements/element-2.png');
            this.load.image('element-3', 'elements/element-3.png');
            this.load.image('element-4', 'elements/element-4.png');
            this.load.image('element-5', 'elements/element-5.png');
        },

        createCameraHandler: function()
        {
            var camera = this.cameras.main;
            var dragScale = this.plugins.get('rexpinchplugin').add(this);
            dragScale
              .on('drag1', function (dragScale) {
                var drag1Vector = dragScale.drag1Vector;
                camera.scrollX = camera.scrollX - (drag1Vector.x / camera.zoom);
                camera.scrollY =  camera.scrollY - (drag1Vector.y / camera.zoom);
              }, this)
              .on('pinch', function (dragScale) {
                var scaleFactor = dragScale.scaleFactor;
                camera.zoom = Math.max(1, (camera.zoom * scaleFactor));
              }, this);
        },

        createBackground: function()
        {
            var endColour = 0x000000;
            var startColour = window.explore.config.planets[this.planetID].skyColour
            var graphics = this.add.graphics();
            graphics.fillGradientStyle(endColour, endColour, startColour, startColour);
            graphics.fillRect(0, this.cameraBuffer, this.sceneDimensions.w, this.sceneDimensions.h);
        },

        createPlanet: function()
        {
            var centreX = this.sceneDimensions.w / 2;
            var centreY = this.sceneDimensions.h + 1850;

            var background = this.add.image(centreX, centreY, 'planet-background-high-' + this.planetID);
            background.setOrigin(0.5, 0.5);
            background.scale = (this.config.planetRadius * 2) / background.width;

            var graphics = this.add.graphics();
            graphics.fillStyle(window.explore.config.planets[this.planetID].colour, 1);
            graphics.fillCircle(centreX, centreY, this.config.planetRadius);
            graphics.blendMode = 'MULTIPLY';

            background.setMask(graphics.createGeometryMask());
        },

        createRocket: function()
        {
            var particleConfig = {
                on: false,
                alpha: { start: 1, end: 0 },
                scale: { start: 0.45, end: 1.25 },
                accelerationY: 225,
                gravityY: 200,
                angle: { min: -85, max: -95 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 500, max: 600 },
                blendMode: 'ADD',
                frequency: 50,
                maxParticles: 200
            }
            particlesManager = this.add.particles('fire');
            this.particlesEmitterLeft = particlesManager.createEmitter(particleConfig);
            this.particlesEmitterRight = particlesManager.createEmitter(particleConfig);

            var rocketScale = 0.6;
            this.rocket = this.physics.add.sprite(
                this.sceneDimensions.w / 2,
                this.sceneDimensions.h - ((this.rocketDimensions.h * rocketScale) / 2) - this.config.rocketStart,
                'rocket');
            this.rocket.setOrigin(0.5, 0.5)
                       .setCollideWorldBounds(true)
                       .setScale(rocketScale);

            this.particlesEmitterLeft.startFollow(
                this.rocket,
                -(this.rocket.width * rocketScale) / 4,
                (this.rocket.height * rocketScale) / 1.8);
            this.particlesEmitterRight.startFollow(
                this.rocket,
                (this.rocket.width * rocketScale) / 4,
                (this.rocket.height * rocketScale) / 1.8);
            this.cameras.main.startFollow(this.rocket);
        },

        createExitZone: function()
        {
            zone = this.add.zone(0, 0).setSize(this.sceneDimensions.w, 3);
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.body.moves = false;

            this.physics.add.overlap(this.rocket, zone, function()
            {
                this.particlesEmitterLeft.stop();
                this.particlesEmitterRight.stop();

                this.scene.start('sceneOverview');
            }, null, this);
        },

        createLaunchButton: function()
        {
            var button = {
              x: (this.sceneDimensions.w / 2) - 130,
              y: this.sceneDimensions.h - 400,
              w: 260,
              h: 85,
              r: 25,
              b: 3
            };

            this.launchButtonBorder = this.add.graphics();
            this.launchButtonBorder.fillStyle(0xfa8200, 1);
            this.launchButtonBorder.setAlpha(0);
            this.launchButtonBorder.fillRoundedRect(
                button.x - button.b,
                button.y - button.b,
                button.w + (button.b * 2),
                button.h + (button.b * 2),
                button.r);

            this.launchButton = this.add.graphics();
            this.launchButton.fillStyle(0x4b4b4b, 1);
            this.launchButton.setAlpha(0);
            this.launchButton.fillRoundedRect(button.x, button.y, button.w, button.h, button.r);
            this.launchButton.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(button.x, button.y, button.w, button.h),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            });

            this.launchButtonText = this.add.text(
                this.sceneDimensions.w / 2,
                this.sceneDimensions.h - 360,
                "Launch",
                {
                    font: "55px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.launchButtonText.setOrigin(0.5);
            this.launchButtonText.setAlpha(0);

            this.tweens.add({
                targets: [
                    this.launchButtonBorder,
                    this.launchButton,
                    this.launchButtonText,
                ],
                alpha: 1,
                duration: 500
            });

            this.time.delayedCall(500, function() {
                this.pulseTween = this.tweens.add({
                    targets: [
                        this.launchButtonBorder,
                        this.launchButtonText
                    ],
                    alpha: 0.4,
                    ease: 'Sine',
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                        });

                this.launchButton.once('pointerdown', function()
                {
                  this.particlesEmitterLeft.start();
                  this.particlesEmitterRight.start();

                  this.pulseTween.stop();

                  var rocketTargets = {
                    accelerationY: 0
                  }
                  this.tweens.add({
                      targets: rocketTargets,
                      accelerationY: -225,
                      duration: 250,
                      onUpdate: function() {
                        this.rocket.body.setAccelerationY(rocketTargets.accelerationY);
                      },
                      onUpdateScope: this
                  });

                  this.tweens.add({
                      targets: [
                          this.launchButtonBorder,
                          this.launchButton,
                          this.launchButtonText,
                          this.statusText,
                          this.summaryText,
                          this.samplesText,
                          this.samplesValueText
                      ],
                      alpha: 0,
                      duration: 750
                  });
                }.bind(this));
            }, [], this);
        },

        createSummary: function()
        {
            this.statusText = this.add.text(
                this.sceneDimensions.w / 2 - 475,
                this.sceneDimensions.h - 675,
                "Status:",
                {
                    font: "40px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.statusText.setAlpha(0);

            this.summaryText = this.add.text(
                this.sceneDimensions.w / 2 - 335,
                this.sceneDimensions.h - 675,
                window.explore.config.planets[this.planetID].element + " collected",
                {
                    font: "40px Roboto",
                    fill: "#66ff66",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.summaryText.setAlpha(0);

            this.samplesText = this.add.text(
                this.sceneDimensions.w / 2 + 200,
                this.sceneDimensions.h - 675,
                "Samples:",
                {
                    font: "40px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.samplesText.setAlpha(0);

            this.samplesValueText = this.add.text(
                this.sceneDimensions.w / 2 + 385,
                this.sceneDimensions.h - 675,
                window.explore.state.data.visited + " / 6",
                {
                    font: "40px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.samplesValueText.setAlpha(0);

            this.tweens.add({
                targets: [
                    this.statusText,
                    this.summaryText,
                    this.samplesText,
                    this.samplesValueText
                ],
                alpha: 1,
                duration: 500
            });
        },

        createPickup: function()
        {
            var box = {
              x: (this.sceneDimensions.w / 2),
              y: this.sceneDimensions.h - 625,
              w: 450,
              h: 350,
              r: 25,
              b: 3
            };

            this.boxBorder = this.add.graphics();
            this.boxBorder.fillStyle(0xfa8200, 0.5);
            this.boxBorder.setAlpha(0);
            this.boxBorder.fillRoundedRect(
                box.x - box.b,
                box.y - box.b,
                box.w + (box.b * 2),
                box.h + (box.b * 2),
                box.r);

            this.box = this.add.graphics();
            this.box.fillStyle(0x4b4b4b, 0.5);
            this.box.setAlpha(0);
            this.box.fillRoundedRect(
                box.x,
                box.y,
                box.w,
                box.h,
                box.r);

            this.titleText = this.add.text(
                this.sceneDimensions.w / 2 + 225,
                this.sceneDimensions.h - 585,
                window.explore.config.planets[this.planetID].element,
                {
                    font: "50px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.titleText.setOrigin(0.5);
            this.titleText.setAlpha(0);

            this.detailText = this.add.text(
                this.sceneDimensions.w / 2 + 225,
                this.sceneDimensions.h - 460,
                window.explore.config.planets[this.planetID].description,
                {
                    font: "20px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center",
                    wordWrap: { width: 420, useAdvancedWrap: true }
                });
            this.detailText.setOrigin(0.5);
            this.detailText.setAlpha(0);

            var button = {
              x: (this.sceneDimensions.w / 2) + 50,
              y: this.sceneDimensions.h - 355,
              w: 350,
              h: 60,
              r: 25,
              b: 3
            };

            this.buttonBorder = this.add.graphics();
            this.buttonBorder.fillStyle(0xfa8200, 1);
            this.buttonBorder.setAlpha(0);
            this.buttonBorder.fillRoundedRect(
                button.x - button.b,
                button.y - button.b,
                button.w + (button.b * 2),
                button.h + (button.b * 2),
                button.r);

            this.button = this.add.graphics();
            this.button.fillStyle(0x4b4b4b, 1);
            this.button.setAlpha(0);
            this.button.fillRoundedRect(button.x, button.y, button.w, button.h, button.r);
            this.button.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(button.x, button.y, button.w, button.h),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            });
            this.button.once('pointerdown', function()
            {
                window.explore.state.recordVisit(this.planetID);

                this.tweens.add({
                    targets: [
                        this.titleText,
                        this.detailText,
                        this.boxBorder,
                        this.box,
                        this.buttonBorder,
                        this.button,
                        this.collectText
                    ],
                    alpha: 0,
                    duration: 750
                });

                this.pickupPulseTween.stop();
                this.tweens.add({
                    targets: [
                        this.pickup
                    ],
                    x: this.sceneDimensions.w / 2,
                    ease: Phaser.Math.Easing.Back.In,
                    duration: 1500
                });
                this.tweens.add({
                    targets: [
                        this.pickup
                    ],
                    y: this.sceneDimensions.h - 200,
                    ease: Phaser.Math.Easing.Sine.InOut,
                    duration: 1500
                });
                this.tweens.add({
                    targets: [
                        this.pickup
                    ],
                    alpha: 0,
                    scale: 0,
                    ease: Phaser.Math.Easing.Sine.In,
                    duration: 1750
                });

                this.time.delayedCall(1250, function() {
                    this.pickupRotationTween.stop();
                    this.createLaunchButton();
                    this.createSummary();
                }, [], this);
            }.bind(this));

            this.collectText = this.add.text(
                this.sceneDimensions.w / 2 + 225,
                this.sceneDimensions.h - 325,
                "Collect Sample",
                {
                    font: "34px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.collectText.setOrigin(0.5);
            this.collectText.setAlpha(0);

            var pickup = {
                x: (this.sceneDimensions.w / 2) - 250,
                y: this.sceneDimensions.h - 450
            };

            this.pickup = this.add.image(pickup.x, pickup.y, 'element-' + this.planetID);
            this.pickup.setOrigin(0.5, 0.5);
            this.pickup.setAlpha(0);
            this.pickup.setScale(1.5);
            this.pickup.tint = window.explore.config.planets[this.planetID].elementColour;

            this.pickupPulseTween = this.tweens.add({
                targets: [
                    this.pickup
                ],
                scale: 1.75,
                ease: Phaser.Math.Easing.Sine.InOut,
                duration: 1500,
                yoyo: true,
                repeat: -1
            });

            this.pickupRotationTween = this.tweens.add({
                targets: [
                    this.pickup
                ],
                rotation: 6.28,
                ease: Phaser.Math.Easing.Linear.Linear,
                duration: 10000,
                repeat: -1
            });

            this.tweens.add({
                targets: [
                    this.boxBorder,
                    this.box,
                    this.titleText,
                    this.detailText,
                    this.buttonBorder,
                    this.button,
                    this.collectText,
                    this.pickup,
                ],
                alpha: 1,
                duration: 500
            });
        },

        create: function()
        {
            this.createCameraHandler();
            this.createBackground();
            this.createPlanet();
            this.createRocket();
            this.createExitZone();

            if (window.explore.state.data.planets[this.planetID])
            {
                this.createLaunchButton();
                this.createSummary();
            }
            else
            {
                this.createPickup();
            }
        },

        updateRocket: function()
        {
            if (this.rocket.body.acceleration.y < 0)
            {
                var ratio = (this.rocket.y + this.config.rocketStart) / this.sceneDimensions.h;
                this.cameras.main.shake(100, 0.005 * ratio);

                var zoom = Math.max(ratio, 0.5);
                this.cameras.main.setZoom(zoom);
            }
        },

        updateCamera: function()
        {
            var cameraAtTop = this.cameras.main.scrollY === (this.cameraBuffer + (config.height / 2));
            if (!this.fading && cameraAtTop)
            {
                this.fading = true;
                this.cameras.main.fadeOut(750);
            }
        },

        update: function()
        {
            this.updateRocket();
            this.updateCamera();
        }
    })
}
