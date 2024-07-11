export const renderImage = (bufferObject) => {
    if (bufferObject && bufferObject.data) {
      const base64String = btoa(
        new Uint8Array(bufferObject.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64String}`;
    }
    return '';
  };