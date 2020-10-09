const robotjs = require('robotjs');
const activeWin = require('active-win');
const utilities = require('./helpers/utilities');

let screenSize, windowSize;

const initialize = async () => {
    console.log('Initializing');
    screenSize = robotjs.getScreenSize();
    console.log('Screen size:', screenSize);
    utilities.sleep(5);
    await activeWin().then((window) => {
        if (window.title === 'RuneLite') {
            windowSize = window.bounds;
            console.log('Window size:', windowSize);
            start();
        } else {
            console.log('RuneLite not found, please try again.');
        }
    });
}

const main = () => {
    initialize();
}

const start = () => {
    while (true) {
        const fishingSpot = findFishingSpot();
    }
}

const findFishingSpot = () => {
    
}

main();
