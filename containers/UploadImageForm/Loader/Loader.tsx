import { capitalize } from "lodash";
import { nanoid } from "nanoid";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import SwappingSquares from "../../../components/Spinners/SwappingSquares";
import CircleCheck from "../../../components/svg/CircleCheck";
import CircleCross from "../../../components/svg/CircleCross";
import KebabMenu from "../../../components/svg/KebabMenu";
import { default as LinkIcon } from "../../../components/svg/Link";
import { CONSTANTS } from "../../../constants";
import onFocusOut, { OnFocusOutExit } from "../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../store/rootReducer";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";
import { reflow } from "../../../utils/reflow";
import { clearAllFormValues, TURLItem } from "../formSlice";
import { setImgQueue, TImgStatus, updateImgQueue } from "../imageUrlSlice";
import DownloadMenu from "./DownloadMenu";
import { TDownloadMenuItemHandler } from "./DownloadMenuItem";
import {
  updateDownloadMenuItemDisplayCountDown,
  updateDownloadMenuItemQueue,
} from "./utils/updateDownloadMenu";

type TLoaderProps = {
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
};

export type TQueue = {
  id: string;
  name: string;
  currentImgStatus: TImgStatus;
  error: boolean;
  errorMsg: string;
  countdown: boolean;
  countdownActive: boolean;
};

