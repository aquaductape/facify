import { Dispatch } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { batch } from "react-redux";
import { CONSTANTS } from "../../../../../constants";
import { doesImageExist } from "../../../../../utils/doesImageExist";
import { getImageNameFromUrl } from "../../../../../utils/getImageNameFromUrl";
import { JSON_Stringify_Parse } from "../../../../../utils/jsonStringifyParse";
import { convertDataURLToObjectURL } from "../../../../../utils/windowObjectURL";
import { setUrlItemError } from "../../../formSlice";

export const splitValueIntoUrlItems = ({ value }: { value: string }) => {
  const blobRegex = new RegExp(`blob:${location.origin}`);
  const hasBlobURL = !!value.match(blobRegex);
  const urlsRegex = new RegExp(
    "([^\\s\\n:])?(blob:)?(\\?\\w+=)?(https?:\\/\\/)" +
      (hasBlobURL ? `(${location.host})?` : ""),
    "gi"
  );

  value = value.replace(
    urlsRegex,
    (_, charBeforeStr, blobProtoStr, queryStr, protocolStr, urlOrigin) => {
      if (blobProtoStr && protocolStr && urlOrigin) {
        return `${charBeforeStr || ""} ${
          blobProtoStr + protocolStr + urlOrigin
        }`;
      }
      // if query contains URL protocol that's not encoded, skip
      if (queryStr && protocolStr) return _;

      return `${charBeforeStr || ""} ${protocolStr}`;
    }
  );

  // filter in case last "spacing" was split, resulting extra item that is empty
  const urls = value.split(/\s+|\n+/).filter((item) => item);

  const urlItems = urls.map((url) => {
    const isObjectURL = !!url.match(/^blob:/);
    let isDataURL = !!url.match(/^data:image.+base64,/);
    let error = false;
    let errorMsg = "";

    if (isDataURL) {
      console.log("is dataUrl");
      const objectURL = convertDataURLToObjectURL(url);

      if (!objectURL) {
        error = true;
        errorMsg = CONSTANTS.imageDataURLErrorMsg;
      } else {
        url = objectURL;
      }
    }

    const name = getImageNameFromUrl(url);

    return {
      id: nanoid(),
      content: url,
      name,
      error: false,
      errorMsg: "",
      isDataURL: isObjectURL || isDataURL,
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
    isDataURL: boolean;
  }[]
) => {
  const urls = JSON_Stringify_Parse(_urls); // input will be tainted by redux/immer, must create new objects

  for (const url of urls) {
    const success = await doesImageExist(url.content);
    url.error = !success;
  }

  batch(() => {
    urls.forEach(({ id, error, isDataURL }) => {
      dispatch(setUrlItemError({ id, error, isDataURL }));
    });
  });
};
