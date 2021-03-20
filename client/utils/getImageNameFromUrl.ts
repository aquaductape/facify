export const getImageNameFromUrl = (urlInput: string) => {
  const url = new URL(urlInput);
  const pathname = url.pathname;
  return pathname.substring(pathname.lastIndexOf("/") + 1);
};
