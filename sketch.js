/**
 * ----------------------------------------------------------------------
 * NOTE: If you use this file, please change the comments to reflect your
 *       changes and additions!
 * ---------------------------------------------------------------------
 * TITLE: The trapped beast calling from the depths
 * 
 * THEME: Outer space and the galaxy
 *
 * DOCUMENTATION:
 * 1. Compositing using blendMode() and tint()
 * 2. Cropping and scaling using the image function
 * 3. Repetition using loops
 * 4. Random pixel swapping using img.get and img.set
 * 5. Masking using createMask() function
 * 6. Channel replacement using the img.pixels[] array
 * 
 * This example uses a few images:
 * 
 * 1. A sun eclipse background image
 * 3. A JPG image of oil artwork, is used with scaling and repetition
 * 4. A JPG image of a lion, which is used as an image channel replacer
 * 
 * Image function reference: https://p5js.org/reference/#group-Image
 * ------------------------------------------
 * by Prashanth Thattai 2023 <p.thattairavikumar@gold.ac.uk> 
 * Adapted from Evan Raskob <e.raskob@gold.ac.uk>
 * modified by <Hamidou Wane and hwane001@campus.goldsmiths.ac.uk>
 * -----------------------------------------
 */


/// ----- 1. Put some images here! -------------
/// You need to download them from somewhere, try and find
/// a source that has proper usage rights (Creative Commons 
/// non-commercial, or public domain)

/// ---- MAKE SURE TO PUT THE URL YOU FOUND THEM AT HERE, 
/// ---- OR LET US KNOW THE SOURCE ------------------------

// Sun eclipse by AstroGraphix_Visuals
// source: https://pixabay.com/illustrations/eclipse-sun-space-moon-planet-1492818/ 
let background;

// Oil painting artwork by Placidplace
// Source: https://pixabay.com/illustrations/oil-painting-artwork-abstract-7761246/
let chaos;

// "Lion roaring" by samuelrodgers752 is licensed under CC BY 2.0.
// Source: https://openverse.org/image/2ab9d045-f663-49c7-ab28-83fe2a8c2cf9?q=roaring%20animal
let lion;


/// --- PRELOAD ------------------------
/// This is useful to load an image  or do a task that is important to run
/// *before* the sketch is loaded. preload() runs once *before* setup

function preload() {  
    // load images from the assets folder
    background = loadImage('assets/background.jpg');

    chaos = loadImage('assets/chaos.jpg');
    
    lion = loadImage('assets/lion.jpg');

    pixelDensity(1); // if you are on a very large screen, this can
  // help your images scale to the proper size when drawn
}

var glitches = [];

///
/// Setup -------------------------
///
function setup() {  

    //tell us something out out images
    console.info('Image dimensions');
    console.info('----------------');
  
    console.info('background:' + background.width + '/' + background.height);

    console.info('lion:' + lion.width + '/' + lion.height);

    console.info('chaos:' + chaos.width + '/' + chaos.height);

    createCanvas(background.width, background.height); // create a canvas EXACTLY the size of our image
    
    lion.resize(background.width, background.height);// Makes lion image the same width and height as the background image so channel(r, g, b, or a) of entire lion image is replaces the corresponding value of the background image
    
    // Loop to send 10 differently tinted glitches to the glitches array
    for (var i = 0; i < 10; i++)
        {
            var newGlitches = {};
            newGlitches.img = chaos;
            newGlitches.dx = 0 ;
            newGlitches.dy = 0 + (i * 48);
            newGlitches.dw = width;
            newGlitches.dh = height/13;
            
            newGlitches.sx = random(10, width);
            newGlitches.sy = random(100, height);
            newGlitches.sw = random(width/2, width);
            newGlitches.sh = random(height/2, height);
            
            newGlitches.tint = [random(0, 255), random(0, 255), random(0, 255), 127.5];
            
            glitches.push(newGlitches);
        }
}


///-----------------------------
///--- DRAW --------------------
///-----------------------------

