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
        const game = new Phaser.Game({
            type: Phaser.WEBGL,
            width: innerWidth,
            height: innerHeight,
            backgroundColor: '#ee777b',
            parent: 'sugar',
            physics: {
                default: 'matter',
                matter: {
                    gravity: {
                        y: 2
                    },
                    enableSleep: true,
                    debug: false
                }
            },
            scene: {
                preload,
                create
            }
        });

        function preload(){
            this.load.image('sugar', './../assets/images/sugar.png');
        }

        preload = preload.bind(game);

        function create(){
            let {innerWidth, innerHeight} = window;
            document.querySelector('.spinner').style.display = 'none';
            this.matter.world.setBounds();
            let texture = this.textures.createCanvas('gradient', innerWidth, innerHeight);
            let grd = texture.context.createLinearGradient(innerWidth, innerHeight, 0, 0);
            grd.addColorStop(0, '#5a4875');
            grd.addColorStop(.5, '#eb777b');
            grd.addColorStop(1, '#ffac6e',);
            texture.context.fillStyle = grd;
            texture.context.fillRect(0, 0, innerWidth, innerHeight);
            texture.refresh();
            this.add.image(innerWidth/2, innerHeight/2, 'gradient');
            for (let i = 0; i < 32; i += 1){
                this.matter.add.image(Phaser.Math.Between(150, 250), Phaser.Math.Between(150, 250), 'sugar');
            }

            this.matter.add.mouseSpring();
        }

        create = create.bind(game);

    }

})();