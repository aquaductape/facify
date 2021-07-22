export const getImageNameFromUrl = (urlInput: string) => {
  // %2F is an encoded equivalent to "/" when the URL contains a query that's an encoded image URL
  const imageFullnameResult = urlInput.match(/.+(\/|%2F)(.+)/);

  if (!imageFullnameResult) return getTimeName();

  const imageFullname = imageFullnameResult[2];

  const imageNameResult = imageFullname.match(
    /.+(jpg|png|svg|jpeg|webp|bmp|gif)/
  );

  if (!imageNameResult) return imageFullname;

  const imageName = imageNameResult[0];

  return imageName;
};

const getTimeName = () => {
  const date = new Date();
  return `No_Name_${date.toLocaleTimeString().replace(/\s/g, "_")}_${date
    .toDateString()
    .replace(/\s/g, "_")}`;
};
