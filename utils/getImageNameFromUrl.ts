export const getImageNameFromUrl = (urlInput: string) => {
  try {
    const url = new URL(urlInput);
    const pathname = url.pathname;

    const result = pathname.substring(pathname.lastIndexOf("/") + 1);

    if (!result) {
      const date = new Date();
      return `No_Name_${date
        .toLocaleTimeString()
        .replace(/\s/g, "_")}_${date.toDateString().replace(/\s/g, "_")}`;
    }

    return result;
  } catch (err) {
    return urlInput;
  }
};
