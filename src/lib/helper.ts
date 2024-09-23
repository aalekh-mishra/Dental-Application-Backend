import sharp from 'sharp';
// export const getBase64 = (file:any) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;


const MAX_SIZE = 200 * 1024; // 200 KB

interface FileType {
  buffer: Buffer;
  mimetype: string;
}

const getBase64 = async (file: FileType): Promise<string> => {
  let quality = 80; // Initial quality
  let optimizedBuffer: Buffer;

  // Loop until the image size is less than 200 KB
  while (true) {
    optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 800 }) // Adjust width as needed
      .jpeg({ quality })  // Start with quality at 80%
      .toBuffer();

    // Check if the size is within the limit (200 KB)
    if (optimizedBuffer.length <= MAX_SIZE) {
      break;
    }

    // If the image is larger than 200 KB, reduce the quality
    quality -= 5;

    // Ensure quality doesn't go below a reasonable threshold
    if (quality < 10) {
      throw new Error('Unable to reduce the image below 200 KB');
    }
  }

  // Convert to Base64
  return `data:${file.mimetype};base64,${optimizedBuffer.toString('base64')}`;
};

export default getBase64;
