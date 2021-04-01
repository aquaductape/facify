export const getImageNameFromUrl = (urlInput: string) => {
  try {
    const url = new URL(urlInput);
    const pathname = url.pathname;

    return pathname.substring(pathname.lastIndexOf("/") + 1);
  } catch (err) {
    return urlInput;
  }
};
