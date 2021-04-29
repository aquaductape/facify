import imageCompression from "browser-image-compression";

const maxSizeMB = 3.5;
const kbRatio = 1_000_000;
export const convertFileToBase64 = async (file: File) => {
  if (file.size > maxSizeMB * kbRatio || file.type !== "image/jpeg") {
    file = await imageCompression(file, {
      maxSizeMB,
      useWebWorker: true,
      fileType: "image/jpeg",
    });
  }

  return new Promise<{ base64: string; file: File }>((res, rej) => {
    const reader = new FileReader();

    reader.onload = (e) => res({ base64: e.target!.result as string, file });
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
};
