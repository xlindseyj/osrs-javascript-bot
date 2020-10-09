const robotjs = require('robotjs');
const utilities = require('./helpers/utilities');

export const basicRotateCamera = () => {
    console.log('Rotating camera');
    robotjs.keyToggle('right', 'down');
    utilities.sleep(1000);
    robotjs.keyToggle('right', 'up');
}