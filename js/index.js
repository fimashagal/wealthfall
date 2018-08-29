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
            width: 768,
            height: innerHeight*2,
            backgroundColor: '#222222',
            parent: 'canvas',
            physics: {
                default: 'matter',
                matter: {
                    gravity: {
                        y: .75
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
            let {innerWidth, innerHeight} = window;
            document.querySelector('.spinner').style.display = 'none';
            this.matter.world.setBounds();
            this.gems = [];
            for (let i = 0; i < 42; i += 1){
                this.gems.push(this.matter.add.image(Phaser.Math.Between(0, 768), 0, 'sugar'));
            }

            this.matter.add.mouseSpring();
        }

        create = create.bind(game);


        function update() {
            for(let gem of this.gems){
                console.log(gem);
                if(gem.position.y > ((innerHeight * 2) / 4)*3){
                    gem.position.y = 0;
                }
            }
        }

        update = update.bind(game);


    }

})();