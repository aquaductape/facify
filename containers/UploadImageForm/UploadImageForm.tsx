import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import TextInput from "./TextInput/TextInput";
import Loader from "./Loader/Loader";
// const Loader = dynamic(() => import("./Loader/Loader"), { ssr: false });
import FileInput from "./FileInput/FileInput";
// import { nanoid } from "nanoid";
// import { imageUri, imageUri3, imgUri2 } from "../../dummyData/imageUri";
// import {
//   demographicResult3,
//   demographicsResult,
//   demographResult2,
// } from "../../dummyData/demographicsResult";
// import { JSON_Stringify_Parse } from "../../utils/jsonStringifyParse";
// import dataURLtoFile from "../../utils/dataURLtoFile";
// import {
//   addDemographicsParentAndChildren,
//   TDemographicNode,
// } from "../FaceDetectionResult/ImageResult/demographicsSlice";
// import createCroppedImgUrl from "../FaceDetectionResult/BoundingCroppedImage/createCroppedImgUrl";
import { batch, useDispatch, useSelector } from "react-redux";
import WebcamBtn from "./Webcam/WebcamBtn";
import { RootState } from "../../store/rootReducer";
// import { setImageLoaded, setImageStatus } from "./imageUrlSlice";
// import { addImage } from "../FaceDetectionResult/InfoResult/Table/imageHeightSlice";
// import { animationEnd } from "./animateUpload";

const UploadImageForm = () => {
  const openLoader = useSelector((state: RootState) => state.loader.open);
  const [hideFormGroup, setHideFormGroup] = useState(false);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const shadowElRef = useRef<HTMLDivElement | null>(null);
  // const dispatch = useDispatch();

  //

  //   useEffect(() => {
  //     const run = async () => {
  //       // const id = nanoid();
  //
  //       const items = [
  //         {
  //           _id: nanoid(),
  //           imageUri: imageUri3,
  //           data: demographicResult3,
  //           name: "2021768",
  //         },
  //         {
  //           _id: nanoid(),
  //           imageUri: imgUri2,
  //           data: JSON_Stringify_Parse(demographResult2),
  //           name: "da-feasters",
  //         },
  //         {
  //           _id: nanoid(),
  //           imageUri: imageUri,
  //           data: demographicsResult,
  //           name: "GettyImages-1147443912",
  //         },
  //         // {
  //         //   _id: nanoid(),
  //         //   imageUri: imgUri2,
  //         //   data: {
  //         //     data: JSON_Stringify_Parse(demographResult2).data.map((item) => ({
  //         //       ...item,
  //         //       id: item.id + "2",
  //         //     })),
  //         //   },
  //         //   name: "da-feasters",
  //         // },
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
  //
  //       animationEnd();
  //     };
  //
  //     setTimeout(() => {
  //       run();
  //     }, 500);
  //   }, []);

  // testing
  // useEffect(() => {
  //   setTimeout(() => {
  //     setOpenLoader(true);
  //   }, 1000);
  // }, []);

  const createIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;

        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }

        shadowElRef.current!.style.opacity = isVisible ? "0" : "1";
      });
    });

    return observer;
  };

  useEffect(() => {
    if (openLoader) {
      setTimeout(() => {
        setHideFormGroup(true);
      }, 200);
    } else {
      setHideFormGroup(false);
    }
  }, [openLoader]);

  useEffect(() => {
    const observer = createIntersectionObserver();

    observer.observe(sentinelElRef.current!);
  }, []);

  return (
    <div id="main-bar-input" className="input-group">
      <div className="sentinel" ref={sentinelElRef}></div>
      <div
        className={`multifile-upload-group ${hideFormGroup ? "active" : ""}`}
      >
        <div className="shadow" ref={shadowElRef}></div>
        <WebcamBtn></WebcamBtn>
        <div className="shared-pillar pillar-1"></div>
        <FileInput></FileInput>
        <div className="shared-pillar pillar-2"></div>
        <TextInput></TextInput>
      </div>
      <CSSTransition
        in={openLoader}
        classNames="slide"
        timeout={200}
        unmountOnExit
      >
        <Loader></Loader>
      </CSSTransition>
      <style jsx>
        {`
          .input-group {
            position: sticky;
            top: 15px;
            left: 0;
            z-index: 83;
          }

          .sentinel {
            position: absolute;
            top: -18px;
            left: 0;
            height: 0px;
            width: 100%;
          }

          .shadow {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 5px;
            transform: scaleX(0.92);
            opacity: 0;
            box-shadow: 0px 4px 5px 0px #1024662e;
            transition: opacity 250ms;
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

          .shared-pillar {
            background: #c6c6c6;
          }

          .pillar-1 {
            display: none;
          }

           {
            /* 850px */
          }
          @media (min-width: 850px) {
            .shadow {
              transform: scaleX(0.95);
            }

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
