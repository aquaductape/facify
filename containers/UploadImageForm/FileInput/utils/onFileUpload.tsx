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

export const onFileUpload = async ({
  item,
  idx,
  dispatch,
  imageLoaded,
  mqlRef,
}: {
  item: { file: File } & TURLItem;
  idx: number;
  dispatch: Dispatch<any>;
  imageLoaded: boolean;
  mqlRef: {
    current: TMqlGroup | null;
  };
}) => {
  const maxSizeMB = 3.5;
  const kbRatio = 1_000_000;

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
        props: { error: true, errorMsg, currentImgStatus: "DONE" },
      })
    );
    return;
  }

  const objectUrl = window.URL.createObjectURL(newFile);
  const img = await getImageDimensions(objectUrl);
  const data = (result.data as unknown) as TDemographicNode[];
  const mql = mqlRef.current!;

  await addImageAndAnimate({
    id: item.id,
    croppedUrl: base64,
    url: objectUrl,
    data,
    img,
    name: item.name,
    dispatch,
    firstImage: !imageLoaded && idx === 0,
    mql,
  });
};
