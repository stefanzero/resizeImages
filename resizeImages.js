const fs = require('fs');
const sharp = require('sharp');

const originalDir = 'original';
const newDir = 'assets';

/**
 * Creates two directories in the current working directory, named 'original' and
 * 'assets'. These directories are used to store the original images and the
 * resized images, respectively.
 *
 * @function createDirectories
 */
const createDirectories = () => {
  /**
   * Change the current working directory to the directory containing this
   * script.
   */
  process.chdir(__dirname);

  /**
   * Create the 'original' and 'assets' directories if they do not exist.
   * If the directories already exist, the error is ignored.
   */
  try {
    fs.mkdirSync(originalDir);
  } catch (err) {}

  try {
    fs.mkdirSync(newDir);
  } catch (err) {}
};

/**
 * Extract the file name from the URL.  It does this by splitting the
 * URL into parts using the / character, taking the last part as the
 * file name, and then removing any query parameters (if present) by
 * slicing the string up to the ? character.
 *
 * @param {string} url - URL to extract the file name from.
 * @returns {string} File name.
 */
function getFileNameFromUrl(url) {
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const queryIndex = fileName.indexOf('?');

  return queryIndex === -1 ? fileName : fileName.slice(0, queryIndex);
}

/**
 * Extract the file name from the URL.  It does this by splitting the
 * URL into parts using the / character, taking the last part as the
 * file name, and then removing any query parameters (if present) by
 * slicing the string up to the ? character.
 *
 * @param {string} url - URL to extract the file name from.
 * @returns {string} File name.
 */
function extractFileNameUsingRegex(url) {
  // Remove all characters before the last / character
  const fileName = url.replace(/.*\//, '');
  // Remove all characters after the ? character (if present)
  const fileNameWithoutQuery = fileName.replace(/\?.*/, '');
  return fileNameWithoutQuery;
}

/**
 * Downloads a file from the given URL and saves it to the "original" directory.
 * The file name is extracted from the URL using the getFileNameFromUrl() function.
 * The file is saved in binary format.
 * @param {string} url - URL of the file to download.
 */
async function downloadBinaryFile(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer, 'binary');
  // Switch to the "original" directory
  process.chdir(originalDir);
  const fileName = getFileNameFromUrl(url);
  // Save the file to the "original" directory
  fs.writeFileSync(fileName, buffer);
  console.log(`finished downloading ${fileName}!`);
  // Switch back to the parent directory
  process.chdir('..');
}

/**
 * Resizes an image to a target width of 400px and saves it to the "assets" directory.
 * The height of the image is calculated based on the aspect ratio of the original image.
 * @param {string} fileName - Name of the file to resize.
 */
async function resizeImage(fileName) {
  const inputFile = `${originalDir}/${fileName}`;
  const outputFile = `${newDir}/${fileName}`;
  // Get the metadata of the image
  const metadata = await sharp(inputFile).metadata();
  console.log(metadata.width, metadata.height);
  // Calculate the target height based on the aspect ratio of the image
  const targetWidth = 400;
  const targetHeight = Math.floor(
    metadata.height * (targetWidth / metadata.width)
  );
  // Resize the image and save it to the "assets" directory
  await sharp(inputFile)
    .resize({
      width: targetWidth,
      height: targetHeight,
    })
    .toFile(outputFile);
}

const urls = [
  'https://cdn.glitch.me/9cb3287b-5b67-4fc6-8093-f6682f2ba065/Abishek.jpg?v=1691513787019',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00937.jpg?v=1691530346423',
  'https://cdn.glitch.me/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00608.jpg?v=1691514052211',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00657.jpg?v=1691514041722',
  'https://cdn.glitch.me/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00529.jpg?v=1691514066267',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00332.jpg?v=1691514028528',
  'https://cdn.glitch.me/b3ff15bf-b6fd-42b1-9468-aaeb79ddda9e/DSC00693.jpg?v=1691449262761',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00395.jpg?v=1691514061753',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00441.jpg?v=1691514080594',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00343.jpg?v=1691514069414',
  'https://cdn.glitch.me/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00044.jpg?v=1691514082558',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/DSC00757.jpg?v=1691527426602',
  'https://cdn.glitch.global/9cb3287b-5b67-4fc6-8093-f6682f2ba065/kevin.jpg?v=1691528061151',
];

/**
 * Downloads all the images from the given URLs and resizes them to a target
 * width of 400px. The images are saved to the "assets" directory.
 * @param {string[]} urls - URLs of the images to download and resize.
 */
async function resizeImages(urls) {
  for (const url of urls) {
    // Get the file name from the URL
    const fileName = getFileNameFromUrl(url);
    // Download the file
    await downloadBinaryFile(url);
    // Resize the image
    await resizeImage(fileName);
  }
}

createDirectories();
resizeImages(urls);
