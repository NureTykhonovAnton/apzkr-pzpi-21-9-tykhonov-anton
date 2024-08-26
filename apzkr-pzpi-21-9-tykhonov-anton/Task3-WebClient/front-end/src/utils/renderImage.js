import { Buffer } from 'buffer';
/**
 * Converts a buffer object to a base64-encoded image string.
 * 
 * @param {Object} bufferObject - The object containing the image data buffer.
 * @param {Buffer} bufferObject.data - The buffer containing the raw image data.
 * 
 * @returns {string} - A base64-encoded data URL representing the image.
 *                     If the bufferObject is not valid, an empty string is returned.
 * 
 * @throws {Error} - Throws an error if an issue occurs during the conversion process.
 * 
 * @example
 * const bufferObj = { data: someBufferData };
 * const imageUrl = renderImage(bufferObj);
 * console.log(imageUrl); // Outputs: data:image/jpeg;base64,....
 */
export const renderImage = (bufferObject) => {
  try {
    // Check if bufferObject exists and contains valid data
    if (bufferObject && bufferObject.data) {
      // Convert buffer data to a base64 string
      const base64String = Buffer.from(bufferObject.data).toString('base64');
      
      // Return a data URL with the base64-encoded image
      return `data:image/jpeg;base64,${base64String}`;
    }
    
    // Return an empty string if bufferObject is invalid
    return '';
  } catch (error) {
    // Log the error to the console
    console.error('Image rendering error:', error);
    
    // Rethrow the error to handle it in the calling code
    throw error;
  }
};