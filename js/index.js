"use strict";
(function () {

    swInit();

    function dbInit(callback = new Function) {

        localforage.getItem('wealthfall')
            .then(function(value) {
                !value
                    ? localforage.setItem('wealthfall', 0).then(callback)
                    : callback(value);
            }).catch(function(err) {
                console.warn(err);
                callback(0);
            });

    }

    function swInit() {
        if (!"serviceWorker" in navigator) {
            dbInit(phaserInit);
            return;
        }
        window.addEventListener("load", function () {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => console.log("SW done. Scope: ", registration.scope))
                .catch(err => console.warn(err))
                .finally(() => dbInit(phaserInit));
        });
    }


    function phaserInit(lastScore) {
        let {innerWidth, innerHeight} = window;
        let width = innerWidth < 560 ? innerWidth : 560;
        const quartHeight = (innerHeight * 2) / 4;
        const wealthPreset = {
            0: {
                image: "wealth-0",
                scoreProfit: 10,
                scoreDamage: -14
            },
            1: {
                image: "wealth-1",
                scoreProfit: 14,
                scoreDamage: -13
            },
            2: {
                image: "wealth-2",
                scoreProfit: 16,
                scoreDamage: -12
            },
            3: {
                image: "wealth-3",
                scoreProfit: 18,
                scoreDamage: -11
            },
            4: {
                image: "wealth-4",
                scoreProfit: 20,
                scoreDamage: -10
            },
            5: {
                image: "wealth-5",
                scoreProfit: -50,
                scoreDamage: 0
            },
            6: {
                image: "wealth-6",
                scoreProfit: -125,
                scoreDamage: 0
            },
            7: {
                image: "wealth-7",
                scoreProfit: -250,
                scoreDamage: 0
            },
            8: {
                image: "wealth-8",
                scoreProfit: -500,
                scoreDamage: 0
            },
            9: {
                image: "wealth-9",
                scoreProfit: -1000,
                scoreDamage: 0,
                velocityY: 20
            }
        };

        const score = {
            el: document.querySelector('.score'),
            value: lastScore ? lastScore : 0,
            add(value){
                this.value += value;
                if(this.value < 0) this.value = 0;
                this.update();
                return this;
            },
            update(){
                localforage.setItem('wealthfall', this.value);
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
                        y: .175
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
            let pathWealth = index => `./../assets/images/wealth.${index}.png`;
            for(let i = 0; i < 10; i++) this.load.image(`wealth-${i}`, pathWealth(i));
            this.load.image(`stars`, `./../assets/images/stars.jpg`);
        }
        preload = preload.bind(game);

        function create(){
            score.update();
            document.querySelector('.spinner').style.display = 'none';
            this.matter.world.setBounds();
            this.wealth = [];
            this.add.image(width / 2, quartHeight * 2, 'stars');
            for (let i = 0; i < 26; i += 1){
                let wealthIndex = Phaser.Math.Between(0, 9);
                let {image, scoreProfit, scoreDamage} = wealthPreset[wealthIndex];
                let wealthItem = this.matter.add.image(
                    Phaser.Math.Between(0, width),
                    Phaser.Math.Between(80, quartHeight * 3),
                    image
                );
                wealthItem.setInteractive();
                wealthItem.setDataEnabled();
                wealthItem.data.set('profit', scoreProfit);
                wealthItem.data.set('damage', scoreDamage);
                wealthItem.on('pointerdown', function () {
                    score.add(wealthItem.data.get('profit'));
                    mutateWealth(this);
                    placeWealthToStart(this);
                });
                this.wealth.push(wealthItem);
            }
        }

        create = create.bind(game);


        function update() {
            for(let wealthItem of this.wealth){
                wealthItem.angle = 0;
                if(wealthItem.y >= (quartHeight * 3) + 80){
                    score.add(wealthItem.data.get('damage'));
                    placeWealthToStart(wealthItem);
                }
            }
        }

        update = update.bind(game);


        function placeWealthToStart(wealth){
            wealth.x = Phaser.Math.Between(0, width);
            wealth.y = Phaser.Math.Between(0, (quartHeight - 80));
            return wealth;
        }

        function mutateWealth(wealth) {
            let wealthIndex = Phaser.Math.Between(0, 9);
            let {image, scoreProfit, scoreDamage} = wealthPreset[wealthIndex];
            wealth.setTexture(image);
            wealth.data.set('profit', scoreProfit);
            wealth.data.set('damage', scoreDamage);
            return wealth;
        }

    }

})();