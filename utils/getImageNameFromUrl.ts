export const getImageNameFromUrl = (urlInput: string) => {
  try {
    const hasURLEncoded = !!urlInput.match(/https?%3A%2F%2F/);

    const result = urlInput.substring(
      urlInput.lastIndexOf(hasURLEncoded ? "%2F" : "/") +
        (hasURLEncoded ? 3 : 1)
    );

    if (!result) {
      const date = new Date();
      return `No_Name_${date.toLocaleTimeString().replace(/\s/g, "_")}_${date
        .toDateString()
        .replace(/\s/g, "_")}`;
    }

    return result;
  } catch (err) {
    return urlInput;
  }
};
