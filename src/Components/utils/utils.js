import {Image} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

export const getImageDimensions = async filePath => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      filePath,
      (width, height) => {
        resolve({width, height});
      },
      error => {
        reject(error);
      },
    );
  });
};

// Function to convert the image to base64 after resizing
export const convertFileToBase64 = async (filePath, targetWidth) => {
  const fileUri = `file://${filePath}`;
  try {
    const {width, height} = await getImageDimensions(fileUri);
    let resizedWidth = targetWidth;
    let resizedHeight = (height / width) * resizedWidth;
    if (width > 2000) {
      resizedWidth = 1000;
      resizedHeight = (height / width) * resizedWidth;
    }
    const resizedImage = await ImageResizer.createResizedImage(
      fileUri,
      resizedWidth,
      resizedHeight,
      'JPEG',
      80,
    );
    const base64 = await RNFS.readFile(resizedImage.uri, 'base64');

    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error converting file to Base64 or resizing image:', error);
    throw error;
  }
};

export function getBase64ImageSize(base64String) {
  const base64Data = base64String.split(',')[1] || base64String;
  const padding = (base64Data.match(/=/g) || []).length;
  const sizeInBytes = (base64Data.length * 3) / 4 - padding;
  return sizeInBytes;
}
