import UTIF from "utif";
import fileToArrayBuffer from "file-to-array-buffer";

export const decodeTifImage = (file: File) => {
  // const buffer = await fileToArrayBuffer(file);
  // const ifds = UTIF.decode(buffer);
  // UTIF.decodeImage(buffer, ifds[0]);
  // const rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array with RGBA pixels
  // const blob = new Blob(ifds[0].data, { type: "image/jpeg" });
  // console.log(ifds);

  // return new File([blob], file.name, { type: "image/jpeg" });
  return URL.createObjectURL(file);
  // return blobToFile(blob, file.name);
};

// const blobToFile = (theBlob: Blob, fileName: string): File => {
//   const b: any = theBlob;
//   //A Blob() is almost a File() - it's just missing the two properties below which we will add
//   b.lastModifiedDate = new Date();
//   b.name = fileName;
//
//   //Cast to a File() type
//   return <File>theBlob;
// };
