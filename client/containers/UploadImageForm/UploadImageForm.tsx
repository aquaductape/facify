import { nanoid } from "nanoid";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { CSSTransition, Transition } from "react-transition-group";
import {
  demographicResult3,
  demographicsResult,
  demographResult2,
} from "../../dummyData/demographicsResult";
import { imageUri, imageUri3, imgUri2 } from "../../dummyData/imageUri";
import { useMatchMedia } from "../../hooks/useMatchMedia";
import { RootState } from "../../store/rootReducer";
import { TDemographics, TDemographicsResponse } from "../../ts";
import { convertFileToBase64 } from "../../utils/convertFileToBase64";
import dataURLtoFile from "../../utils/dataURLtoFile";
import { getBase64FromUrl } from "../../utils/getBase64FromUrl";
import { getImageNameFromUrl } from "../../utils/getImageNameFromUrl";
import { JSON_Stringify_Parse } from "../../utils/jsonStringifyParse";
import { reflow } from "../../utils/reflow";
import createCroppedImgUrl from "../FaceDetectionResult/BoundingCroppedImage/createCroppedImgUrl";
import {
  addDemographicsParentAndChildren,
  setDemoItemHoverActive,
  TDemographicNode,
} from "../FaceDetectionResult/ImageResult/demographicsSlice";
import { addImage } from "../Table/imageHeightSlice";
import { animateResult, startAnimate } from "./animateUpload";
import FormTextInput from "./FormTextInput/FormTextInput";
import { setImageLoaded, setImageStatus, setUri } from "./imageUrlSlice";
import Input from "./FormTextInput/InputBox";
import Loader from "./Loader";

const placeholderError = "URL Required*";

