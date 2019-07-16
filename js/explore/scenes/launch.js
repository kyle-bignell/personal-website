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
              y: this.sceneDimensions.h - 650,
              w: 260,
              h: 85,
              r: 25,
              b: 3
            };

            this.buttonBackground = this.add.graphics();
            this.buttonBackground.fillStyle(0xfa8200, 1);
            this.buttonBackground.fillRoundedRect(
            button.x - button.b,
            button.y - button.b,
            button.w + (button.b * 2),
            button.h + (button.b * 2),
            button.r);

            this.button = this.add.graphics();
            this.button.fillStyle(0x4b4b4b, 1);
            this.button.fillRoundedRect(button.x, button.y, button.w, button.h, button.r);
            this.button.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(button.x, button.y, button.w, button.h),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            });
            this.button.once('pointerdown', function()
            {
              this.particlesEmitterLeft.start();
              this.particlesEmitterRight.start();

              this.rocket.body.setAccelerationY(-225);
              this.textTween.stop();
              this.tweens.add({
                  targets: this.text,
                  alpha: 0,
                  duration: 750
              });
              this.tweens.add({
                  targets: this.buttonBackground,
                  alpha: 0,
                  duration: 750
              });
              this.tweens.add({
                  targets: this.button,
                  alpha: 0,
                  duration: 750
              });
            }.bind(this));

            this.text = this.add.text(
                this.sceneDimensions.w / 2,
                this.sceneDimensions.h - 610,
                "Launch",
                { font: "55px Roboto", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center" });
            this.text.setOrigin(0.5);
            this.textTween = this.tweens.add({
                targets: [this.text, this.buttonBackground],
                alpha: 0.4,
                ease: 'Sine',
                duration: 750,
                yoyo: true,
                repeat: -1
            });
        },

        create: function()
        {
            this.createCameraHandler();
            this.createBackground();
            this.createPlanet();
            this.createRocket();
            this.createExitZone();
            this.createLaunchButton();
        },

        updateRocket: function()
        {
            if (this.rocket.body.acceleration.y < 0)
            {
                var ratio = this.rocket.y / this.sceneDimensions.h;
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
