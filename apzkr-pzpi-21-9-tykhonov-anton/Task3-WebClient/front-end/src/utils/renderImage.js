import { Buffer } from 'buffer';
export const renderImage = (bufferObject) => {
  try{
    if (bufferObject && bufferObject.data) {
      // Convert buffer data to a base64 string
      const base64String = Buffer.from(bufferObject.data).toString('base64');
      return `data:image/jpeg;base64,${base64String}`;
    }
    return '';
  }catch(error){
    console.log('Image rendering error:',error)
    throw error;
  }
};