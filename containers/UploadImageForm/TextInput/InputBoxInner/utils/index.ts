import { Dispatch } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { batch } from "react-redux";
import { CONSTANTS } from "../../../../../constants";
import {
  doesURLExist,
  doesImageExist as doesImageExist,
} from "../../../../../utils/doesURLExist";
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

  value = value.replace(
    splitUrlsRegex,
    (_, charBeforeStr, queryStr, protocolStr) => {
      // if query contains URL protocol that's not encoded, skip
      if (queryStr && protocolStr) return _;

      if (queryStr && !protocolStr) return _;

      return `${charBeforeStr ? charBeforeStr + " " : ""}${protocolStr}`;
    }
  );

  const urls = value
    .split(/\s+|\n+/)
    .filter((item) => item.match(urlTypesRegex));

  const urlItems = urls.map((url) => {
    const isObjectURL = !!url.match(/^blob:/);
    let isDataURL = !!url.match(/^data:image.+base64,/);
    let error = false;
    let errorMsg = "";
    let name = "";

    if (isDataURL) {
      const objectURL = convertDataURLToObjectURL(url);

      if (!objectURL) {
        error = true;
        errorMsg = CONSTANTS.imageDataURLErrorMsg;
      } else {
        url = objectURL;
      }
    }

    if (isDataURL || isObjectURL) {
      name = getImageNameFromUrl(url);
    } else {
      const result = getImgDataFromLink(url);
      name = result.name;
      url = result.url;
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
    const imageExist = await doesImageExist(url.content);
    // const urlExist = await doesURLExist(url.content);
    // const urlExistyay = await urlExist(url.content);
    url.error = !imageExist;
  }

  batch(() => {
    urls.forEach(({ id, error, isDataURL }) => {
      dispatch(setUrlItemError({ id, error, isDataURL }));
    });
  });
};

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

const getImgFromSearchEngineImageResult = (inputURL: string) => {
  const google = "www.google.com/imgres?";
  const bing = "www.bing.com/images/search?";
  const yahoo = "images.search.yahoo.com/images";
  const baidu = "image.baidu.com/search/detail?";

  type SE = {
    [key: string]: { url: string; param: string; prependProtocol?: boolean };
  };

  const searchEngines: SE = {
    google: {
      url: google,
      param: "imgurl",
    },
    bing: {
      url: bing,
      param: "mediaurl",
    },
    yahoo: {
      url: yahoo,
      param: "imgurl",
      prependProtocol: true,
    },
    baidu: {
      url: baidu,
      param: "objurl",
    },
  };

  for (const key in searchEngines) {
    const { url, param, prependProtocol } = searchEngines[key];
    const newURL = url.replace(/\./g, "\\.").replace(/\//g, `\\\/`);
    const regex = new RegExp(`^https?:\\/\\/${newURL}(.+)${param}=([^&]+)`);
    const regexResult = inputURL.match(regex);
    const getProtocol = (url: string) => {
      const result = url.match(/url=(https?)/);
      const fallback = "http://"; // must fallback to unsecure protocol since secure can fallback to that, but unsecure protocol can't use secure

      if (!result) return fallback;

      const protocol = result[1];

      if (!protocol) return fallback;

      return protocol + "://";
    };

    if (!regexResult) continue;
    let imgURL = regexResult[2];

    if (!imgURL) continue;

    if (prependProtocol) {
      const protocol = getProtocol(inputURL);
      imgURL = protocol + imgURL;
    }

    return decodeURIComponent(imgURL);
  }

  return null;
};

const getImgDataFromLink = (url: string) => {
  const searchEngineResult = getImgFromSearchEngineImageResult(url);

  if (searchEngineResult) {
    url = searchEngineResult;
  }

  const youtubeData = getYoutubeImgFromURL(url);

  const name = youtubeData ? youtubeData.id : getImageNameFromUrl(url);

  if (youtubeData) {
    url = youtubeData.url;
  }

  return {
    url,
    name,
  };
};
