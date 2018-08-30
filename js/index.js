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
        const wealthPreset = {
            0: {
                image: "wealth-0",
                scoreProfit: 10,
                scoreDamage: width === 768 ? -4 : -5
            },
            1: {
                image: "wealth-1",
                scoreProfit: 12,
                scoreDamage: width === 768 ? -5 : -6
            },
            2: {
                image: "wealth-2",
                scoreProfit: 14,
                scoreDamage: width === 768 ? -6 : -7
            },
            3: {
                image: "wealth-3",
                scoreProfit: 16,
                scoreDamage: width === 768 ? -7 : -8
            },
            4: {
                image: "wealth-4",
                scoreProfit: 18,
                scoreDamage: width === 768 ? -8 : -9
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
            backgroundColor: '#0c0b11',
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
            let pathGem = index => `./../assets/images/wealth.${index}.png`;
            for(let i = 0; i < 5; i++){
                this.load.image(`wealth-${i}`, pathGem(i));
            }
        }

        preload = preload.bind(game);

        function create(){
            score.update();
            document.querySelector('.spinner').style.display = 'none';

            this.matter.world.setBounds();
            this.wealth = [];
            let wealthItem;
            for (let i = 0; i < 30; i += 1){
                let wealthIndex = Phaser.Math.Between(0, 4);
                let {image, scoreProfit, scoreDamage} = wealthPreset[wealthIndex];

                wealthItem = this.matter.add.image(
                    Phaser.Math.Between(47, 721),
                    Phaser.Math.Between(80, (((innerHeight * 2) / 4) - 80)),
                    image
                ).setInteractive();
                wealthItem.setDataEnabled();
                wealthItem.data.set('profit', scoreProfit);
                wealthItem.data.set('damage', scoreDamage);
                wealthItem.on('pointerdown', function () {
                    score.add(wealthItem.data.get('profit'));
                    this.x = Phaser.Math.Between(47, 721);
                    this.y = Phaser.Math.Between(0, (quartHeight - 80));
                });

                this.wealth.push(wealthItem);
            }
        }

        create = create.bind(game);


        function update() {
            for(let wealthItem of this.wealth){
                wealthItem.angle = 0;
                if(wealthItem.y >= (quartHeight * 4) - 80){
                    score.add(wealthItem.data.get('damage'));
                    wealthItem.x = Phaser.Math.Between(47, 721);
                    wealthItem.y = Phaser.Math.Between(0, (quartHeight - 80));
                }

            }
        }

        update = update.bind(game);


    }

})();