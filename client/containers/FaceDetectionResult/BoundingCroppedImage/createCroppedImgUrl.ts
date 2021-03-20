import { TBoundingBox } from "../../../ts";

type CreateCroppedImg = {
  id?: string;
  img: {
    src: string;
    naturalWidth: number;
    naturalHeight: number;
  };
  boundingBox: TBoundingBox;
};
const createCroppedImgUrl = async ({
  id,
  boundingBox,
  img,
}: CreateCroppedImg) => {
  const imgNaturalWidth = img.naturalWidth;
  const imgNaturalHeight = img.naturalHeight;

  // const canvasCollection = this.state.canvasCollection;
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  const downloadedImage = new Image();
  const proxy = process.env.NEXT_PUBLIC_CORS_PROXY;
  downloadedImage.crossOrigin = "Anonymous";

  // if (img.src.match(/^(data:image\/(png|jpeg|jpg|gif|webp);base64,|blob:)/)) {
  downloadedImage.src = img.src;
  // }

  // img = downloadedImage;
  const onLoadDownloadedImage = () =>
    new Promise<string>((resolve) => {
      downloadedImage.onload = () => {
        const startCropWidth = imgNaturalWidth * boundingBox.left_col;
        const startCropHeight = imgNaturalHeight * boundingBox.top_row;
        const endCropWidth =
          imgNaturalWidth * boundingBox.right_col -
          imgNaturalWidth * boundingBox.left_col;
        const endCropHeight =
          imgNaturalHeight * boundingBox.bottom_row -
          imgNaturalHeight * boundingBox.top_row;

        canvas.width = endCropWidth;
        canvas.height = endCropHeight;

        ctx!.drawImage(
          downloadedImage,
          startCropWidth,
          startCropHeight,
          imgNaturalWidth,
          imgNaturalHeight,
          0,
          0,
          imgNaturalWidth,
          imgNaturalHeight
        );

        // const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
        canvas.toBlob((blob) => {
          const dataUrl = window.URL.createObjectURL(blob);
          resolve(dataUrl);
        });
      };
    });

  return await onLoadDownloadedImage();
};

export default createCroppedImgUrl;
