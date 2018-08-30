"use strict";
(function () {

    swInit();


    function swInit() {
        if (!"serviceWorker" in navigator) return;
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("/sw.js")
                .then((registration) => {
                    console.log("SW registration done with scope: ", registration.scope);
                    phaserInit();
                })
                .catch(err => {
                    console.warn(err);
                });
        });
    }


    function phaserInit() {
        let {innerWidth, innerHeight} = window;
        let width = innerWidth < 768 ? innerWidth : 768;
        const game = new Phaser.Game({
            type: Phaser.WEBGL,
            width: width,
            height: innerHeight * 2,
            backgroundColor: '#222222',
            parent: 'canvas',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                    gravity: { y: 20 }
                }
            },
            scene: {
                preload,
                create,
                update
            }
        });

        function preload(){
            this.load.image('sugar', './../assets/images/sugar.png');
        }

        preload = preload.bind(game);

        function create(){
            document.querySelector('.spinner').style.display = 'none';
            this.gems = [];
            let gem;
            for (let i = 0; i < 24; i += 1){
                gem = this.add.image(
                    Phaser.Math.Between(0, 768),
                    Phaser.Math.Between(0, (((innerHeight * 2) / 4) - 50)),
                    'sugar'
                ).setInteractive();
                this.physics.add.existing(gem, false);
                gem.body.setVelocity(0, 180);
                gem.body.setBounce(1, 1);
                gem.body.setCollideWorldBounds(true);
                gem.on('pointerdown', function () {
                    console.log(this);
                });
                this.gems.push(gem);
            }
        }

        create = create.bind(game);


        function update() {
            const quartHeight = (innerHeight * 2) / 4;
            for(let gem of this.gems){
                if(gem.y > (quartHeight * 3) + 50){
                    gem.x = Phaser.Math.Between(25, 743);
                    gem.y = Phaser.Math.Between(0, (quartHeight - 50));
                }
            }
        }

        update = update.bind(game);


    }

})();