const robotjs = require('robotjs');
const activeWin = require('active-win');
const prompts = require('prompts');

let screenSize, windowSize, isFishing = false, inventoryFull = false;

const initialize = async () => {
    console.log('Initializing');
    screenSize = robotjs.getScreenSize();
    console.log('Screen size:', screenSize);
    console.log('Sleeping 5 seconds - Click on RuneLite client window.');
    sleep(5);
    await activeWin().then((window) => {
        if (window.title === 'RuneLite') {
            console.log('RuneLite client found, setting bounds...');
            windowSize = window.bounds;
            console.log('Window size:', windowSize);
            start();
        } else {
            console.log('RuneLite client not found, please try again.');
        }
    });
}

const main = () => {
    initialize();
}

const start = () => {
    console.log('Starting');
    while (true) {
        // const fishingSpot = findFishingSpot();

        // if (fishingSpot == false) {
        //     rotateCamera();
        //     continue;
        // }

        // robotjs.moveMouse(fishingSpot.x, fishingSpot.y);
        // robotjs.mouseClick();
        // sleep(3000);

        // dropFish();
    }
}

const findFishingSpot = () => {

}

const basicRotateCamera = () => {
    console.log('Rotating camera');
    robotjs.keyToggle('right', 'down');
    sleep(1000);
    robotjs.keyToggle('right', 'up');
}

const sleep = (n) => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

const getRandomNumberBetween = (min, max) => {
    console.log(`Generating random number between: ${ min } - ${ max }`);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();
