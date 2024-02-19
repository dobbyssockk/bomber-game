'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const START_POINT_FIRST = 0;
    const START_POINT_SECOND = 99;
    const gameItems = document.querySelector('.game__items');

    for(let i = 0; i < 100; i++) {
        const element = document.createElement('div');
        element.classList.add('game__item');
        gameItems.append(element);
    }

    const gameItem = document.querySelectorAll('.game__item');

    function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let rndInt;

    function startGame() {
        gameItem[START_POINT_FIRST].classList.add('first-player');
        gameItem[START_POINT_SECOND].classList.add('second-player');

        for(let i = 0; i < 25; i++) {
            rndInt = randomIntFromInterval(1, 99);
            if (rndInt === START_POINT_FIRST || rndInt === START_POINT_SECOND) {
                i--;
            } else {
                gameItem[rndInt].classList.add('dirt');
            }
        }

        for(let i = 0; i < 20; i++) {
            rndInt = randomIntFromInterval(1, 99);
            if (rndInt === START_POINT_FIRST || rndInt === START_POINT_SECOND || gameItem[rndInt].classList.contains('dirt')) {
                i--;
            } else {
                gameItem[rndInt].classList.add('stone');
            }
        }
    }
    startGame();

    function playerMovement(key, currentPlayerPosition, currentPlayerEl, currentPlayer, opponent) {
        if (key === 'KeyW' || key === 'ArrowUp') {
            if (
                currentPlayerPosition - 10 >= 0 &&
                !gameItem[currentPlayerPosition - 10].classList.contains(opponent) &&
                !gameItem[currentPlayerPosition - 10].classList.contains('dirt') &&
                !gameItem[currentPlayerPosition - 10].classList.contains('stone')
            ) {
                currentPlayerEl.classList.remove(currentPlayer);
                gameItem[currentPlayerPosition - 10].classList.add(currentPlayer);
            }
        } else if (key === 'KeyA' || key === 'ArrowLeft') {
            if (
                currentPlayerPosition - 1 >= 0 &&
                !(currentPlayerPosition % 10 === 0) &&
                !gameItem[currentPlayerPosition - 1].classList.contains(opponent) &&
                !gameItem[currentPlayerPosition - 1].classList.contains('dirt') &&
                !gameItem[currentPlayerPosition - 1].classList.contains('stone')
            ) {
                currentPlayerEl.classList.remove(currentPlayer);
                gameItem[currentPlayerPosition - 1].classList.add(currentPlayer);
            }
        } else if (key === 'KeyS' || key === 'ArrowDown') {
            if (
                currentPlayerPosition + 10 < 100 &&
                !gameItem[currentPlayerPosition + 10].classList.contains(opponent) &&
                !gameItem[currentPlayerPosition + 10].classList.contains('dirt') &&
                !gameItem[currentPlayerPosition + 10].classList.contains('stone')
            ) {
                currentPlayerEl.classList.remove(currentPlayer);
                gameItem[currentPlayerPosition + 10].classList.add(currentPlayer);
            }
        } else if (key === 'KeyD' || key === 'ArrowRight') {
            if (
                currentPlayerPosition + 1 < 100 &&
                !(currentPlayerPosition % 10 === 9) &&
                !gameItem[currentPlayerPosition + 1].classList.contains(opponent) &&
                !gameItem[currentPlayerPosition + 1].classList.contains('dirt') &&
                !gameItem[currentPlayerPosition + 1].classList.contains('stone')
            ) {
                currentPlayerEl.classList.remove(currentPlayer);
                gameItem[currentPlayerPosition + 1].classList.add(currentPlayer);
            }
        }
    }

    function setAndExplodeBomb(currentPlayerPosition) {
        const bombPosition = currentPlayerPosition;
        gameItem[bombPosition].classList.add('bomb');

        const explosionUp = bombPosition - 10,
            explosionDown = bombPosition + 10,
            explosionLeft = bombPosition - 1,
            explosionRight = bombPosition + 1;

        setTimeout(() => {
            gameItem[bombPosition].classList.remove('bomb');
            gameItem[bombPosition].classList.add('explosion');

            if (explosionUp >= 0) {
                gameItem[explosionUp].classList.add('explosion');
            }

            if (explosionDown < 100) {
                gameItem[explosionDown].classList.add('explosion');
            }

            if (explosionLeft >= 0 && !(bombPosition % 10 === 0)) {
                gameItem[explosionLeft].classList.add('explosion');
            }

            if (explosionRight < 100 && !(bombPosition % 10 === 9)) {
                gameItem[explosionRight].classList.add('explosion');
            }

            checkIfDead();

            setTimeout(() => {
                gameItem[bombPosition].classList.remove('explosion');

                if (!(gameItem[explosionUp] === undefined)) {
                    gameItem[explosionUp].classList.remove('explosion');
                    if (gameItem[explosionUp].classList.contains('dirt')) {
                        gameItem[explosionUp].classList.remove('dirt');
                    }
                }

                if (!(gameItem[explosionDown] === undefined)) {
                    gameItem[explosionDown].classList.remove('explosion');
                    if (gameItem[explosionDown].classList.contains('dirt')) {
                        gameItem[explosionDown].classList.remove('dirt');
                    }
                }

                if (!(gameItem[explosionLeft] === undefined)) {
                    gameItem[explosionLeft].classList.remove('explosion');
                    if (gameItem[explosionLeft].classList.contains('dirt')) {
                        gameItem[explosionLeft].classList.remove('dirt');
                    }
                }

                if (!(gameItem[explosionRight] === undefined)) {
                    gameItem[explosionRight].classList.remove('explosion');
                    if (gameItem[explosionRight].classList.contains('dirt')) {
                        gameItem[explosionRight].classList.remove('dirt');
                    }
                }
            }, 1000)
        }, 1500);
    }

    function checkIfDead() {
        gameItem.forEach(item => {
            if (item.classList.contains('explosion')) {
                if (item.classList.contains('first-player')) {
                    setTimeout(() => endGame('First player'), 1)
                } else if (item.classList.contains('second-player')) {
                    setTimeout(() => endGame('Second player'), 1)
                }
            }
        })
    }

    function endGame(currentPlayer) {
        alert(`GAME OVER!\n${currentPlayer} IS DEAD`);

        gameItem.forEach(item => {
            if (item.classList.contains('first-player')) {
                item.classList.remove('first-player');
            } else if (item.classList.contains('second-player')) {
                item.classList.remove('second-player');
            }

            if (item.classList.contains('explosion')) {
                item.classList.remove('explosion');
            }

            if (item.classList.contains('bomb')) {
                item.classList.remove('bomb');
            }

            if (item.classList.contains('dirt')) {
                item.classList.remove('dirt');
            }

            if (item.classList.contains('stone')) {
                item.classList.remove('stone');
            }
        })

        startGame();
    }

    document.addEventListener('keydown', (e) => {
        let currentFirstPlayerEl;
        let currentFirstPlayerPosition;
        let currentSecondPlayerEl;
        let currentSecondPlayerPosition;

        gameItem.forEach((item, i) => {
            if (item.classList.contains('first-player')) {
                currentFirstPlayerEl = item;
                currentFirstPlayerPosition = i;
            } else if (item.classList.contains('second-player')) {
                currentSecondPlayerEl = item;
                currentSecondPlayerPosition = i;
            }
        })

        if (e.code === 'KeyW') {
            playerMovement('KeyW', currentFirstPlayerPosition, currentFirstPlayerEl, 'first-player', 'second-player');
        } else if (e.code === 'ArrowUp') {
            playerMovement('ArrowUp', currentSecondPlayerPosition, currentSecondPlayerEl, 'second-player', 'first-player');
        }

        if (e.code === 'KeyA') {
            playerMovement('KeyA', currentFirstPlayerPosition, currentFirstPlayerEl, 'first-player', 'second-player');
        } else if (e.code === 'ArrowLeft') {
            playerMovement('ArrowLeft', currentSecondPlayerPosition, currentSecondPlayerEl, 'second-player', 'first-player');
        }

        if (e.code === 'KeyS') {
            playerMovement('KeyS', currentFirstPlayerPosition, currentFirstPlayerEl, 'first-player', 'second-player');
        } else if (e.code === 'ArrowDown') {
            playerMovement('ArrowDown', currentSecondPlayerPosition, currentSecondPlayerEl, 'second-player', 'first-player');
        }

        if (e.code === 'KeyD') {
            playerMovement('KeyD', currentFirstPlayerPosition, currentFirstPlayerEl, 'first-player', 'second-player');
        } else if (e.code === 'ArrowRight') {
            playerMovement('ArrowRight', currentSecondPlayerPosition, currentSecondPlayerEl, 'second-player', 'first-player');
        }

        if (e.code === 'Space') {
            setAndExplodeBomb(currentFirstPlayerPosition);
        } else if (e.code === 'Enter') {
            setAndExplodeBomb(currentSecondPlayerPosition);
        }

        checkIfDead();
    })
});