import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import FormTextInput from "./FormTextInput/FormTextInput";
import Loader from "./Loader/Loader";

const placeholderError = "URL Required*";

const UploadImageForm = () => {
  const [openLoader, setOpenLoader] = useState(false);
  const [hideFormGroup, setHideFormGroup] = useState(false);

  //

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

  //   const onImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  //     try {
  //       const files = e.target.files;
  //       if (!files) return;
  //       if (files!.length > 10) {
  //         // throw notification error: "cannot upload more than 10 images"
  //         return;
  //       }
  //       const file = files![0] as File;
  //       const { base64, file: newFile } = await convertFileToBase64(file);
  //       const result = await postClarifaiAPI({ base64 });
  //       const objectUrl = window.URL.createObjectURL(newFile);
  //       const img = await getImageDimensions(objectUrl);
  //       const data = (result.data as unknown) as TDemographicNode[];
  //
  //       await uploadAndAnimate({
  //         id: nanoid(),
  //         croppedUrl: base64,
  //         url: objectUrl,
  //         data,
  //         img,
  //         name: file.name,
  //       });
  //
  //       setShowLoader(false);
  //     } catch (err) {
  //       // batch(() => {
  //       //   dispatch(setImageStatus("DONE"));
  //       //   dispatch(setImageError("Server Error"));
  //       // });
  //     }
  //   };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setOpenLoader(true);
  //   }, 1000);
  // }, []);

  useEffect(() => {
    if (openLoader) {
      setTimeout(() => {
        setHideFormGroup(true);
      }, 200);
    } else {
      setHideFormGroup(false);
    }
  }, [openLoader]);

  return (
    <div id="main-bar-input" className="input-group">
      <div
        className={`multifile-upload-group ${hideFormGroup ? "active" : ""}`}
      >
        {/* <BrowserView>
						</BrowserView> */}
        <button id="webcam-button" className="input-button--webcam">
          WebCam
        </button>
        <div className="shared-pillar pillar-1"></div>
        <input
          // onChange={onImageUpload}
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
        <FormTextInput setOpenLoader={setOpenLoader}></FormTextInput>
      </div>
      <CSSTransition
        in={openLoader}
        classNames="slide"
        timeout={200}
        unmountOnExit
      >
        <Loader setOpenLoader={setOpenLoader}></Loader>
      </CSSTransition>
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

          .multifile-upload-group.active {
            visibility: hidden;
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
