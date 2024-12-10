export async function resizeImage(
  file: File,
  maxWidth: number = 1500,
  maxHeight: number = 500
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate the aspect ratio of the banner
      const bannerAspectRatio = maxWidth / maxHeight;
      const imageAspectRatio = width / height;

      if (imageAspectRatio > bannerAspectRatio) {
        // Image is wider than the banner aspect ratio
        width = maxWidth;
        height = width / imageAspectRatio;
      } else {
        // Image is taller than the banner aspect ratio
        height = maxHeight;
        width = height * imageAspectRatio;
      }

      // Ensure the image fits within the maximum dimensions
      if (width > maxWidth) {
        width = maxWidth;
        height = width / imageAspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * imageAspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      // Adjust quality for JPEG images to reduce file size
      const quality = file.type === "image/jpeg" ? 0.9 : 1;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }
        },
        file.type,
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