const UploadImageForm = () => {
  const dispatch = useDispatch();
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );
  const mqlRef = useMatchMedia();
  const [showLoader, setShowLoader] = useState(false);
  const [state, setState] = useState({
    urlInput: {
      value: "",
      placeholder: "Past URL ...",
      error: false,
    },
  });

  const onCancel = () => {
    setShowLoader(false);
  };

  const postClarifaiAPI = async ({ base64 }: { base64: string }) => {
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
    const result = (await res.json()) as TDemographicsResponse;
    return result;
  };

  const getImageDimensions = async (url: string) => {
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

  const uploadAndAnimate = async ({
    name,
    id,
    croppedUrl,
    url,
    data,
    img,
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

    startAnimate({ firstImage: !imageLoaded });

    batch(() => {
      dispatch(setUri(croppedUrl));
      dispatch(setImageLoaded(true));
      dispatch(setImageStatus("DONE"));
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
      mql: mqlRef.current!.minWidth_1900_and_minHeight_850,
      firstImage: !imageLoaded,
    });
  };

  //   useEffect(() => {
  //     const run = async () => {
  //       // const id = nanoid();
  //
  //       const items = [
  //         {
  //           _id: nanoid(),
  //           imageUri: imgUri2,
  //           data: JSON_Stringify_Parse(demographResult2),
  //           name: "da-feasters",
  //         },
  //         {
  //           _id: nanoid(),
  //           imageUri: imageUri3,
  //           data: demographicResult3,
  //           name: "2021768",
  //         },
  //         {
  //           _id: nanoid(),
  //           imageUri: imageUri,
  //           data: demographicsResult,
  //           name: "GettyImages-1147443912",
  //         },
  //         {
  //           _id: nanoid(),
  //           imageUri: imgUri2,
  //           data: {
  //             data: JSON_Stringify_Parse(demographResult2).data.map((item) => ({
  //               ...item,
  //               id: item.id + "2",
  //             })),
  //           },
  //           name: "da-feasters",
  //         },
  //       ];
  //
  //       for (const { _id, data, imageUri, name } of items) {
  //         const objectUrl = window.URL.createObjectURL(dataURLtoFile(imageUri));
  //         const img = new Image();
  //         img.src = objectUrl;
  //
  //         await new Promise((resolve) =>
  //           setTimeout(
  //             () =>
  //               (img.onload = () => {
  //                 resolve(true);
  //               })
  //           )
  //         );
  //
  //         const result = (data.data as unknown) as TDemographicNode[];
  //
  //         for (const item of result) {
  //           item.hoverActive = false;
  //           item.scrollIntoView = false;
  //           item.generalHover = false;
  //           item.uri = await createCroppedImgUrl({
  //             boundingBox: item.bounding_box,
  //             img: {
  //               src: imageUri,
  //               naturalHeight: img.naturalHeight,
  //               naturalWidth: img.naturalWidth,
  //             },
  //           });
  //         }
  //
  //         const base64 = imageUri;
  //
  //         batch(() => {
  //           // dispatch(setUri(objectUrl));
  //           dispatch(setImageLoaded(true));
  //           dispatch(setImageStatus("DONE"));
  //           dispatch(addImage({ id: _id, imageHeight: null }));
  //           dispatch(
  //             addDemographicsParentAndChildren({
  //               parent: {
  //                 id: _id,
  //                 name,
  //                 hoverActive: false,
  //                 imageUrl: {
  //                   naturalWidth: img.naturalWidth,
  //                   naturalHeight: img.naturalHeight,
  //                   uri: objectUrl,
  //                 },
  //               },
  //               data: result,
  //             })
  //           );
  //         });
  //       }
  //     };
  //
  //     setTimeout(() => {
  //       run();
  //     }, 500);
  //   }, []);

  const onImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files) return;
      if (files!.length > 10) {
        // throw notification error: "cannot upload more than 10 images"
        return;
      }
      const file = files![0] as File;
      const { base64, file: newFile } = await convertFileToBase64(file);
      const result = await postClarifaiAPI({ base64 });
      const objectUrl = window.URL.createObjectURL(newFile);
      const img = await getImageDimensions(objectUrl);
      const data = (result.data as unknown) as TDemographicNode[];

      await uploadAndAnimate({
        id: nanoid(),
        croppedUrl: base64,
        url: objectUrl,
        data,
        img,
        name: file.name,
      });

      setShowLoader(false);
    } catch (err) {
      // batch(() => {
      //   dispatch(setImageStatus("DONE"));
      //   dispatch(setImageError("Server Error"));
      // });
    }
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let urlValue = state.urlInput.value.trim();

    if (!urlValue) {
      setState((prev) => {
        const copy = JSON_Stringify_Parse(prev);
        copy.urlInput.value = "";
        copy.urlInput.placeholder = placeholderError;
        copy.urlInput.error = true;
        return copy;
      });
    }

    let { base64, sizeMB } = await getBase64FromUrl({
      url: urlValue,
      proxy: "/api/convert-base64",
    });

    console.log({ sizeMB });

    const name = getImageNameFromUrl(urlValue);

    if (sizeMB != null && sizeMB > 3.5) {
      const result = await convertFileToBase64(dataURLtoFile(base64));
      base64 = result.base64;
      urlValue = window.URL.createObjectURL(result.file);
    }

    const result = await postClarifaiAPI({ base64 });
    const data = (result.data as unknown) as TDemographicNode[];
    const img = await getImageDimensions(urlValue);

    await uploadAndAnimate({
      id: nanoid(),
      croppedUrl: base64,
      url: urlValue,
      data,
      img,
      name,
    });

    setShowLoader(false);

    setState((prev) => {
      const copy = JSON_Stringify_Parse(prev);
      copy.urlInput.placeholder = "Paste URL...";
      copy.urlInput.value = "";
      copy.urlInput.error = false;
      return copy;
    });
  };

  return (
    <div id="main-bar-input" className="input-group">
      <div className="multifile-upload-group">
        {/* <BrowserView>
						</BrowserView> */}
        <button id="webcam-button" className="input-button--webcam">
          WebCam
        </button>
        <div className="shared-pillar pillar-1"></div>
        <input
          onChange={onImageUpload}
          type="file"
          name="file"
          accept="image/png, image/jpeg"
          id="upload-image-form-file"
          className="input-file--hidden"
        />
        <label className="label-input-file" htmlFor="upload-image-form-file">
          Upload
        </label>
        <div className="shared-pillar pillar-2"></div>
        <FormTextInput
          onSubmitForm={onSubmitForm}
          setUploadState={setState}
          uploadState={state}
        ></FormTextInput>
      </div>
      <Transition in={showLoader} unmountOnExit timeout={500}>
        <div className="loader-container">
          <Loader onCancel={onCancel}></Loader>
        </div>
      </Transition>
      <style jsx>
        {`
          .input-group {
            position: sticky;
            top: 15px;
            left: 0;
            z-index: 83;
          }

          .multifile-upload-group {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 5px 2fr;
            width: 100.01%;
            height: 45px;
            background: #fff;
          }

          .input-file--hidden {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
          }

          .label-input-file {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
          }

          .label-input-file:hover,
          .input-file--hidden:focus + .label-input-file {
            background: #c6c6c6;
            color: #000;
          }

          .input-file--hidden:focus + .label-input-file {
            outline: none;
          }

          .input-file--hidden.focus-visible + .label-input-file {
            outline: 3px solid #000;
            outline-offset: 2px;
            z-index: 1;
          }

          .input-button--webcam {
            display: none;
            width: 100%;
            font-size: 1rem;
            border: none;
            padding: 10px 20px;
            background: inherit;
            font-size: 1rem;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
          }

          .input-button--webcam:hover {
            background: #c6c6c6;
            color: #000;
          }

          .input-button--webcam:focus {
            outline: none;
          }

          .input-button--webcam.focus-visible {
            background: #c6c6c6;
            color: #000;
            outline: 3px solid #000;
            outline-offset: 2px;
          }

          .shared-pillar {
            background: #c6c6c6;
          }

          .pillar-1 {
            display: none;
          }

          .loader-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          @media (min-width: 800px) {
            .multifile-upload-group {
              grid-template-columns: 1fr 5px 1fr 5px 2fr;
            }

            .pillar-1 {
              display: block;
            }

            .input-button--webcam {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default UploadImageForm;
