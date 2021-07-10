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
  const supportedImgFormats = CONSTANTS.supportedImgFormats.join("|");
  const urlProtocols = `https?:\\/\\/|blob:${location.origin}|data:image\\/(${supportedImgFormats});base64,`;
  const urlTypesRegex = new RegExp(`^${urlProtocols}`);
  const splitUrlsRegex = new RegExp(
    `([^\\s\\n:])?(\\?\\w+=)?(${urlProtocols})`,
    "gi"
  );
  // TODO
  // unsupported image type is announced. example: tiff is not supported
  // on tagarea show that data:image was converted to blob url.
  // Pasted URLs must be prefixed with https:// or data:image/ or blob:https//

  value = value.replace(
    splitUrlsRegex,
    (_, charBeforeStr, queryStr, protocolStr) => {
      // if query contains URL protocol that's not encoded, skip
      if (queryStr && protocolStr) return _;

      if (queryStr && !protocolStr) return _;

      return `${charBeforeStr ? charBeforeStr + " " : ""}${protocolStr}`;
    }
  );

  const getYoutubeImgFromURL = (url: string) => {
    // regex https://stackoverflow.com/a/27728417/8234457
    // images from id https://stackoverflow.com/a/20542029/8234457
    const youtubeIdRegex =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const result = url.match(youtubeIdRegex)!;

    if (!result) return null;

    const id = result[1];

    if (id) {
      return {
        id,
        url: `https://img.youtube.com/vi/${id}/0.jpg`,
      };
    }

    return null;
  };

  const urls = value
    .split(/\s+|\n+/)
    .filter((item) => item.match(urlTypesRegex));

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

    const youtubeData = getYoutubeImgFromURL(url);
    const name = youtubeData ? youtubeData.id : getImageNameFromUrl(url);

    if (youtubeData) {
      url = youtubeData.url;
    }

    return {
      id: nanoid(),
      content: url,
      name,
      error: false,
      errorMsg: "",
      errorTitle: "",
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
