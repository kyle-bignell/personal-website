window.SceneOrbit = function(config) {
    return new Phaser.Class({
        Extends: Phaser.Scene,

        initialize: function(data)
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

            var exploreToggleDOM = document.getElementById("explore-toggle");
            exploreToggleDOM.addEventListener("click", function()
            {
                handleVisible(window.inExplore, this.scene);
            }.bind(this));
        },

        init: function(data)
        {
            window.explore.currentScene = "sceneOrbit";
            this.planetID = data.id || 0;
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
                camera.scrollX = camera.scrollX - (drag1Vector.x / camera.zoom);
                camera.scrollY =  camera.scrollY - (drag1Vector.y / camera.zoom);
              }, this)
              .on('pinch', function (dragScale) {
                var scaleFactor = dragScale.scaleFactor;
                camera.zoom = Math.max(1, (camera.zoom * scaleFactor));
              }, this);

            this.physics.world.gravity.y = 0;
            this.physics.world.setBoundsCollision(true, true, true, true);
            this.physics.world.on("worldbounds", function (body) {
                body.setCollideWorldBounds(false);
                body.onWorldBounds = false;

                this.time.delayedCall(25, function() {
                    body.gameObject.setVisible(false);
                    this.particlesEmitterLeft.stop();
                    this.particlesEmitterRight.stop();
                }, [], this);

                this.time.delayedCall(2500, function() {
                    this.cameras.main.fadeOut(750, 0, 0, 0, function(camera, progress) {
                        if (progress === 1) {
                            this.scene.start('sceneOverview');
                        }
                    }.bind(this));
                }, [], this);
            }.bind(this));

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

            this.config = {
                planetRadius: 200,
                orbitRadius: 270,
                orbitTime: 30000
            };

            var background = this.add.image(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, 'planet-background-' + this.planetID);
            background.setOrigin(0.5, 0.5);
            background.scale = (this.config.planetRadius * 2) / background.width;

            var graphics = this.add.graphics();
            graphics.fillStyle(window.explore.config.planets[this.planetID].colour, 1);
            graphics.fillCircle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.planetRadius);
            graphics.blendMode = 'MULTIPLY';

            background.setMask(graphics.createGeometryMask());

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

            this.orbitCircle = new Phaser.Geom.Circle(this.sceneDimensions.w / 2, this.sceneDimensions.h / 2, this.config.orbitRadius);
            this.orbitRotation = this.tweens.addCounter({
                from: 0,
                to: 6.28,
                duration: this.config.orbitTime,
                repeat: -1
            });

            var button = {
              x: this.sceneDimensions.w - 260,
              y: -25,
              w: 250,
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

            this.text = this.add.text(this.sceneDimensions.w - 135,
                27.5,
                "Exit Orbit",
                { font: "50px Roboto", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center" });
            this.text.setOrigin(0.5);

            this.physics.world.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
            this.cameras.main.setBounds(0, 0, this.sceneDimensions.w, this.sceneDimensions.h);
            this.cameras.main.fadeIn(750);
        },

        update: function()
        {
            Phaser.Actions.PlaceOnCircle(
                [this.rocket],
                this.orbitCircle,
                this.orbitRotation.getValue()
            );
            this.rocket.rotation = this.orbitRotation.getValue() + 3.14;
            const xDistance = 15 * this.rocket.scaleX;
            const yDistance = 75 * this.rocket.scaleY;
            const leftOffset = Phaser.Math.Rotate({x: xDistance, y: yDistance}, this.orbitRotation.getValue() + 3.14);
            const rightOffset = Phaser.Math.Rotate({x: -xDistance, y: yDistance}, this.orbitRotation.getValue() + 3.14);
            this.particlesEmitterLeft.setPosition(this.rocket.x + leftOffset.x, this.rocket.y + leftOffset.y);
            this.particlesEmitterRight.setPosition(this.rocket.x + rightOffset.x, this.rocket.y + rightOffset.y);
        }
    })
}
