import config from '../AppConfig';

/**
 * Generates an integer in range of (0, chunksAmount)
 * 
 * @returns {number}
 */
function generateSingleRandomCoordinate() {
  return Math.floor(Math.random() * Math.floor(config.chunksAmount));
}

/**
 * Generates random cooridnates
 * 
 * @returns {number[]}
 */
function generateRandomCoordinates() {
  return Array(2).fill(generateSingleRandomCoordinate());
}

export { generateSingleRandomCoordinate, generateRandomCoordinates };
