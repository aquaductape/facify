// Finding Faces
// Compressing
// bg #30117d

import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import SwappingSquares from "../../../components/Spinners/SwappingSquares";
import CircleCheck from "../../../components/svg/CircleCheck";
import CircleCross from "../../../components/svg/CircleCross";
import KebabMenu from "../../../components/svg/KebabMenu";
import LinkIcon from "../../../components/svg/LinkIcon";
import { RootState } from "../../../store/rootReducer";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";

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

type TLoaderProps = {};
type TQueue = {
  id: string;
  name: string;
  currentImgStatus: "EMPTY" | "DONE" | "COMPRESSING" | "SCANNING";
  error: boolean;
  countdown: boolean;
  close: boolean;
};
const Loader = () => {
  // const inputResult = useSelector((state: RootState) => state.form.inputResult);
  // const currentAddedImg = useSelector(
  //   (state: RootState) => state.imageUrl.currentAddedImg
  // );
  // const currentImgStatus = useSelector(
  //   (state: RootState) => state.imageUrl.currentImgStatus
  // );
  const [inputResult] = useState<
    { id: string; content: string; name: string; error: boolean }[]
  >([
    { id: nanoid(), content: "", error: false, name: "post-malon.jpg" },
    { id: nanoid(), content: "", error: false, name: "aubrey.jpg" },
    { id: nanoid(), content: "", error: false, name: "elon.gif" },
  ]);
  const [currentAddedImg, setCurrentAddedImg] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentImgStatus, setCurrentImgStatus] = useState<
    "EMPTY" | "DONE" | "COMPRESSING" | "SCANNING"
  >("EMPTY");
  const [showTitle, setShowTitle] = useState(true);
  const [queue, setQueue] = useState<TQueue[]>([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const queueIdxRef = useRef(queueIdx);
  const queueLengthRef = useRef(0);
  const countDownActivityRef = useRef<{
    queueId: string;
    countDownEnabled: boolean;
    active: boolean;
    queuing: boolean;
  }>({
    queueId: "",
    countDownEnabled: true,
    active: false,
    queuing: false,
  });

  // test
  useEffect(() => {
    const addItem = (idx: number, cb?: () => void) => {
      setTimeout(() => {
        setCurrentAddedImg(() => {
          const resultItem = inputResult[idx];
          const item = {
            id: resultItem.id,
            name: resultItem.name,
          };

          return item;
        });

        // if (idx === 1) return;
        setTimeout(() => {
          setCurrentImgStatus("COMPRESSING");
        }, 1000);

        setTimeout(() => {
          setCurrentImgStatus("SCANNING");

          setTimeout(() => {
            setCurrentImgStatus("DONE");
            cb && cb();
          }, 2000);
        }, 2000);
      }, 1000);
    };

    addItem(0, () => {
      setTimeout(() => {
        addItem(1, () => {
          setTimeout(() => {
            addItem(2);
          }, 10000);
        });
      }, 10000);
    });
  }, []);

  const nextQueue = () => {
    if (queueIdxRef.current !== queueLengthRef.current - 1) {
      setQueueIdx((prev) => prev + 1);

      queueIdxRef.current = queueIdxRef.current + 1;
    }
  };

  const runningQueue = () => {
    const countDownActivity = countDownActivityRef.current;

    console.log(
      "runningQueue",
      queueLengthRef.current,
      queueIdxRef,
      countDownActivity
    );
    if (queueIdxRef.current === queueLengthRef.current - 1) {
      countDownActivity.queuing = false;
      return;
    }
    if (countDownActivity.queuing) return;

    const timeout = 5000;
    countDownActivity.active = true;
    countDownActivity.queuing = true;

    setTimeout(() => {
      countDownActivity.active = false;
      nextQueue();
      runningQueue();
    }, timeout);
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

      return copyQueue;
    });

    if (foundIdx !== queueIdx) return;

    if (
      currentImgStatus === "DONE" &&
      currentResult.countdown &&
      queueIdx === queue.length - 1
    ) {
      countDownActivity.active = true;
      countDownActivity.queueId = item.id;

      runningQueue();
    }
  }, [currentImgStatus]);

  useEffect(() => {
    queueLengthRef.current = queue.length;
    runningQueue();
    console.log("add", queue);
  }, [queue.length]);

  useEffect(() => {
    if (!currentAddedImg) return;

    const currentResult = queue[queueIdx];
    const countDownActivity = countDownActivityRef.current;

    setQueue((prev) => {
      const copy = [
        ...prev,
        {
          id: currentAddedImg.id,
          name: currentAddedImg.name,
          close: false,
          countdown: true,
          error: false,
          currentImgStatus: "EMPTY" as any,
          resolved: false,
        },
      ];
      return copy;
    });

    console.log("fldjlsfkj", { currentResult, countDownActivity });
    if (!currentResult) return;

    if (
      currentResult.currentImgStatus === "DONE" &&
      !countDownActivity.active &&
      countDownActivity.queueId === currentResult.id
    ) {
      nextQueue();
    }
  }, [currentAddedImg]);

  const currentResult = queue[queueIdx];

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

  return (
    <div className={`container ${containerClass()}`}>
      <div className="inner">
        <button className="kebab-menu">
          <KebabMenu></KebabMenu>
        </button>
        <div className="notification">
          <div className="message">
            <div className="title">
              <CSSTransition
                in={showTitle}
                unmountOnExit
                timeout={250}
                classNames="fade"
              >
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
              </CSSTransition>
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
          <div className="countdown-bar"></div>
        </div>
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
            background: inherit;
            color: inherit;
            width: 35px;
            height: 100%;
            padding: 10px 0;
          }

          .kebab-menu::after {
            position: absolute;
            top: 0;
            right: -2px;
            content: "";
            width: 2px;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            transition: background-color 500ms;
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
            transform: scaleX(0);
            transition: background-color 500ms, transform 5s linear;
          }

          .container.success .icon-holder {
            position: relative;
            top: -2px;
            color: #00875c;
            transform: scale(1);
            height: 18px;
          }

          .container.success .title-text {
            color: #025339;
          }

          .container.success .kebab-menu {
            color: rgba(0, 0, 0, 0.75);
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
            transform: scaleX(0);
            transition: background-color 500ms, transform 5s linear;
          }

          .container.error .icon-holder {
            position: relative;
            top: -2px;
            color: #d20000;
            transform: scale(1);
            height: 18px;
          }

          .container.error .title-text {
            color: rgba(0, 0, 0, 0.75);
          }

          .container.error .kebab-menu {
            color: rgba(0, 0, 0, 0.75);
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
    </div>
  );
};

export default Loader;
