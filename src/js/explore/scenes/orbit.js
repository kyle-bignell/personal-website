window.SceneOrbit = function(config) {
    return new Phaser.Class({
        Extends: Phaser.Scene,

        exitButton: {
          background: null,
          foreground: null,
          text: null
        },

        landButton: {
          background: null,
          foreground: null,
          text: null
        },

        initialize: function(data)
        {
            Phaser.Scene.call(this, { key: 'sceneOrbit' });

            this.sceneDimensions = {
                w: config.width,
                h: config.height
            };
            this.config = {
                planetRadius: 200,
                orbitRadius: 270,
                orbitTime: 30000
            };

            var exploreToggleDOM = document.getElementById("explore-toggle");
            exploreToggleDOM.addEventListener("click", function()
            {
                handleVisible(window.inExplore, this.scene);
            }.bind(this));
        },

        initCamera: function()
        {
            this.cameras.main.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
        },

        initPhysics: function()
        {
            this.physics.world.gravity.y = 0;
            this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
            this.physics.world.setBoundsCollision(true, true, true, true);
            this.physics.world.on("worldbounds", function (body) {
                body.setCollideWorldBounds(false);
                body.onWorldBounds = false;

                this.time.delayedCall(50, function() {
                    body.gameObject.setVisible(false);
                    this.particlesEmitterLeft.stop();
                    this.particlesEmitterRight.stop();
                }, [], this);

                this.time.delayedCall(1000, function() {
                    this.cameras.main.fadeOut(750, 0, 0, 0, function(camera, progress) {
                        if (progress === 1) {
                            this.scene.start('sceneOverview');
                        }
                    }.bind(this));
                }, [], this);
            }.bind(this));
        },

        initOrbit: function()
        {
            this.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.orbitRadius);
            this.orbitRotation = this.tweens.addCounter({
                from: 0,
                to: 6.28,
                duration: this.config.orbitTime,
                repeat: -1
            });
        },

        init: function(data)
        {
            window.explore.currentScene = "sceneOrbit";

            this.planetID = data.id || 0;

            this.initCamera();
            this.initPhysics();
            this.initOrbit();
        },

        preload: function()
        {
            this.load.path = 'assets/explore/';
            this.load.image('rocket', 'rocket.png');
            this.load.image('fire', 'fire.png');
            this.load.image('planet-background-high-0', 'planets/planet-background-high-0.jpg');
            this.load.image('planet-background-high-1', 'planets/planet-background-high-1.jpg');
            this.load.image('planet-background-high-2', 'planets/planet-background-high-2.jpg');
            this.load.image('planet-background-high-3', 'planets/planet-background-high-3.jpg');
            this.load.image('planet-background-high-4', 'planets/planet-background-high-4.jpg');
            this.load.image('planet-background-high-5', 'planets/planet-background-high-5.jpg');
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
        },

        createPlanet: function()
        {
            var background = this.add.image(
                this.sceneDimensions.w / 2,
                this.sceneDimensions.h / 2,
                'planet-background-high-' + this.planetID);
            background.setOrigin(0.5, 0.5);
            background.scale = (this.config.planetRadius * 2) / background.width;

            var graphics = this.add.graphics();
            graphics.fillStyle(window.explore.config.planets[this.planetID].colour, 1);
            graphics.fillCircle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.planetRadius);
            graphics.blendMode = 'MULTIPLY';

            background.setMask(graphics.createGeometryMask());

            this.tweens.add({
                targets: background,
                rotation: 6.24,
                ease: Phaser.Math.Easing.Linear.Linear,
                duration: 25000 * window.explore.config.planets[this.planetID].rotationSpeed,
                repeat: -1
            });
        },

        createStatus: function()
        {
            this.status = this.add.text(
                this.sceneDimensions.w / 2,
                this.sceneDimensions.h / 2,
                window.explore.state.data.planets[this.planetID] ? "✔" : "?",
                {
                    font: "150px Roboto",
                    fill: window.explore.state.data.planets[this.planetID] ? "#66ff66" : "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "center"
                });
            this.status.setOrigin(0.5);
        },

        createRocket: function()
        {
            var particleConfig = {
                on: false,
                alpha: { start: 1, end: 0 },
                scale: { start: 0.65, end: 1.5 },
                accelerationY: 0,
                gravityY: 0,
                angle: { min: -85, max: -95 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 500, max: 600 },
                blendMode: 'ADD',
                frequency: 10,
                maxParticles: 200
            }
            particlesManager = this.add.particles('fire');
            this.particlesEmitterLeft = particlesManager.createEmitter(particleConfig);
            this.particlesEmitterRight = particlesManager.createEmitter(particleConfig);

            var rocketScale = (window.explore.config.planets[0].radius / window.explore.config.planets[this.planetID].radius) / 2;
            rocketScale *= 0.4;
            this.rocket = this.physics.add.sprite(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, 'rocket');
            this.rocket.setOrigin(0.5, 0.5)
                       .setScale(rocketScale, rocketScale);
            this.rocket.body.setCollideWorldBounds(true);
            this.rocket.body.onWorldBounds = true;
            this.rocket.body.setSize(1, 1, true);

            this.particlesEmitterLeft.setScale(rocketScale);
            this.particlesEmitterRight.setScale(rocketScale);
        },

        createExitButton: function()
        {
            var buttonConfig = {
              x: this.sceneDimensions.w - 260,
              y: -25,
              w: 250,
              h: 85,
              r: 25,
              b: 3
            };
            var backgroundColour = 0xfa8200;
            var foregroundColour = 0x4b4b4b;
            var tweenConfig = {
              orbitRadiusMultiplier: 2.5,
              orbitRadiusDuration: 5000,
              orbitSpeedMultiplier: 10,
              orbitSpeedDuration: 4500
            }

            this.exitButton.background = this.add.graphics();
            this.exitButton.background.fillStyle(backgroundColour, 1);
            this.exitButton.background.fillRoundedRect(
              buttonConfig.x - buttonConfig.b,
              buttonConfig.y - buttonConfig.b,
              buttonConfig.w + (buttonConfig.b * 2),
              buttonConfig.h + (buttonConfig.b * 2),
            buttonConfig.r);

            this.exitButton.foreground = this.add.graphics();
            this.exitButton.foreground.fillStyle(foregroundColour, 1);
            this.exitButton.foreground.fillRoundedRect(
              buttonConfig.x,
              buttonConfig.y,
              buttonConfig.w,
              buttonConfig.h,
              buttonConfig.r);
            this.exitButton.foreground.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(
                  buttonConfig.x,
                  buttonConfig.y,
                  buttonConfig.w,
                  buttonConfig.h),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            });

            this.exitButton.text = this.add.text(
                this.sceneDimensions.w - 135,
                27.5,
                "Exit Orbit",
                {
                    font: "50px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.exitButton.text.setOrigin(0.5);

            this.exitButton.foreground.once('pointerdown', function()
            {
                this.fadeButtons();

                this.particlesEmitterLeft.start();
                this.particlesEmitterRight.start();

                this.tweens.add({
                    targets: this.orbitCircle,
                    radius: this.config.orbitRadius * tweenConfig.orbitRadiusMultiplier,
                    ease: Phaser.Math.Easing.Expo.In,
                    duration: tweenConfig.orbitRadiusDuration
                });
                this.tweens.add({
                    targets: this.orbitRotation,
                    timeScale: tweenConfig.orbitSpeedMultiplier,
                    ease: Phaser.Math.Easing.Sine.In,
                    duration: tweenConfig.orbitSpeedDuration
                });
            }.bind(this));
        },

        createLandButton: function()
        {
            var buttonConfig = {
              x: 10,
              y: -25,
              w: 250,
              h: 85,
              r: 25,
              b: 3
            };
            var backgroundColour = 0xfa8200;
            var foregroundColour = 0x4b4b4b;
            var tweenConfig = {
              orbitRadiusMultiplier: 0.75,
              orbitRadiusDuration: 5000,
              orbitSpeedMultiplier: 10,
              orbitSpeedDuration: 4500,
              rocketScaleTarget: 0,
              rocketScaleDuration: 5000,
              particleScaleTarget: 0,
              particleScaleDuration: 5000
            }

            this.landButton.background = this.add.graphics();
            this.landButton.background.fillStyle(backgroundColour, 1);
            this.landButton.background.fillRoundedRect(
              buttonConfig.x - buttonConfig.b,
              buttonConfig.y - buttonConfig.b,
              buttonConfig.w + (buttonConfig.b * 2),
              buttonConfig.h + (buttonConfig.b * 2),
            buttonConfig.r);

            this.landButton.foreground = this.add.graphics();
            this.landButton.foreground.fillStyle(foregroundColour, 1);
            this.landButton.foreground.fillRoundedRect(
              buttonConfig.x,
              buttonConfig.y,
              buttonConfig.w,
              buttonConfig.h,
              buttonConfig.r);
            this.landButton.foreground.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(
                  buttonConfig.x,
                  buttonConfig.y,
                  buttonConfig.w,
                  buttonConfig.h),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            });

            this.landButton.text = this.add.text(
                135,
                27.5,
                "Land",
                {
                    font: "50px Roboto",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5,
                    align: "center"
                });
            this.landButton.text.setOrigin(0.5);

            this.landButton.foreground.once('pointerdown', function()
            {
                this.fadeButtons();

                this.particlesEmitterLeft.start();
                this.particlesEmitterRight.start();

                var particleEmitterTargets = {
                  scale: this.particlesEmitterLeft.scaleX.propertyValue
                }
                this.tweens.add({
                    targets: particleEmitterTargets,
                    scale: tweenConfig.particleScaleTarget,
                    duration: tweenConfig.particleScaleDuration,
                    onUpdate: function() {
                      this.particlesEmitterLeft.setScale(particleEmitterTargets.scale);
                      this.particlesEmitterRight.setScale(particleEmitterTargets.scale);
                    },
                    onUpdateScope: this
                });

                this.tweens.add({
                    targets: this.orbitCircle,
                    radius: this.config.orbitRadius * tweenConfig.orbitRadiusMultiplier,
                    ease: Phaser.Math.Easing.Expo.In,
                    duration: tweenConfig.orbitRadiusDuration
                });
                this.tweens.add({
                    targets: this.orbitRotation,
                    timeScale: tweenConfig.orbitSpeedMultiplier,
                    ease: Phaser.Math.Easing.Sine.In,
                    duration: tweenConfig.orbitSpeedDuration
                });
                this.tweens.add({
                    targets: this.rocket,
                    scale: tweenConfig.rocketScaleTarget,
                    duration: tweenConfig.rocketScaleDuration
                });

                this.time.delayedCall(tweenConfig.rocketScaleDuration, function() {
                    this.cameras.main.fadeOut(750, 0, 0, 0, function(camera, progress) {
                        if (progress === 1) {
                            this.scene.start('sceneLaunch', { id: this.planetID });
                        }
                    }.bind(this));
                }, [], this);
            }.bind(this));
        },

        fadeButtons: function() {
            this.exitButton.foreground.removeAllListeners();
            this.landButton.foreground.removeAllListeners();

            var tweenConfig = {
              buttonAlphaTarget: 0,
              buttonFadeDuration: 750
            }
            this.tweens.add({
                targets: [this.exitButton.background, this.exitButton.foreground, this.exitButton.text],
                alpha: tweenConfig.buttonAlphaTarget,
                duration: tweenConfig.buttonFadeDuration
            });
            this.tweens.add({
                targets: [this.landButton.background, this.landButton.foreground, this.landButton.text],
                alpha: tweenConfig.buttonAlphaTarget,
                duration: tweenConfig.buttonFadeDuration
            });
        },

        create: function()
        {
            this.createCameraHandler();
            this.createBackground();
            this.createPlanet();
            this.createStatus();
            this.createRocket();
            this.createExitButton();
            this.createLandButton();

            this.cameras.main.fadeIn(750);
        },

        updateRocket: function()
        {
            Phaser.Actions.PlaceOnCircle(
                [this.rocket],
                this.orbitCircle,
                this.orbitRotation.getValue()
            );
            this.rocket.rotation = this.orbitRotation.getValue() + 3.14;

            var xDistance = 15 * this.rocket.scaleX;
            var yDistance = 75 * this.rocket.scaleY;
            var leftOffset = Phaser.Math.Rotate({x: xDistance, y: yDistance}, this.orbitRotation.getValue() + 3.14);
            var rightOffset = Phaser.Math.Rotate({x: -xDistance, y: yDistance}, this.orbitRotation.getValue() + 3.14);
            this.particlesEmitterLeft.setPosition(this.rocket.x + leftOffset.x, this.rocket.y + leftOffset.y);
            this.particlesEmitterRight.setPosition(this.rocket.x + rightOffset.x, this.rocket.y + rightOffset.y);
        },

        update: function()
        {
            this.updateRocket();
        }
    })
}
