export const convertFileToBase64 = (file: File) => {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target!.result as string);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
};
