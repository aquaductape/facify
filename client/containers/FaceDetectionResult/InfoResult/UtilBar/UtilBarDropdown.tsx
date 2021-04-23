import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import KebabMenu from "../../../../components/svg/KebabMenu";
import TransitionSlide from "../../../../components/TransitionSlide";
import { useMatchMedia } from "../../../../hooks/useMatchMedia";
import onFocusOut, {
  OnFocusOutExit,
} from "../../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../../store/rootReducer";
import store from "../../../../store/store";
import isElObscured from "../../../../utils/isElObscured";
import smoothScrollTo from "../../../../utils/smoothScrollTo";
import { setClassifyDisplay } from "../Classify/classifySlice";
import { selectImageHeight } from "../Table/imageHeightSlice";
import UtilBar from "./UtilBar";

type TUtilBarDropdown = {
  id: string;
  parentIdx: number;
};

const UtilBarDropdown = ({ id, parentIdx }: TUtilBarDropdown) => {
  const dispatch = useDispatch();
  const imageHeight = useSelector(selectImageHeight({ id }));
  const triggerRefresh = useSelector(
    (state: RootState) => state.imageHeight.triggerRefresh
  );
  const btnSentinelElRef = useRef<HTMLDivElement | null>(null);
  const btnContainerElRef = useRef<HTMLDivElement | null>(null);
  const popUpContainerElRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onFocusOutRef = useRef<OnFocusOutExit | null>(null);
  // const isBtnVisibleRef
  const [openUtilBar, setOpenUtilBar] = useState(false);
  const inputHeight = 45;
  const topPadding = 15;
  const theadHeight = 38;

  const mqlRef = useMatchMedia();

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const el = e.currentTarget;

    if (openUtilBar) {
      console.log("run");
      // onFocusOutRef.current?.runExit();
      return;
    }

    //     const { obscured, targetBCR, targetFromPointBCR } = isElObscured(el);
    //
    //     if (obscured) {
    //       // TODO: works if targetFromPoint is main image, which is fine for mobile/mouse users. But for keyboard interaction, if button is too far up (150px or more) then this doesn't work
    //       const distance = targetFromPointBCR.bottom - targetBCR.top;
    //       const destination = window.scrollY - distance - theadHeight;
    //       console.log({ targetBCR, targetFromPointBCR });
    //
    //       smoothScrollTo({
    //         destination,
    //         currentPosition: window.scrollY,
    //         duration: 100,
    //         onEnd: () => {
    //           createIntersectionObserver();
    //           const exit = onFocusOut({
    //             button: el!,
    //             run: () => {
    //               setOpenUtilBar(true);
    //               popUpContainerElRef.current?.focus();
    //             },
    //             allow: [() => popUpContainerElRef.current!],
    //             onExit: () => {
    //               setOpenUtilBar(false);
    //               observerRef.current!.disconnect();
    //               observerRef.current = null;
    //             },
    //           });
    //
    //           onFocusOutRef.current = exit;
    //         },
    //       });
    //       return;
    //     }

    // if (!openUtilBar) createIntersectionObserver();
    const exit = onFocusOut({
      button: el!,
      run: () => {
        setOpenUtilBar(true);
        popUpContainerElRef.current?.focus();
      },
      allow: [() => popUpContainerElRef.current!, ".classify-section"],
      onExit: () => {
        const isClassifyOpen = store.getState().classify.open;

        if (isClassifyOpen) {
          dispatch(setClassifyDisplay({ open: false }));

          setTimeout(() => {
            setOpenUtilBar(false);
          }, 200);
          return;
        }
        setOpenUtilBar(false);
        // observerRef.current!.disconnect();
        // observerRef.current = null;
      },
    });

    onFocusOutRef.current = exit;
  };

  const createIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;

        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }

        console.log({ isVisible });

        if (isVisible) return;

        onFocusOutRef.current?.runExit();
        observer.disconnect();
        observerRef.current = null;
      });
    });

    observer.observe(btnSentinelElRef.current!);

    observerRef.current = observer;
  };

  useEffect(() => {
    if (imageHeight == null || mqlRef.current?.minWidth_1300.matches) return;

    const position = imageHeight + inputHeight + topPadding;

    btnContainerElRef.current!.style.top = `${position}px`;
    popUpContainerElRef.current!.style.top = `${position}px`;
    btnSentinelElRef.current!.style.top = `-${position}px`;
  }, [imageHeight, triggerRefresh]);

  return (
    <>
      <div className="pop-up-container" ref={popUpContainerElRef} tabIndex={-1}>
        <div className="inner">
          <TransitionSlide
            in={openUtilBar}
            slideTo={"up"}
            positionAbsolute={false}
          >
            <UtilBar id={id} parentIdx={parentIdx}></UtilBar>
          </TransitionSlide>
        </div>
      </div>
      <div
        className={`btn-container ${openUtilBar ? "active" : ""}`}
        ref={btnContainerElRef}
      >
        <div className="btn-sentinel" ref={btnSentinelElRef}></div>
        <div className="bg-hider"></div>
        <button className="btn-options" onClick={onClick}>
          <KebabMenu></KebabMenu>
        </button>
      </div>
      <style jsx>
        {`
          .bg-hider {
            position: absolute;
            top: 1px;
            right: 25px;
            width: 25px;
            height: 38px;
            background: linear-gradient(
              270deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0) 100%
            );
          }
          .btn-container {
            position: sticky;
            top: 0;
            left: 0;
            height: 0;
            margin-bottom: 125px;
            z-index: 30;
          }

          .pop-up-container {
            position: sticky;
            top: 0;
            left: 0;
            height: 0;
            margin-bottom: 125px;
            z-index: 60;
          }

          .inner {
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            z-index: 1;
          }

          .btn-options {
            position: absolute;
            top: 0;
            right: 0;
            width: 25px;
            height: 38px;
            border-top: 1px solid #d5d5d5;
            padding: 8px 0px;
            background: #fff;
            color: #000;
            outline: none;
            transition: background-color 250ms, color 250ms;
          }

          .btn-options.focus-visible {
            outline: 3px solid #000;
            outline-offset: 3px;
          }

          .btn-sentinel {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 0px;
          }

          .btn-container.active .btn-options {
            background: #000;
            color: #fff;
          }

          @media not all and (pointer: coarse) {
            .btn-options:hover {
              background: #ccc;
            }

            .btn-container.active:hover .btn-options {
              background: #333;
            }
          }
        `}
      </style>
    </>
  );
};

export default UtilBarDropdown;
