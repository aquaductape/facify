// Finding Faces
// Compressing
// bg #30117d

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import SwappingSquares from "../../../components/Spinners/SwappingSquares";
import CircleCheck from "../../../components/svg/CircleCheck";
import CircleCross from "../../../components/svg/CircleCross";
import KebabMenu from "../../../components/svg/KebabMenu";
import LinkIcon from "../../../components/svg/LinkIcon";
import {
  loaderCountDownDisabledDuration,
  loaderErrorDuration,
  loaderSuccessDuration,
} from "../../../constants";
import onFocusOut, { OnFocusOutExit } from "../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../store/rootReducer";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";
import { reflow } from "../../../utils/reflow";
import { clearAllFormValues } from "../formSlice";
import { TImgStatus } from "../imageUrlSlice";
import DownloadMenu from "./DownloadMenu";

// cancel btn color #cbc3de

// Close Current Notification
//
// Close All Notifications
//
// Disable Notification Countdown

// Compressing
// Scanning
// Added
// Error

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
  close: boolean;
};

const Loader = ({ setOpenLoader }: TLoaderProps) => {
  const dispatch = useDispatch();
  const inputResult = useSelector((state: RootState) => state.form.inputResult);
  const countDownChecked = useSelector(
    (state: RootState) => state.menu.disableNotificationCountDown
  );
  // const currentImgStatus = useSelector(
  //   (state: RootState) => state.imageUrl.currentImgStatus
  // );
  // const currentAddedImg = useSelector(
  //   (state: RootState) => state.imageUrl.currentAddedImg
  // );

  const [currentAddedImg, setCurrentAddedImg] = useState<{
    id: string;
    name: string;
    errorMsg: string;
    error: boolean;
  } | null>(null);
  const [currentImgStatus, setCurrentImgStatus] = useState<TImgStatus>("EMPTY");
  const [showTitle, setShowTitle] = useState(true);
  const [queue, setQueue] = useState<TQueue[]>([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const optionsMenuElRef = useRef<HTMLDivElement | null>(null);
  const countDownBarElRef = useRef<HTMLDivElement | null>(null);
  const kebabMenuBtnElRef = useRef<HTMLButtonElement | null>(null);
  const onFocusOutExitRef = useRef<OnFocusOutExit | null>(null);
  const loadingDoneRef = useRef(false);
  const queueIdxRef = useRef(queueIdx);
  const queueRef = useRef<TQueue[]>([]);
  const openMenuRef = useRef(openMenu);
  const countDownActivityRef = useRef<{
    enabled: boolean;
    active: boolean;
    queuing: boolean;
    timeoutId: number;
    timestamp: number;
    duration: number;
  }>({
    enabled: !countDownChecked,
    active: false,
    queuing: false,
    timeoutId: 0,
    timestamp: 0,
    duration: loaderErrorDuration,
  });
  let currentResult = queue[queueIdx];

  openMenuRef.current = openMenu;

  // test
  useEffect(() => {
    const addItem = (idx: number, cb?: () => void) => {
      const resultItem = inputResult[idx];
      setCurrentAddedImg(() => {
        const item = {
          id: resultItem.id,
          name: resultItem.name,
          error: resultItem.error,
          errorMsg: resultItem.errorMsg,
        };

        return item;
      });

      if (resultItem.error) {
        setCurrentImgStatus("DONE");

        cb && cb();
        return;
      }

      //       if (idx === 1) {
      //         setCurrentImgStatus("COMPRESSING");
      //         setTimeout(() => {
      //           setCurrentAddedImg((prev) => {
      //             const copy = JSON_Stringify_Parse(prev)!;
      //             copy.error = true;
      //             copy.errorMsg = `Error 1003: Image doesn't exist`;
      //             return copy;
      //           });
      //           setCurrentImgStatus("DONE");
      //
      //           cb && cb();
      //         }, 1000);
      //         return;
      //       }

      setTimeout(() => {
        setCurrentImgStatus("COMPRESSING");
        setTimeout(() => {
          setCurrentImgStatus("SCANNING");

          setTimeout(() => {
            setCurrentImgStatus("DONE");
            cb && cb();
          }, 800);
        }, 800);
      }, 800);
    };

    addItem(0, () => {
      setTimeout(() => {
        addItem(1, () => {
          setTimeout(() => {
            addItem(2, () => {
              setTimeout(() => {
                addItem(3, () => {
                  // addItem(4);
                });
              }, 0);
            });
          }, 0);
        });
      }, 0);
    });
  }, []);

  const getCountDownDuration = (currentQueue: TQueue) => {
    const countDownActivity = countDownActivityRef.current;
    if (!countDownActivity.enabled) return loaderCountDownDisabledDuration;

    return currentQueue.error ? loaderErrorDuration : loaderSuccessDuration;
  };

  const runningQueue = () => {
    const countDownActivity = countDownActivityRef.current;
    const currentQueue = queueRef.current[queueIdxRef.current];
    // debugger;

    if (!currentQueue || queueIdxRef.current === inputResult.length - 1) {
      countDownActivity.queuing = false;

      queuingDone();

      return;
    }

    countDownActivity.duration = getCountDownDuration(currentQueue);

    countDownActivity.active = true;
    countDownActivity.queuing = true;

    window.clearTimeout(countDownActivity.timeoutId);
    countDownActivity.timestamp = Date.now();
    refreshCountDownBarDisplay();

    console.log("begin timeout");
    countDownActivity.timeoutId = window.setTimeout(() => {
      countDownActivity.active = false;
      nextQueue();
      const thisCurrentQueue = queueRef.current[queueIdxRef.current];
      console.log("end timeout", { thisCurrentQueue });
      countDownActivity.timestamp = Date.now();
      // debugger;

      if (thisCurrentQueue) {
        countDownActivity.duration = getCountDownDuration(thisCurrentQueue);
      }
      // if (currentQueue.name === "aubrey.jpg") debugger;
      refreshCountDownBarDisplay();
      // debugger;
      // because ref is updated, while state is not synced
      if (
        !thisCurrentQueue ||
        thisCurrentQueue.currentImgStatus !== "DONE" ||
        queueIdxRef.current === inputResult.length - 1
      ) {
        countDownActivity.queuing = false;

        queuingDone();
        return;
      }

      runningQueue();
    }, countDownActivity.duration);
  };

  const queuingDone = () => {
    const countDownActivity = countDownActivityRef.current;
    const currentQueue = queueRef.current[queueIdxRef.current];

    if (
      queueIdxRef.current !== inputResult.length - 1 ||
      currentQueue.currentImgStatus !== "DONE" ||
      openMenuRef.current
    ) {
      if (!countDownActivity.enabled) {
        loadingDoneRef.current = true;
      } else {
        setTimeout(() => {
          if (!loadingDoneRef || !loadingDoneRef.current) return;
          loadingDoneRef.current = true;
        }, countDownActivity.duration);
      }
      return;
    }

    setTimeout(() => {
      loadingDoneRef.current = true;
      if (openMenuRef.current) return;

      closeLoader();
    }, countDownActivity.duration);
  };

  /** is needed when success queues are displayed back to back, since the css classes won't change, the countdown bar will never be reset */
  const refreshCountDownBarDisplay = () => {
    const countDownActivity = countDownActivityRef.current!;
    if (!countDownActivity.enabled) {
      return;
    }

    const countDownBarEl = countDownBarElRef.current!;
    countDownBarEl.style.transform = "scale(1)";
    countDownBarEl.style.transition = "none";
    reflow();
    countDownBarEl.style.transform = "";
    countDownBarEl.style.transition = `background-color 500ms, transform ${countDownActivity.duration}ms linear`;
  };

  const nextQueue = () => {
    if (queueIdxRef.current !== queueRef.current.length - 1) {
      setQueueIdx((prev) => prev + 1);

      queueIdxRef.current = queueIdxRef.current + 1;
    }
  };

  useEffect(() => {
    if (!queue.length) return;
    // if (currentImgStatus === "DONE") debugger;
    const countDownActivity = countDownActivityRef.current;
    const copyQueue = [...queue];
    const foundIdx = copyQueue.findIndex(
      (item) => item.id === currentAddedImg!.id
    );
    const currentResult = copyQueue[foundIdx];
    const item = copyQueue[foundIdx];

    item.currentImgStatus = currentImgStatus;
    queueRef.current = copyQueue;

    setQueue(() => {
      return copyQueue;
    });

    if (foundIdx !== queueIdx) return;

    if (
      currentImgStatus === "DONE" &&
      currentResult.countdown &&
      queueIdx === queue.length - 1 &&
      !countDownActivity.queuing
    ) {
      // countDownActivity.active = true;
      console.log("starting running queue");
      countDownActivity.timestamp = Date.now();
      runningQueue();
    }
  }, [currentImgStatus]);

  const addedImgAlreadyHadError = () => {
    if (
      (currentImgStatus !== "DONE" &&
        !currentAddedImg!.error &&
        queueIdx !== queue.length - 1) ||
      countDownActivityRef.current.queuing
    ) {
      return;
    }

    console.log("add img error");
    runningQueue();
  };

  useEffect(() => {
    if (!currentAddedImg) return;

    setQueue((prev) => {
      const copy = JSON_Stringify_Parse(prev);

      const foundItem = copy.find(({ id }) => id === currentAddedImg.id);

      if (foundItem) {
        foundItem.error = currentAddedImg.error;
        foundItem.errorMsg = currentAddedImg.errorMsg;
        queueRef.current = copy;
        return copy;
      }

      copy.push({
        id: currentAddedImg.id,
        name: currentAddedImg.name,
        close: false,
        countdown: true,
        error: currentAddedImg.error,
        errorMsg: currentAddedImg.errorMsg,
        currentImgStatus: "EMPTY" as any,
      });

      return copy;
    });
  }, [currentAddedImg]);

  useEffect(() => {
    queueRef.current = queue;

    if (queue.length) {
      addedImgAlreadyHadError();
    }
  }, [queue]);

  useEffect(() => {
    if (countDownActivityRef.current.enabled) return;
    countDownBarElRef.current!.style.transform = "scaleX(0)";
    countDownBarElRef.current!.style.transition = "none";
  }, [countDownChecked]);

  if (!currentResult) currentResult = { name: "" } as any;

  const titleLoadingText =
    currentResult.currentImgStatus === "COMPRESSING" ||
    currentResult.currentImgStatus === "EMPTY"
      ? "Compressing"
      : "Scanning";

  const containerClass = () => {
    if (currentResult.error) return "error";
    if (currentResult.currentImgStatus === "DONE") return "success";
    return "";
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
        console.log({ loadingDoneRef });
        if (!loadingDoneRef.current) return;
        setTimeout(() => {
          closeLoader();
        }, 200);
      },
    });

    onFocusOutExitRef.current = exit;
  };

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
                    <div className="title-text">{titleLoadingText}</div>
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
                  <span className="link-icon">
                    <LinkIcon></LinkIcon>
                  </span>
                ) : null}
                <span className="image-name-content">{currentResult.name}</span>
              </div>
            </div>

            <div className="counter">
              {queueIdx + 1} / {inputResult.length}
            </div>
            <div ref={countDownBarElRef} className="countdown-bar"></div>
          </div>
          {/* <CSSTransition
            in={openMenu}
            classNames="slide"
            timeout={200}
            unmountOnExit
          >
            <DownloadMenu
              queueIdx={queueIdx}
              optionsMenuElRef={optionsMenuElRef}
              onFocusOutExitRef={onFocusOutExitRef}
              countDownActivityRef={countDownActivityRef}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              queue={queue}
              runningQueue={runningQueue}
              setQueue={setQueue}
            ></DownloadMenu>
          </CSSTransition> */}
        </div>
      </div>
      <style jsx>
        {`
          .container.slide-enter-active,
          .container.slide-exit-active {
            overflow: hidden;
          }
          .slide-enter .container-inner {
            transform: translateY(calc(-101%));
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
            z-index: 10;
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
            font-size: 14px;
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
