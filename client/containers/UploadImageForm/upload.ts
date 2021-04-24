import { Dispatch } from "react";
import { batch } from "react-redux";
import { TMqlGroup } from "../../hooks/useMatchMedia";
import { TDemographicsResponse } from "../../ts";
import createCroppedImgUrl from "../FaceDetectionResult/BoundingCroppedImage/createCroppedImgUrl";
import {
  addDemographicsParentAndChildren,
  TDemographicNode,
} from "../FaceDetectionResult/ImageResult/demographicsSlice";
import { addImage } from "../FaceDetectionResult/InfoResult/Table/imageHeightSlice";
import { animateResult, startAnimate } from "./animateUpload";
import {
  setCurrentImageStatus,
  setImageLoaded,
  setImageStatus,
  setUri,
} from "./imageUrlSlice";

export const addImageAndAnimate = async ({
  name,
  id,
  croppedUrl,
  url,
  data,
  img,
  mql,
  imageLoaded,
  dispatch,
}: {
  id: string;
  name: string;
  data: TDemographicNode[];
  url: string;
  croppedUrl: string;
  img: {
    naturalHeight: number;
    naturalWidth: number;
  };
  imageLoaded: boolean;
  mql: TMqlGroup;
  dispatch: Dispatch<any>;
}) => {
  for (const item of data) {
    item.hoverActive = false;
    item.scrollIntoView = false;
    item.generalHover = false;
    item.uri = await createCroppedImgUrl({
      boundingBox: item.bounding_box,
      img: {
        src: croppedUrl,
        naturalHeight: img.naturalHeight,
        naturalWidth: img.naturalWidth,
      },
    });
  }

  await startAnimate({ firstImage: !imageLoaded });

  batch(() => {
    dispatch(setUri(croppedUrl));
    dispatch(setImageLoaded(true));
    dispatch(setImageStatus("DONE"));
    dispatch(setCurrentImageStatus("DONE"));
    console.log("DONE");
    dispatch(addImage({ id, imageHeight: null }));
    dispatch(
      addDemographicsParentAndChildren({
        parent: {
          id,
          name,
          hoverActive: false,
          imageUrl: {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            uri: url,
          },
        },
        data,
      })
    );
  });

  animateResult({
    id,
    mql: mql.minWidth_1900_and_minHeight_850,
    firstImage: !imageLoaded,
  });
};

export const postClarifaiAPI = async ({ base64 }: { base64: string }) => {
  const res = await fetch("/api/scan-image", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64: base64,
    }),
  });
  console.log({ res });
  const result = (await res.json()) as TDemographicsResponse;
  console.log({ result });

  return result;
};

export const getImageDimensions = async (url: string) => {
  const img = new Image();
  img.src = url;

  return await new Promise<{ naturalHeight: number; naturalWidth: number }>(
    (resolve) => {
      img.onload = () => {
        const dimensions = {
          naturalHeight: img.naturalHeight,
          naturalWidth: img.naturalWidth,
        };
        resolve(dimensions);
      };
    }
  );
};