const Loader = ({ setOpenLoader }: TLoaderProps) => {
  const dispatch = useDispatch();
  const countDownChecked = useSelector(
    (state: RootState) => state.menu.disableNotificationCountDown
  );

  const currentImgStatus = useSelector(
    (state: RootState) => state.imageUrl.currentImgStatus
  );

  // const [currentImgStatus, setCurrentImgStatus] = useState<TImgStatus>("EMPTY");
  const downloadQueue = useSelector(
    (state: RootState) => state.imageUrl.imgQueue
  );
  const [finishedQueueIdx, setFinishedQueueIdx] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const initRef = useRef(true);
  const downloadQueueRef = useRef<TQueue[]>(downloadQueue);
  const optionsMenuElRef = useRef<HTMLDivElement | null>(null);
  const countDownBarElRef = useRef<HTMLDivElement | null>(null);
  const kebabMenuBtnElRef = useRef<HTMLButtonElement | null>(null);
  const onFocusOutExitRef = useRef<OnFocusOutExit | null>(null);
  const goToNextRef = useRef<
    (props?: { clearCurrentTimout?: boolean | undefined }) => void
  >();
  const loadingDoneRef = useRef(false);
  const loadingDoneTimeIdRef = useRef(0);
  const openMenuRef = useRef(openMenu);
  const countDownActivityRef = useRef<{
    currentImgId: string;
    enabled: boolean;
    active: boolean;
    queuing: boolean;
    timeoutId: number;
    timestamp: number;
    duration: number;
  }>({
    currentImgId: "",
    enabled: !countDownChecked,
    active: false,
    queuing: false,
    timeoutId: 0,
    timestamp: 0,
    duration: CONSTANTS.loaderErrorDuration,
  });
  const downloadMenuItemHandlerRef = useRef<TDownloadMenuItemHandler>({});
  downloadQueueRef.current = downloadQueue;
  const isLast = finishedQueueIdx === downloadQueue.length - 1;
  const currentResult = downloadQueue[finishedQueueIdx]
    ? downloadQueue[finishedQueueIdx]
    : ({} as TQueue);

  openMenuRef.current = openMenu;

  // test
  //   useEffect(() => {
  //     const addItem = (idx: number, cb?: () => void) => {
  //
  //       if (idx === 1 || idx === 2) {
  //
  //         setTimeout(() => {
  //           cb && cb();
  //         }, 0);
  //         return;
  //       }
  //
  //       setTimeout(() => {
  //         setCurrentImgStatus("COMPRESSING");
  //         setTimeout(() => {
  //           setCurrentImgStatus("SCANNING");
  //
  //           setTimeout(() => {
  //             console.log("DONE");
  //
  //             setCurrentImgStatus("DONE");
  //             cb && cb();
  //           }, 3000);
  //         }, 3000);
  //       }, 0);
  //     };
  //
  //     addItem(0, () => {
  //       setTimeout(() => {
  //         addItem(1, () => {
  //           setTimeout(() => {
  //             addItem(2, () => {
  //               setTimeout(() => {
  //                 addItem(3, () => {
  //                   setTimeout(() => {
  //                     addItem(4);
  //                   }, 0);
  //                 });
  //               }, 0);
  //             });
  //           }, 0);
  //         });
  //       }, 0);
  //     });
  //   }, []);

  const closeLoaderWhenDone = ({ fireNow }: { fireNow?: boolean } = {}) => {
    const countDownActivity = countDownActivityRef.current;

    const onTimeout = () => {
      loadingDoneRef.current = true;
      if (openMenuRef.current) return;

      closeLoader();
    };

    window.clearTimeout(loadingDoneTimeIdRef.current);

    if (!isLast) return;

    if (fireNow) {
      onTimeout();
    }

    loadingDoneTimeIdRef.current = window.setTimeout(
      onTimeout,
      countDownActivity.duration
    );
  };

  const containerClass = () => {
    if (currentResult.error) return "error";
    if (currentResult.currentImgStatus === "DONE") return "success";
    return "";
  };

  const titleLoadingText = () => {
    if (currentResult.currentImgStatus === "EMPTY") return "Reading";
    return capitalize(currentResult.currentImgStatus);
  };

  const closeLoader = () => {
    dispatch(clearAllFormValues());
    setOpenLoader(false);
  };

  const onClickOpenMenu = () => {
    if (openMenu || loadingDoneRef.current) {
      return;
    }

    const exit = onFocusOut({
      button: kebabMenuBtnElRef.current!,
      allow: [() => optionsMenuElRef.current!],
      run: () => setOpenMenu(true),
      onExit: () => {
        setOpenMenu(false);
        if (!loadingDoneRef.current) return;
        setTimeout(() => {
          closeLoader();
        }, 200);
      },
    });

    onFocusOutExitRef.current = exit;
  };

  const onClickJumpToLink = () => {
    if (isLast) {
      closeLoaderWhenDone({ fireNow: true });
    }

    goToNext({ clearCurrentTimout: true });
  };

  const stopRunningCountDownBar = () => {
    countDownBarElRef.current!.style.transition = "none";
  };

  /** is needed when success queues are displayed back to back, since the css classes won't change, the countdown bar will never be reset */
  const refreshCountDownBarDisplay = () => {
    const countDownActivity = countDownActivityRef.current!;
    if (!countDownActivity.enabled) {
      return;
    }

    console.log("REFRESH!!");

    const countDownBarEl = countDownBarElRef.current!;
    countDownBarEl.style.transform = "scale(1)";
    countDownBarEl.style.transition = "none";
    reflow();
    countDownBarEl.style.transform = "";
    countDownBarEl.style.transition = `background-color 500ms, transform ${countDownActivity.duration}ms linear`;
  };

  const getCountDownDuration = (currentQueue: TQueue) => {
    const countDownActivity = countDownActivityRef.current;
    if (!countDownActivity.enabled)
      return CONSTANTS.loaderCountDownDisabledDuration;

    return currentQueue.error
      ? CONSTANTS.loaderErrorDuration
      : CONSTANTS.loaderSuccessDuration;
  };

  const goToNext = ({
    clearCurrentTimout,
    enableCountDown,
  }: { clearCurrentTimout?: boolean; enableCountDown?: boolean } = {}) => {
    const countDownActivity = countDownActivityRef.current;
    const downloadQueue = downloadQueueRef.current;
    const current = downloadQueue[finishedQueueIdx];

    const startCountDown = ({ nextImgId }: { nextImgId?: boolean } = {}) => {
      // console.log({ current });
      countDownActivity.enabled =
        enableCountDown == null ? countDownActivity.enabled : enableCountDown;

      if (nextImgId != null) {
        countDownActivity.currentImgId = isLast
          ? current.id
          : downloadQueue[finishedQueueIdx + 1].id;
      } else {
        countDownActivity.currentImgId = current.id;
      }
      countDownActivity.active = true;
      countDownActivity.timestamp = Date.now();
      countDownActivity.duration = getCountDownDuration(current);
      updateDownloadMenuItemDisplayCountDown(
        { active: true, enabled: enableCountDown },
        { downloadMenuItemHandlerRef, idx: finishedQueueIdx }
      );
      refreshCountDownBarDisplay();
    };

    const onTimeout = () => {
      // console.log("timeout!!!!");
      setFinishedQueueIdx((prev) => prev + 1);

      updateDownloadMenuItemDisplayCountDown(
        { active: false, enabled: enableCountDown },
        { downloadMenuItemHandlerRef, idx: finishedQueueIdx }
      );
    };

    if (loadingDoneRef.current) return;

    if (clearCurrentTimout) {
      startCountDown({ nextImgId: true });
      window.clearTimeout(countDownActivity.timeoutId);
      stopRunningCountDownBar();
      updateDownloadMenuItemDisplayCountDown(
        { active: false, enabled: enableCountDown },
        { downloadMenuItemHandlerRef, idx: finishedQueueIdx }
      );
      if (isLast) {
        closeLoaderWhenDone({ fireNow: true });
        return;
      }
      onTimeout(); // runs immediately
      return;
    }

    if (isLast && !countDownActivity.active) {
      console.log("isLast");
      startCountDown();
      closeLoaderWhenDone();
      return;
    }

    // console.log({ finishedQueueIdx });
    if (!current || current.currentImgStatus !== "DONE") return;
    if (countDownActivity.active) return;

    startCountDown();

    countDownActivity.timeoutId = window.setTimeout(
      onTimeout,
      countDownActivity.duration
    );
  };
  goToNextRef.current = goToNext;

  useEffect(() => {
    const foundIdx = downloadQueueRef.current.findIndex(
      (item) => item.currentImgStatus !== "DONE"
    )!;

    let countdownActive = false;

    if (foundIdx === -1) {
      return;
    }

    updateDownloadMenuItemQueue(
      { currentImgStatus },
      { downloadMenuItemHandlerRef, idx: foundIdx }
    );

    if (currentImgStatus === "DONE") {
      countdownActive = true;
    }

    dispatch(
      updateImgQueue({
        id: downloadQueue[foundIdx].id,
        props: { countdownActive, currentImgStatus },
      })
    );
  }, [currentImgStatus]);

  useEffect(() => {
    if (initRef.current) {
      initRef.current = false;
      return;
    }
    // downloadQueue
    countDownActivityRef.current.active = false;
    goToNext();
  }, [finishedQueueIdx]);

  // useEffect(() => {
  //   if (isLast && currentImgStatus === "DONE" && downloadQueue.length !== 1) {
  //     console.log("DOONE");
  //     closeLoaderWhenDone();
  //   }
  // }, [finishedQueueIdx, currentImgStatus]);

  useEffect(() => {
    if (initRef.current) {
      initRef.current = false;
      return;
    }

    const currentItem = downloadQueueRef.current[finishedQueueIdx];

    if (!currentItem || currentItem.currentImgStatus !== "DONE") {
      return;
    }

    if (countDownActivityRef.current.active) return;
    console.log("go next");

    goToNext();
  }, [finishedQueueIdx, downloadQueue]);

  return (
    <div className="container">
      <div className="container-inner">
        <div className={`inner ${containerClass()}`}>
          <button
            className={`kebab-menu ${openMenu ? "active" : ""}`}
            onClick={onClickOpenMenu}
            aria-label="open download images menu"
            aria-expanded={openMenu ? "true" : "false"}
            ref={kebabMenuBtnElRef}
          >
            <KebabMenu></KebabMenu>
          </button>
          <div className="notification">
            <div className="message">
              <div className="title">
                {currentResult.error ? (
                  <>
                    <div className="title-text">Error</div>
                    <div className="icon-holder">
                      <CircleCross></CircleCross>
                    </div>
                  </>
                ) : currentResult.currentImgStatus === "EMPTY" ||
                  currentResult.currentImgStatus === "COMPRESSING" ||
                  currentResult.currentImgStatus === "SCANNING" ? (
                  <>
                    <div className="title-text">{titleLoadingText()}</div>
                    <div className="icon-holder">
                      <SwappingSquares></SwappingSquares>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="title-text">Added</div>
                    <div className="icon-holder">
                      <CircleCheck></CircleCheck>
                    </div>
                  </>
                )}
              </div>
              <div className="image-name">
                {currentResult.currentImgStatus === "DONE" &&
                !currentResult.error ? (
                  <button
                    className="image-name__link"
                    onClick={onClickJumpToLink}
                  >
                    <span className="link-icon">
                      <LinkIcon></LinkIcon>
                    </span>

                    <span className="image-name-content">
                      {currentResult.name}
                    </span>
                  </button>
                ) : (
                  <span className="image-name-content">
                    {currentResult.name}
                  </span>
                )}
              </div>
            </div>

            <div className="counter">
              {finishedQueueIdx + 1} / {downloadQueue.length}
            </div>
            <div ref={countDownBarElRef} className="countdown-bar"></div>
          </div>
          <CSSTransition
            in={openMenu}
            classNames="slide"
            timeout={200}
            unmountOnExit
          >
            <DownloadMenu
              optionsMenuElRef={optionsMenuElRef}
              onFocusOutExitRef={onFocusOutExitRef}
              countDownActivityRef={countDownActivityRef}
              queue={downloadQueue}
              queueIdx={finishedQueueIdx}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              goToNextRef={goToNextRef as any}
              downloadMenuItemHandlerRef={downloadMenuItemHandlerRef}
            ></DownloadMenu>
          </CSSTransition>
        </div>
      </div>
      <style jsx>
        {`
          .container.slide-enter-active,
          .container.slide-exit-active {
            overflow: hidden;
          }
          .slide-enter .container-inner {
            transform: translateY(-101%);
          }

          .slide-enter-active .container-inner {
            transform: translateY(0);
            transition: transform 200ms;
          }

          .slide-exit .container-inner {
            transform: translateY(0);
          }

          .slide-exit-active .container-inner {
            transform: translateY(calc(-101%));
            transition: transform 200ms;
          }

          .container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20;
          }
          .container-inner {
            height: 100%;
          }

          .inner {
            position: relative;
            display: flex;
            height: 100%;
            background: #30117d;
            color: #fff;
            transition: background-color 500ms, color 500ms;
          }

          .kebab-menu {
            position: relative;
            background: #30117d;
            color: inherit;
            flex-shrink: 0;
            width: 35px;
            height: 100%;
            padding: 10px 0;
            outline: 0;
            transition: background-color 500ms, color 500ms;
          }

          .kebab-menu[data-focus-visible-added] {
            outline: 3px solid #000;
            outline-offset: 2px;
          }

          .kebab-menu::after {
            position: absolute;
            top: 0;
            right: 0;
            content: "";
            width: 2px;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            transition: background-color 500ms;
          }

          .kebab-menu.active,
          .kebab-menu:hover {
            background: #000;
          }

          .kebab-menu.active::after {
            background: transparent !important;
          }

          .message {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
            height: 100%;
            margin-left: auto;
          }

          .icon-holder {
            transform: scale(0.4);
          }

          .image-name {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            height: 20px;
            font-size: 14px;
          }

          .image-name__link {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 0;
            margin: 0;
            background: transparent;
            border: 0;
            color: inherit;
          }

          .image-name__link:hover {
            text-decoration: underline;
          }

          .notification {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }

          .title {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 27px;
            margin-bottom: -4px;
          }

          .title-text {
            font-weight: bold;
            margin-right: 5px;
          }

          .counter {
            flex-shrink: 0;
            font-size: 15px;
            margin-left: auto;
            margin-right: 5px;
          }

          .countdown-bar {
            position: absolute;
             {
              /* subpixel problem in chromium edge */
            }
            bottom: -0.1px;
            left: 0;
            width: 100%;
            height: 4px;
            background: inherit;
            pointer-events: none;
            transform-origin: left;
            z-index: 10;
          }

          .image-name-content {
            max-width: 150px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .link-icon {
            flex-shrink: 0;
            width: 15px;
            margin-right: 5px;
          }

          .inner.success {
            background: #46ea8d;
            color: #000;
          }

          .inner.success .countdown-bar {
            background: #00875c;
          }

          .inner.success .icon-holder {
            position: relative;
            top: -2px;
            color: #00875c;
            transform: scale(1);
            height: 18px;
            width: 18px;
          }

          .inner.success .title-text {
            color: #025339;
          }

          .inner.success .kebab-menu {
            background: #46ea8d;
            color: rgba(0, 0, 0, 0.75);
          }

          .inner.success .kebab-menu.active,
          .inner.success .kebab-menu:hover {
            background: #004e53;
            color: #46ea8d;
          }

          .inner.success .kebab-menu::after {
            background: rgba(0, 0, 0, 0.5);
          }

          .inner.error {
            background: #fcb7b7;
            color: #000;
          }

          .inner.error .countdown-bar {
            background: #d20000;
          }

          .inner.error .icon-holder {
            position: relative;
            top: -2px;
            color: #d20000;
            transform: scale(1);
            height: 18px;
            width: 18px;
          }

          .inner.error .title-text {
            color: rgba(0, 0, 0, 0.75);
          }

          .inner.error .kebab-menu {
            background: #fcb7b7;
            color: rgba(0, 0, 0, 0.75);
          }

          .inner.error .kebab-menu.active {
            background: #7a003e;
            color: #fcb7b7;
          }

          .kebab-menu:hover::after {
            background: transparent !important;
          }

          @media (min-width: 320px) {
            .counter {
              margin-right: 10px;
            }
            .image-name-content {
              max-width: 170px;
            }
          }

          @media (min-width: 350px) {
            .counter {
              font-size: 16px;
            }

            .image-name-content {
              max-width: 195px;
            }
          }

          @media (min-width: 375px) {
            .image-name-content {
              max-width: 210px;
            }
          }

          @media (min-width: 500px) {
            .image-name-content {
              max-width: 300px;
            }
          }

          @media (min-width: 800px) {
            .image-name-content {
              max-width: 500px;
            }
          }
          @media (min-width: 1300px) {
            .image-name-content {
              max-width: 1000px;
            }
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .inner.success .countdown-bar,
          .inner.error .countdown-bar {
            transform: scaleX(0);
            transition: background-color 500ms,
              transform
                ${countDownActivityRef.current.enabled
                  ? countDownActivityRef.current.duration
                  : 0}ms
                linear;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;