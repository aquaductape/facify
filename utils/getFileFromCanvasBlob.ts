export const getFileFromCanvasBlob = ({
  canvas,
  name,
  type = "image/jpeg",
}: {
  canvas: HTMLCanvasElement;
  name: string;
  type?: string;
}) =>
  new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob!], name, { type });
      resolve(file);
    }, type);
  });
