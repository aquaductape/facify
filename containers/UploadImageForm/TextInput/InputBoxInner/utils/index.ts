import { nanoid } from "nanoid";
import { doesImageExist } from "../../../../../utils/doesImageExist";
import { getImageNameFromUrl } from "../../../../../utils/getImageNameFromUrl";

export const splitValueIntoUrlItems = ({
  value,
  imgError,
  errorMsg,
}: {
  value: string;
  imgError: boolean;
  errorMsg: string;
}) => {
  value = value.replace(/([^\s\n])(https?:\/\/)/g, (_, p1, p2) => {
    return `${p1} ${p2}`;
  });

  const urls = value.split(" ").filter((item) => item);

  const urlItems = urls.map((url) => {
    return {
      id: nanoid(),
      content: url,
      name: getImageNameFromUrl(url),
      error: imgError,
      errorMsg: errorMsg,
    };
  });

  return urlItems;
};
