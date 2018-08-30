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

        const score = {
            el: document.querySelector('.score'),
            value: 0,
            add(value){
                if(this.value + value >= 0){
                    this.value += value;
                    this.update(value > 0);
                }
                return this;
            },
            update(){
                this.el.innerText = this.value;
                return this;
            }
        };

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
                        y: .2
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
            score.update();
            this.matter.world.setBounds();
            this.gems = [];
            let gem;
            for (let i = 0; i < 30; i += 1){
                gem = this.matter.add.image(
                    Phaser.Math.Between(50, 718),
                    Phaser.Math.Between(50, (((innerHeight * 2) / 4) - 50)),
                    'sugar'
                ).setInteractive();
                gem.on('pointerdown', function () {
                    this.alpha = 0;
                    score.add(10);
                });
                this.gems.push(gem);
            }
        }

        create = create.bind(game);


        function update() {
            const quartHeight = (innerHeight * 2) / 4;
            for(let gem of this.gems){
                gem.angle = 0;
                if(gem.y > (quartHeight * 3) + 50){
                    gem.x = Phaser.Math.Between(50, 718);
                    gem.y = Phaser.Math.Between(50, (quartHeight - 50));
                    if(gem.alpha > 0){
                        score.add(-1);
                    } else {
                        gem.alpha = 1;
                    }

                }
            }
        }

        update = update.bind(game);


    }

})();