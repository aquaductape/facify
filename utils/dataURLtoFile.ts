const dataURLtoFile = (dataUrl: string, filename?: string) => {
  if (!filename) {
    const nameFromURL = dataUrl.substring(dataUrl.lastIndexOf("/") + 1);
    const date = new Date();
    filename = nameFromURL
      ? nameFromURL
      : `No_Name_${date.toLocaleTimeString().replace(/\s/g, "_")}_${date
          .toDateString()
          .replace(/\s/g, "_")}`;
  }

  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export default dataURLtoFile;
