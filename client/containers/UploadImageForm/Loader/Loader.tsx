// Finding Faces
// Compressing
// bg #30117d

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import SwappingSquares from "../../../components/Spinners/SwappingSquares";
import CircleCheck from "../../../components/svg/CircleCheck";
import CircleCross from "../../../components/svg/CircleCross";
import KebabMenu from "../../../components/svg/KebabMenu";
import LinkIcon from "../../../components/svg/LinkIcon";
import { loaderErrorDuration, loaderSuccessDuration } from "../../../constants";
import onFocusOut, { OnFocusOutExit } from "../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../store/rootReducer";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";
import { reflow } from "../../../utils/reflow";
import OptionsMenu from "./OptionsMenu";

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
type TImgStatus = "EMPTY" | "DONE" | "COMPRESSING" | "SCANNING";

type TLoaderProps = {};
export type TQueue = {
  id: string;
  name: string;
  currentImgStatus: TImgStatus;
  error: boolean;
  countdown: boolean;
  close: boolean;
};
const Loader = () => {
  const inputResult = useSelector((state: RootState) => state.form.inputResult);
  // const currentAddedImg = useSelector(
  //   (state: RootState) => state.imageUrl.currentAddedImg
  // );
  // const currentImgStatus = useSelector(
  //   (state: RootState) => state.imageUrl.currentImgStatus
  // );
  const [currentAddedImg, setCurrentAddedImg] = useState<{
    id: string;
    name: string;
    error: boolean;
  } | null>(null);
  const [currentImgStatus, setCurrentImgStatus] = useState<
    "EMPTY" | "DONE" | "COMPRESSING" | "SCANNING"
  >("EMPTY");
  const [showTitle, setShowTitle] = useState(true);
  const [queue, setQueue] = useState<TQueue[]>([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const optionsMenuElRef = useRef<HTMLDivElement | null>(null);
  const countDownBarElRef = useRef<HTMLDivElement | null>(null);
  const kebabMenuBtnElRef = useRef<HTMLButtonElement | null>(null);
  const onFocusOutExitRef = useRef<OnFocusOutExit | null>(null);
  const queueIdxRef = useRef(queueIdx);
  const queueRef = useRef<TQueue[]>([]);
  const countDownActivityRef = useRef<{
    countDownEnabled: boolean;
    active: boolean;
    queuing: boolean;
    timeoutId: number;
    timestamp: number;
    duration: number;
  }>({
    countDownEnabled: true,
    active: false,
    queuing: false,
    timeoutId: 0,
    timestamp: 0,
    duration: loaderErrorDuration,
  });
  const currentResult = queue[queueIdx];

  // test
  useEffect(() => {
    const addItem = (idx: number, cb?: () => void) => {
      setCurrentAddedImg(() => {
        const resultItem = inputResult[idx];
        const item = {
          id: resultItem.id,
          name: resultItem.name,
          error: false,
        };

        return item;
      });

      if (idx === 1) {
        setCurrentImgStatus("COMPRESSING");
        setTimeout(() => {
          setCurrentAddedImg((prev) => {
            const copy = JSON_Stringify_Parse(prev)!;
            copy.error = true;
            return copy;
          });
          setCurrentImgStatus("DONE");

          console.log("error");
          cb && cb();
        }, 1000);
        return;
      }

      console.log("run");
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
            addItem(2);
          }, 0);
        });
      }, 0);
    });
  }, []);

  const runningQueue = () => {
    const countDownActivity = countDownActivityRef.current;
    const currentQueue = queueRef.current[queueIdxRef.current];

    if (!currentQueue || queueIdxRef.current === inputResult.length - 1) {
      countDownActivity.queuing = false;
      return;
    }

    countDownActivity.duration = currentQueue.error
      ? loaderErrorDuration
      : loaderSuccessDuration;
    console.log(currentQueue, countDownActivity.duration);
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

      if (thisCurrentQueue) {
        countDownActivity.duration = thisCurrentQueue.error
          ? loaderErrorDuration
          : loaderSuccessDuration;
      }
      console.log(
        queueRef.current[queueIdxRef.current],
        countDownActivity.duration
      );
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
        loadingDone();
        // have func for isLast
        return;
      }
      // have this with own func
      runningQueue();
    }, countDownActivity.duration);
  };

  const loadingDone = () => {
    if (queueIdxRef.current !== inputResult.length - 1) return;
  };

  /** is needed when success queues are displayed back to back, since the css classes won't change, the countdown bar will never be reset */
  const refreshCountDownBarDisplay = () => {
    const countDownBarEl = countDownBarElRef.current!;
    countDownBarEl.style.transform = "scale(1)";
    countDownBarEl.style.transition = "none";
    reflow();
    countDownBarEl.style.transform = "";
    countDownBarEl.style.transition = `background-color 500ms, transform ${countDownActivityRef.current.duration}ms linear`;
  };

  const nextQueue = () => {
    if (queueIdxRef.current !== queueRef.current.length - 1) {
      setQueueIdx((prev) => prev + 1);

      queueIdxRef.current = queueIdxRef.current + 1;
    }
  };

  useEffect(() => {
    if (!queue.length) return;
    const countDownActivity = countDownActivityRef.current;
    const copyQueue = [...queue];
    const foundIdx = copyQueue.findIndex(
      (item) => item.id === currentAddedImg!.id
    );
    const currentResult = copyQueue[foundIdx];
    const item = copyQueue[foundIdx];

    setQueue(() => {
      item.currentImgStatus = currentImgStatus;
      queueRef.current = copyQueue;

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

  useEffect(() => {
    if (!currentAddedImg) return;

    setQueue((prev) => {
      const copy = JSON_Stringify_Parse(prev);

      const foundItem = copy.find(({ id }) => id === currentAddedImg.id);

      if (foundItem) {
        foundItem.error = currentAddedImg.error;
        queueRef.current = copy;
        return copy;
      }

      copy.push({
        id: currentAddedImg.id,
        name: currentAddedImg.name,
        close: false,
        countdown: true,
        error: currentAddedImg.error,
        currentImgStatus: "EMPTY" as any,
      });
      return copy;
    });
  }, [currentAddedImg]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  if (!currentAddedImg || !currentResult) return null;

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

  const onClickOpenMenu = () => {
    if (openMenu) {
      return;
    }

    const exit = onFocusOut({
      button: kebabMenuBtnElRef.current!,
      allow: [() => optionsMenuElRef.current!],
      run: () => setOpenMenu(true),
      onExit: () => setOpenMenu(false),
    });

    onFocusOutExitRef.current = exit;
  };

  return (
    <div className={`container ${containerClass()}`}>
      <div className="inner">
        <button
          className={`kebab-menu ${openMenu ? "active" : ""}`}
          onClick={onClickOpenMenu}
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
        <CSSTransition
          in={openMenu}
          classNames="slide"
          timeout={200}
          unmountOnExit
        >
          <OptionsMenu
            queueIdx={queueIdx}
            optionsMenuElRef={optionsMenuElRef}
            onFocusOutExitRef={onFocusOutExitRef}
            countDownActivityRef={countDownActivityRef}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            queue={queue}
            setQueue={setQueue}
          ></OptionsMenu>
        </CSSTransition>
      </div>
      <style jsx>
        {`
          .container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
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
            transition: background-color 500ms, color 500ms;
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
            bottom: 0;
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

          .container.success .inner {
            background: #46ea8d;
            color: #000;
          }

          .container.success .countdown-bar {
            background: #00875c;
          }

          .container.success .icon-holder {
            position: relative;
            top: -2px;
            color: #00875c;
            transform: scale(1);
            height: 18px;
            width: 18px;
          }

          .container.success .title-text {
            color: #025339;
          }

          .container.success .kebab-menu {
            background: #46ea8d;
            color: rgba(0, 0, 0, 0.75);
          }

          .container.success .kebab-menu.active,
          .container.success .kebab-menu:hover {
            background: #004e53;
            color: #46ea8d;
          }

          .container.success .kebab-menu::after {
            background: rgba(0, 0, 0, 0.5);
          }

          .container.error .inner {
            background: #fcb7b7;
            color: #000;
          }

          .container.error .countdown-bar {
            background: #d20000;
          }

          .container.error .icon-holder {
            position: relative;
            top: -2px;
            color: #d20000;
            transform: scale(1);
            height: 18px;
            width: 18px;
          }

          .container.error .title-text {
            color: rgba(0, 0, 0, 0.75);
          }

          .container.error .kebab-menu {
            background: #fcb7b7;
            color: rgba(0, 0, 0, 0.75);
          }

          .container.error .kebab-menu.active {
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
          .container.success .countdown-bar,
          .container.error .countdown-bar {
            transform: scaleX(0);
            transition: background-color 500ms,
              transform ${countDownActivityRef.current.duration}ms linear;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
