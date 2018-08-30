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
        const quartHeight = (innerHeight * 2) / 4;
        const wealth = {
            0: {
                image: "gem-0",
                scoreProfit: 10,
                scoreDamage: -5
            },
            1: {
                image: "gem-1",
                scoreProfit: 12,
                scoreDamage: -6
            },
            2: {
                image: "gem-2",
                scoreProfit: 14,
                scoreDamage: -7
            },
            3: {
                image: "gem-3",
                scoreProfit: 16,
                scoreDamage: -8
            },
            4: {
                image: "gem-4",
                scoreProfit: 18,
                scoreDamage: -9
            }
        };

        const score = {
            el: document.querySelector('.score'),
            value: 0,
            add(value){
                this.value += value;
                if(this.value < 0) this.value = 0;
                this.update(value > 0);
                return this;
            },
            update(){
                this.el.innerText = this.value.toString();
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
                        y: .15
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
            let pathGem = index => `./../assets/images/gem.${index}.png`;
            for(let i = 0; i < 5; i++){
                this.load.image(`gem-${i}`, pathGem(0));
            }

            // this.load.image('gem-1', pathGem(1));
            // this.load.image('gem-2', pathGem(2));
            // this.load.image('gem-3', pathGem(3));
            // this.load.image('gem-4', pathGem(4));
        }

        preload = preload.bind(game);

        function create(){
            score.update();
            document.querySelector('.spinner').style.display = 'none';

            this.matter.world.setBounds();
            this.gems = [];
            let gem;
            for (let i = 0; i < 25; i += 1){
                let gemIndex = Phaser.Math.Between(0, 4);
                let {image, scoreProfit, scoreDamage} = wealth[gemIndex];

                gem = this.matter.add.image(
                    Phaser.Math.Between(47, 721),
                    Phaser.Math.Between(80, (((innerHeight * 2) / 4) - 80)),
                    image
                ).setInteractive();
                gem.setDataEnabled();
                gem.data.set('profit', scoreProfit);
                gem.data.set('damage', scoreDamage);
                gem.on('pointerdown', function () {
                    score.add(gem.data.get('profit'));
                    this.x = Phaser.Math.Between(47, 721);
                    this.y = Phaser.Math.Between(0, (quartHeight - 80));
                });

                this.gems.push(gem);
            }
        }

        create = create.bind(game);


        function update() {
            for(let gem of this.gems){
                gem.angle = 0;
                if(gem.y >= (quartHeight * 4) - 80){
                    score.add(gem.data.get('damage'));
                    gem.x = Phaser.Math.Between(47, 721);
                    gem.y = Phaser.Math.Between(0, (quartHeight - 80));
                }

            }
        }

        update = update.bind(game);


    }

})();