import { Dispatch } from "react";
import { TMqlGroup } from "../../../../hooks/useMatchMedia";
import { convertFileToBase64 } from "../../../../utils/convertFileToBase64";
import { TDemographicNode } from "../../../FaceDetectionResult/ImageResult/demographicsSlice";
import { TURLItem } from "../../formSlice";
import { updateImgQueue } from "../../imageUrlSlice";
import {
  addImageAndAnimate,
  getImageDimensions,
  postClarifaiAPI,
} from "../../upload";
import { CONSTANTS } from "../../../../constants";

type TItemType = { file: File; firstToUpload?: boolean } & TURLItem;
export const onFileUpload = async (
  {
    item,
    idx,
    dispatch,
    imageLoaded,
    mqlRef,
  }: {
    item: TItemType;
    idx: number;
    dispatch: Dispatch<any>;
    imageLoaded: boolean;
    mqlRef: {
      current: TMqlGroup | null;
    };
  },
  self: TItemType[]
) => {
  const maxSizeMB = 3.5;
  const kbRatio = 1_000_000;

  if (
    !CONSTANTS.supportedImgFormats.includes(
      item.file.type.replace("image/", "")
    )
  ) {
    const isImage = !!item.file.type.match("image");
    const errorTitle = !isImage
      ? "File is not an image"
      : `${item.file.type.replace("image/", "")} image not supported`;

    dispatch(
      updateImgQueue({
        id: item.id,

        props: {
          currentImgStatus: "DONE",
          error: true,
          errorMsg: errorTitle,
          errorTitle: errorTitle,
        },
      })
    );

    if (self[idx + 1]) {
      self[idx + 1].firstToUpload = true;
    }
    return;
  }

  try {
    if (item.file.size > maxSizeMB * kbRatio) {
      dispatch(
        updateImgQueue({
          id: item.id,
          props: { currentImgStatus: "COMPRESSING" },
        })
      );
    }

    const { base64, file: newFile } = await convertFileToBase64(item.file);

    dispatch(
      updateImgQueue({
        id: item.id,
        props: { currentImgStatus: "SCANNING" },
      })
    );

    const result = await postClarifaiAPI({ base64, resetOrientation: true });

    if (
      result.status.code !== 10000 && // OK
      result.status.code !== 10010 // Mixed Success
    ) {
      const errorMsg = `Server Error. ${result.status.message}`;
      dispatch(
        updateImgQueue({
          id: item.id,
          props: {
            error: true,
            errorMsg,
            errorTitle: "Server Error",
            currentImgStatus: "DONE",
          },
        })
      );
      return;
    }

    const objectUrl = window.URL.createObjectURL(newFile);
    const img = await getImageDimensions(objectUrl);
    const data = result.data as unknown as TDemographicNode[];
    const mql = mqlRef.current!;

    await addImageAndAnimate({
      id: item.id,
      croppedUrl: base64,
      url: objectUrl,
      data,
      img,
      name: item.name,
      dispatch,
      firstImage:
        (!imageLoaded && idx === 0) || (!imageLoaded && !!item.firstToUpload),
      mql,
    });
  } catch (err) {
    const errorMsg = "Error";
    dispatch(
      updateImgQueue({
        id: item.id,
        props: { error: true, errorMsg, currentImgStatus: "DONE" },
      })
    );
    return;
  }
};
