import robotjs from 'robotjs';
import activeWin from 'active-win';
import { FishingSpot } from '../../../../bot/models/fishing-spot.model';
import { ImageOptions } from '../../../../bot/models/image-options.model';

export default class BarbarianFishing {
    
  private screenSize = null;
  private windowSize = null;
  private isFishing: boolean = false;
  private inventoryFull: boolean = false;
  public status: string;
  private barbarianFishingOutlineColors: string[] = ['00b1b1', '008f8f', '00b2b2', '00b3b3', '00a3a3', '159499', '06afb0', '348e99', '348290'];

  private basicRotateCamera = async (): Promise<void> => {
    console.log('Rotating camera');
    robotjs.keyToggle('right', 'down');
    this.sleep(1000);
    robotjs.keyToggle('right', 'up');
  }

  private checkInventoryIsFull = (): boolean => {
    return false;
  }

  private dropFish = async (): Promise<void> => {
    this.isFishing = false;
    // do stuff here
    this.inventoryFull = false;
  }

  private findFishingSpot = async (): Promise<FishingSpot> => {
    this.status = 'Searching for fishing location';
    console.log(this.status);
    
    let fishingSpot: FishingSpot;
    const imageOptions: ImageOptions = {
      height: this.screenSize.x,
      width: this.screenSize.y,
      x: 0,
      y: 0
    };

    const img = robotjs.screen.capture(imageOptions.x, imageOptions.y, imageOptions.width, imageOptions.height);

    for (let i = 0; i < 500; i++) {
      const random_x = this.getRandomNumberBetween(0, imageOptions.width-1);
      const random_y = this.getRandomNumberBetween(0, imageOptions.height-1);
      const sample_color = img.colorAt(random_x, random_y);

      if (this.barbarianFishingOutlineColors.includes(sample_color)) {
        // because we took a cropped screenshot, and we want to return the pixel position
        // on the entire screen, we can account for that by adding the relative crop x and y
        // to the pixel position found in the screenshot;
        const screen_x = random_x + imageOptions.x;
        const screen_y = random_y + imageOptions.y;

        // if we don't confirm that this coordinate is a tree, the loop will continue
        if (this.verifyFishingLocation(screen_x, screen_y)) {
          console.log("Found a fishing location at: " + screen_x + ", " + screen_y + " color " + sample_color);
          return { x: screen_x, y: screen_y };
        } else {
          console.log("Unconfirmed tree at: " + screen_x + ", " + screen_y + " color " + sample_color);
        }
      }
    }

    return fishingSpot;
  }

  private fish = (fishingSpot: FishingSpot): void => {
    this.status = 'Fishing';
    this.isFishing = true;
    robotjs.moveMouse(fishingSpot.x, fishingSpot.y);
    robotjs.mouseClick();
    // if space is still available dont loop again and reclick - just wait
    // do inventory check here
  }

  public initialize = async () => {
    this.status = 'Initializing'
    this.screenSize = robotjs.getScreenSize();

    console.log('Screen size:', this.screenSize);
    console.log('Sleeping 5 seconds - Click on RuneLite client window.');
    this.sleep(5000);

    await activeWin().then((window) => {
      if (window.title.includes('RuneLite')) {
        console.log('RuneLite client found, setting bounds...');
        this.windowSize = window.bounds;
        console.log('Window size:', this.windowSize);
        this.start();
      } else {
        console.log('RuneLite client not found, please try again.');
      }
    });
  }
  
  private start = async () => {
    console.log('Starting Barbarian Fishing');

    while (true) {
      const fishingSpot: FishingSpot = await this.findFishingSpot();

      if (fishingSpot) {
        await this.basicRotateCamera();
        // await this.fish(fishingSpot);
        this.fish(fishingSpot);
        continue;
      }

      this.sleep(3000);

      if (this.checkInventoryIsFull()) {
        await this.dropFish();
      }
    }
  }

  private verifyFishingLocation = async (screen_x: number, screen_y: number): Promise<boolean> => {
    // first move the mouse to the given coordinates
    robotjs.moveMouse(screen_x, screen_y);
    this.sleep(300);

    // now check the color of the action text
    const check_x = this.screenSize.x;
    const check_y = this.screenSize.y;
    const pixel_color = robotjs.getPixelColor(check_x, check_y);

    // returns true if the pixel color is cyan
    return pixel_color == "00ffff";
  }
  
  // move these to a service
  private sleep = (n: number): void => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }
    
  private getRandomNumberBetween = (min: number, max: number): number => {
    // console.log(`Generating random number between: ${ min } - ${ max }`);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const barbarianFishing = new BarbarianFishing();
barbarianFishing.initialize();
