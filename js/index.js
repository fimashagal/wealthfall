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
                default: 'matter',
                matter: {
                    gravity: {
                        y: .45
                    },
                    enableSleep: true,
                    debug: false
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
            this.matter.world.setBounds();
            this.gems = [];
            let gem;
            for (let i = 0; i < 24; i += 1){
                gem = this.matter.add.image(
                    Phaser.Math.Between(0, 768),
                    Phaser.Math.Between(0, (((innerHeight * 2) / 4) - 50)),
                    'sugar'
                );
                gem.on('pointerdown', function () {
                    alert(1);
                });
                this.input.on('pointerdown', function (pointer) {
                    alert(pointer);
                }, this);
                this.gems.push(gem);
            }

            this.matter.add.mouseSpring();
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