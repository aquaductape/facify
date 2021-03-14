import { nanoid } from "nanoid";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { batch, useDispatch } from "react-redux";
import {
  demographicResult3,
  demographicsResult,
  demographResult2,
} from "../../dummyData/demographicsResult";
import { imageUri, imageUri3, imgUri2 } from "../../dummyData/imageUri";
import { TDemographicsResponse } from "../../ts";
import { convertFileToBase64 } from "../../utils/convertFileToBase64";
import dataURLtoFile from "../../utils/dataURLtoFile";
import { JSON_Stringify_Parse } from "../../utils/jsonStringifyParse";
import {
  addDemographicsParentAndChildren,
  TDemographicNode,
} from "../FaceDetectionResult/ImageResult/demographicsSlice";
import { addImage } from "../Table/imageHeightSlice";
import { setImageLoaded, setImageStatus, setUri } from "./imageUrlSlice";
import Input from "./Input";

const placeholderError = "URL Required*";

const UploadImageForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  // dispatch()
  const [state, setState] = useState({
    urlInput: {
      value: "",
      placeholder: "Past URL ...",
      error: false,
    },
    submitBtn: {
      hover: false,
    },
  });

  useEffect(() => {
    const run = async () => {
      // const id = nanoid();

      const items = [
        {
          _id: nanoid(),
          imageUri: imgUri2,
          data: JSON_Stringify_Parse(demographResult2),
          name: "da-feasters",
        },
        {
          _id: nanoid(),
          imageUri: imageUri,
          data: demographicsResult,
          name: "GettyImages-1147443912",
        },
        {
          _id: nanoid(),
          imageUri: imageUri3,
          data: demographicResult3,
          name: "2021768",
        },
        {
          _id: nanoid(),
          imageUri: imgUri2,
          data: JSON_Stringify_Parse(demographResult2),
          name: "da-feasters",
        },
      ];

      for (const { _id, data, imageUri, name } of items) {
        const objectUrl = window.URL.createObjectURL(dataURLtoFile(imageUri));
        const img = new Image();
        img.src = objectUrl;

        await new Promise((resolve) =>
          setTimeout(
            () =>
              (img.onload = () => {
                resolve(true);
              })
          )
        );
        const result = (data.data as unknown) as TDemographicNode[];
        result.forEach((item) => {
          item.hoverActive = false;
          item.scrollIntoView = false;
          item.generalHover = false;
        });
        const base64 = imageUri;
        console.log("fire");

        batch(() => {
          // dispatch(setUri(objectUrl));
          dispatch(setImageLoaded(true));
          dispatch(setImageStatus("DONE"));
          dispatch(addImage({ input: { imageHeight: null } }));
          dispatch(
            addDemographicsParentAndChildren({
              parent: {
                name,
                hoverActive: false,
                imageUrl: {
                  naturalWidth: img.naturalWidth,
                  naturalHeight: img.naturalHeight,
                  uri: objectUrl,
                },
              },
              data: result,
            })
          );
        });
      }
    };
    run();
  }, []);

  const onImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files) return;
      if (files!.length > 10) {
        // throw notification error: "cannot upload more than 10 images"
        return;
      }
      // console.log(files[0].size);
      // return;
      const file = files![0] as File;
      // dispatch(setImageStatus("LOADING"));
      const base64 = await convertFileToBase64(file);
      const res = await fetch("http://localhost:8000/scan-image", {
        method: "post",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64,
        }),
      });

      const result = (await res.json()) as TDemographicsResponse;
      const objectUrl = window.URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      await new Promise((resolve) =>
        setTimeout(
          () =>
            (img.onload = () => {
              resolve(true);
            })
        )
      );
      const data = (result.data as unknown) as TDemographicNode[];
      data.forEach((item) => {
        item.hoverActive = false;
        item.scrollIntoView = false;
        item.generalHover = false;
      });
      // return;

      batch(() => {
        // setUr
        dispatch(setUri(base64));
        dispatch(setImageLoaded(true));
        dispatch(setImageStatus("DONE"));
        dispatch(addImage({ input: { imageHeight: null } }));
        dispatch(
          addDemographicsParentAndChildren({
            parent: {
              name: file.name,
              hoverActive: false,
              imageUrl: {
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                uri: objectUrl,
              },
            },
            data,
          })
        );
        // dispatch()
      });
      console.log(result);
    } catch (err) {
      // batch(() => {
      //   dispatch(setImageStatus("DONE"));
      //   dispatch(setImageError("Server Error"));
      // });
    }
  };

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = state.urlInput.value;
    if (value.trim()) {
      setState((prev) => {
        const copy = JSON_Stringify_Parse(prev);
        copy.urlInput.placeholder = "Paste URL...";
        copy.urlInput.value = "";
        copy.urlInput.error = false;
        return copy;
      });

      return;
    }

    setState((prev) => {
      const copy = JSON_Stringify_Parse(prev);
      copy.urlInput.value = "";
      copy.urlInput.placeholder = placeholderError;
      copy.urlInput.error = true;
      return copy;
    });
  };

  const onInputChange = (e: InputEvent) => {
    // @ts-ignore
    const value = e.target.value as string;
    setState((prev) => {
      const copy = JSON_Stringify_Parse(prev);
      copy.urlInput.placeholder = "Paste URL...";
      copy.urlInput.value = value;
      copy.urlInput.error = false;
      return copy;
    });
  };

  const onSubmitBtnMouseEvents = (isMouseenter: boolean) => {
    if (state.urlInput.error) isMouseenter = false;
    if (state.submitBtn.hover === isMouseenter) return;

    setState((prev) => {
      const copy = JSON_Stringify_Parse(prev);
      copy.submitBtn.hover = isMouseenter;
      return copy;
    });
  };

  return (
    <div className="input-group">
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
        <form onSubmit={onSubmitForm} aria-label="Paste Image URL">
          <Input
            ref={inputRef}
            onInputChange={onInputChange}
            placeholder={state.urlInput.placeholder}
            value={state.urlInput.value}
            error={state.urlInput.error}
            submitBtnHover={state.submitBtn.hover}
          ></Input>
          <button
            onMouseEnter={() => onSubmitBtnMouseEvents(true)}
            onMouseLeave={() => onSubmitBtnMouseEvents(false)}
            className="detect-button"
            type="submit"
          >
            Detect
          </button>
        </form>
      </div>
      <style jsx>
        {`
          .input-group {
            position: sticky;
            top: 15px;
            left: 0;
            z-index: 83;
          }

          form {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .multifile-upload-group {
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

          .detect-button {
            border: none;
            padding: 10px 20px;
            color: #fff;
            position: relative;
            background: #000066;
            font-size: 1rem;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
          }

          .detect-button:hover {
            color: #ffffff;
            background: #000000;
          }

          .detect-button:focus {
            outline: none;
          }

          .detect-button.focus-visible {
            color: #ffffff;
            background: #000000;
            outline: 3px solid #000;
            outline-offset: 2px;
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