function draw() {
    frameRate(1);

    tint(255,255); // reset tint to full color and no transparency
    
    
    push();// Saves current drawing state
    blendMode(DARKEST);// Darkest colour succeeds
    createMask(lion);// Draws outline of lion using selected pixel channel
    image(lion, 0, 0);
    channelReplace(background, lion, round(random(0, 3)));// Random channel of the lion image replaces random channel of background image creating different colour // combinations 
    pop();// Resets drawing state to original

    // Subtracts the colours from underlying image, creating the jump effect between outlines
    blendMode(DIFFERENCE);

    imageMode(CORNER);
    // draw the image to fill the canvas exactly
    image(background, 0, 0);

    colorMode(RGB);
    
    // Draws glitches to screen
    for (var i = 0; i < glitches.length; i++)
        {
            drawGlitches(glitches[i]);
        }
    // Swaps random pixels on the canvas
    for (var i = 0; i < 10000; i++)
        {
            swapPixels(background);
        }
  
}

/**
* Replace the red, green, blue, or alpha channel in one image with one from 
* a different image.
*
* @param {p5.Image} mainImage - Image to replace channel
* @param {p5.Image} replacementImage - Source of new channel
* @param {Number} channelNumber Channel number (0-3 for R,G,B,A)
*/
function channelReplace(mainImage, channelImage, channelNumber)
{
    const colourChannels = 4;
   
    mainImage.loadPixels();// Loads image in whic the channel is being replaced
    channelImage.loadPixels();// Loads source image for specified channel
   
    // These for loops iterate through all the pixel channels in the image
    for (var row = 0; row < mainImage.height; row++)
        {
            for (var column = 0; column < mainImage.width; column++)
                {
                    // Gives you the starting index of each pixel (0, 4, 8, 12...)
                    var pixelStartIndex = row * mainImage.width * colourChannels + column * colourChannels;
                    mainImage.pixels[pixelStartIndex + channelNumber] = channelImage.pixels[pixelStartIndex + channelNumber];// Replaces specified channel from replacement image to the main image
                }
        }
    mainImage.updatePixels();// Saves changes
}



/**
 draws a random part of an image on the screen based on glitches object attributes
 * 
 * @param {Array} an array that conatains objects with arguments for the image function 
 */
function drawGlitches(glitch)
{
    tint(glitch.tint);
    image(glitch.img,
          glitch.dx,
          glitch.dy,
          glitch.dw,
          glitch.dh,
          glitch.sx,
          glitch.sy,
          glitch.sw,
          glitch.sh);
}



///-------------------------------------------------------
/// --- MASKING-------------------------------------------
///
/**
 * Turn an image into a black and white mask using a threshold
 * filter to make all lighter pixels white and all darker ones black.
 * This permanently modifies the image, in memory!
 * 
 * @param {p5.Image} srcImage Source image to turn into a black/white mask image 
 */
function createMask(srcImage) {
  //-------------------------------------------------------
  // --- FILTERING ----------------------------------------
  // filter images -- must be done AFTER create canvas
  // https://p5js.org/reference/#/p5/filter
  //

  srcImage.filter(INVERT); // make this image slightly blurry
  srcImage.filter(THRESHOLD,0.5); // turn white/black only
  srcImage.filter(ERODE); // reduce light areas
}


/**
 * Draw a mask image onto the screen using SCREEN Blend mode. 
 * This means the black parts of this image will white out the
 * pixels below it, and the white parts of this image will let the 
 * pixels below show through unaltered.
 * 
 * @param {p5.Image} img Mask image
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} w 
 * @param {Number} h 
 */
function drawMask(img, x, y, w, h){
    // or try screen
    blendMode(SCREEN);
    imageMode(CENTER); // draw using center coordinate
    image(img, x, y, w, h);
}


///-------------------------------------------------------
/// --- PIXEL MASKS -------------------------------------------
///
/**
 * Pixel Mask. Write a function to replace pixel channels from one 
 * image to another. This means the pixel channel of background image 
 * will be replaced by the pixels values of the Mask image. 
 * 
 * @param {p5.Image} src_img 
 * @param {p5.Image} tar_img Mask image
 */

function drawPixelMask(src_img, tar_img){
    
}

/**
 * Write a function to exchange pixel values from random positions
 * on the screen. This means the pixel channel of background image will start
 * blurring. 
 * 
 * @param {p5.Image} src_img 
 */

function swapPixels(src_img){
    var randomX1 = random(0, width);
    var randomY1 = random(0, height);
    
    var randomX2 = random(0, width);
    var randomY2 = random(0, height);
    
    var randomPixel1 = src_img.get(randomX1, randomY1);
    var randomPixel2 = src_img.get(randomX2, randomY2);
    
    src_img.set(randomX1, randomY1, randomPixel2);
    src_img.set(randomX2, randomY2, randomPixel1);
    src_img.updatePixels();
    
}

