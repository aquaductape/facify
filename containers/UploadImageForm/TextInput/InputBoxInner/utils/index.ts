import { Dispatch } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { batch } from "react-redux";
import { doesImageExist } from "../../../../../utils/doesImageExist";
import { getImageNameFromUrl } from "../../../../../utils/getImageNameFromUrl";
import { JSON_Stringify_Parse } from "../../../../../utils/jsonStringifyParse";
import { setUrlItemError } from "../../../formSlice";

export const splitValueIntoUrlItems = ({ value }: { value: string }) => {
  value = value.replace(/([^\s\n])(https?:\/\/)/g, (_, p1, p2) => {
    return `${p1} ${p2}`;
  });

  // filter in case last "spacing" was split, resulting extra item that is empty
  const urls = value.split(/\s+|\n+/).filter((item) => item);

  const urlItems = urls.map((url) => {
    return {
      id: nanoid(),
      content: url,
      name: getImageNameFromUrl(url),
      error: false,
      errorMsg: "",
    };
  });

  return urlItems;
};

export const checkDebouncedUrls = async (
  dispatch: Dispatch,
  _urls: {
    id: string;
    content: string;
    error: boolean;
  }[]
) => {
  const urls = JSON_Stringify_Parse(_urls); // input will be tainted by redux/immer, must create new objects

  for (const url of urls) {
    const success = await doesImageExist(url.content);
    url.error = !success;
  }

  batch(() => {
    urls.forEach(({ id, error }) => {
      dispatch(setUrlItemError({ id, error }));
    });
  });
};
