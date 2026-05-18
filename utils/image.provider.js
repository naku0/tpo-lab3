const path = require('path');
const fs = require('fs');

class ImageProvider {
  getTestImage(imageName = 'test-avatar.png') {
    const imagePath = path.join(__dirname, imageName);

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Test image not found: ${imagePath}`);
    }

    return imagePath;
  }
}

module.exports = new ImageProvider();
