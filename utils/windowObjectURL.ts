import dataURLtoFile from "./dataURLtoFile";

export const convertDataURLToObjectURL = (dataURL: string) => {
  try {
    return window.URL.createObjectURL(dataURLtoFile(dataURL));
  } catch (err) {
    return null;
  }
};

export const convertObjectURLtoDataURL = (objectURL: string) =>
  new Promise<string>((resolve) => {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const downloadedImage = new Image();
    downloadedImage.crossOrigin = "Anonymous";

    downloadedImage.onload = () => {
      canvas.width = downloadedImage.naturalWidth;
      canvas.height = downloadedImage.naturalHeight;

      ctx!.drawImage(downloadedImage, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
      resolve(dataUrl);
    };

    downloadedImage.src = objectURL;
  });
