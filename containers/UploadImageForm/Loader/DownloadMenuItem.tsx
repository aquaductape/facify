import React, {
  CSSProperties,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import SwappingSquares from "../../../components/Spinners/SwappingSquares";
import Cevron from "../../../components/svg/Cevron";
import CircleCheck from "../../../components/svg/CircleCheck";
import CircleCross from "../../../components/svg/CircleCross";
import CircleDot from "../../../components/svg/CircleDot";
import { TManualExit } from "../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../store/rootReducer";
import { reflow } from "../../../utils/reflow";
import { TURLItem } from "../formSlice";
import { TQueue } from "./Loader";

type TDisplayCountDown = {
  active: boolean;
  enabled: boolean;
};

export type TDownloadMenuItemHandler = {
  [key: string]: {
    setDownloadQueue: React.Dispatch<React.SetStateAction<TQueue | null>>;
    setDisplayCountDown: React.Dispatch<
      React.SetStateAction<TDisplayCountDown>
    >;
    displayCountDown: TDisplayCountDown;
    downloadQueue: TQueue | null;
  };
};

type TDownloadMenuItemProps = {
  idx: number;
  onFocusOutExitRef: MutableRefObject<TManualExit | null>;
  item: TURLItem;
  goToNextRef: MutableRefObject<
    (
      props?:
        | {
            clearCurrentTimout?: boolean | undefined;
            enableCountDown?: boolean | undefined;
          }
        | undefined
    ) => void
  >;
  downloadMenuItemHandlerRef: MutableRefObject<TDownloadMenuItemHandler>;
  countDownActivityRef: MutableRefObject<{
    currentImgId: string;
    enabled: boolean;
    active: boolean;
    queuing: boolean;
    timeoutId: number;
    timestamp: number;
    duration: number;
  }>;
};
const DownloadMenuItem = ({
  countDownActivityRef,
  idx,
  onFocusOutExitRef,
  downloadMenuItemHandlerRef,
  goToNextRef,
  item,
}: TDownloadMenuItemProps) => {
  const [showMore, setShowMore] = useState(false);
  // const currentQueue = queue[idx];
  const countDownBarElRef = useRef<HTMLDivElement | null>(null);
  const countDownInitRef = useRef(false);
  const hasRenderedRef = useRef(false);
  const countDownBarElStyleRef = useRef<CSSProperties>({});
  const countDownActivity = countDownActivityRef.current;
  // const finishedQueue = queue[queueIdx];
  const [downloadQueue, setDownloadQueue] = useState<TQueue | null>(() => {
    const downloadMenuItemHandler = downloadMenuItemHandlerRef.current[idx];
    if (!downloadMenuItemHandler) return null;
    return downloadMenuItemHandler.downloadQueue || null;
  });
  // const [finishedQueue, setFinishedQueue] = useState<TQueue | null>(null);
  const [displayCountDown, setDisplayCountDown] = useState<TDisplayCountDown>(
    () => {
      const downloadMenuItemHandler = downloadMenuItemHandlerRef.current[idx];
      if (!downloadMenuItemHandler) return { active: false, enabled: true };
      return (
        downloadMenuItemHandler.displayCountDown || {
          active: false,
          enabled: true,
        }
      );
    }
  );
  const goToNext = goToNextRef.current;

  useEffect(() => {
    const downloadMenuItem = downloadMenuItemHandlerRef.current[idx];

    if (!downloadMenuItem || !downloadMenuItem.setDownloadQueue) {
      downloadMenuItemHandlerRef.current[idx] = {
        setDownloadQueue,
        setDisplayCountDown,
        displayCountDown,
        downloadQueue: null,
      };
      return;
    }

    downloadMenuItemHandlerRef.current[idx] = {
      ...downloadMenuItem,
      setDownloadQueue,
      setDisplayCountDown,
    };

    return () => {
      downloadMenuItemHandlerRef.current[idx].setDisplayCountDown = null as any;
      downloadMenuItemHandlerRef.current[idx].setDownloadQueue = null as any;
    };
  }, []);

  const currentQueueClass = () => {
    if (!downloadQueue || countDownActivity.currentImgId !== item.id) return "";
    if (downloadQueue.error) return "error";
    if (downloadQueue.currentImgStatus === "DONE") return "success";
    return "";
  };

  const countDownBarPercent = (currentTimestamp: number = Date.now()) => {
    const result =
      1 -
      (currentTimestamp - countDownActivity.timestamp) /
        countDownActivity.duration;
    if (result < 0) return 0;
    return result;
  };

  const stopRunningCountDown = () => {
    if (
      displayCountDown.enabled ||
      !countDownActivity.active ||
      downloadQueue?.currentImgStatus !== "DONE"
      //  || countDownActivity.currentImgId !== item.id
    ) {
      return;
    }
    countDownBarElStyleRef.current! = {};
    countDownBarElRef.current!.style.transition = "none";
  };

  const setCountDownElStyle = (): CSSProperties => {
    if (countDownInitRef.current) {
      stopRunningCountDown();
      return countDownBarElStyleRef.current;
    }
    if (!downloadQueue) return {};
    if (
      downloadQueue.currentImgStatus !== "DONE" ||
      !countDownActivity.active ||
      !countDownActivity.enabled ||
      countDownActivity.currentImgId !== item.id
    ) {
      return {};
    }

    countDownInitRef.current = true;

    const currentTimestamp = Date.now();

    const style = {
      transform: `scaleX(0)`,
      transition: `transform ${
        countDownActivity.duration -
        (currentTimestamp - countDownActivity.timestamp)
      }ms linear`,
    };

    countDownBarElRef.current!.style.transform = `scaleX(${countDownBarPercent(
      currentTimestamp
    )})`;
    countDownBarElRef.current!.style.transition = "none";
    reflow();
    countDownBarElRef.current!.style.transform = "";
    countDownBarElRef.current!.style.transition = style.transition;
    return style;
  };

  const onBtnShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const renderIcon = () => {
    if (!downloadQueue) {
      return <CircleDot></CircleDot>;
    }
    const { currentImgStatus, error } = downloadQueue;

    if (error) {
      return <CircleCross></CircleCross>;
    }

    if (
      currentImgStatus === "EMPTY" ||
      currentImgStatus === "COMPRESSING" ||
      currentImgStatus === "SCANNING"
    ) {
      return <SwappingSquares></SwappingSquares>;
    }
    return <CircleCheck></CircleCheck>;
  };

  const iconClass = () => {
    if (!downloadQueue) {
      return "";
    }
    const { currentImgStatus, error } = downloadQueue;

    if (error) {
      return "error";
    }

    if (currentImgStatus === "DONE") {
      return "success";
    }
    return "loading";
  };

  const onJump = () => {
    const countDownActivity = countDownActivityRef.current;
    const onFocusOutExit = onFocusOutExitRef.current;
    // better to check if li progressbar is active instead

    if (countDownActivity.active) {
      goToNext({ clearCurrentTimout: true });
      // nextQueue
      // remove countdown-bar
    }

    // close options menu
    onFocusOutExit?.runAllExits();
    // setOpenMenu(false);

    // const el = document.getElementById(item.id)!; // jump
    // smoothScrollTo({ destination: el, duration: 200 });
  };

  useEffect(() => {
    if (!hasRenderedRef.current) return;
    setCountDownElStyle();
  }, [downloadQueue?.currentImgStatus, displayCountDown]);

  useEffect(() => {
    setCountDownElStyle();
    hasRenderedRef.current = true;
  }, []);

  return (
    <li className={`queue-item ${currentQueueClass()}`} key={idx}>
      <div className="main">
        <div className={`icon-holder ${iconClass()}`}>{renderIcon()}</div>
        <div className="name">{item.name}</div>
        {downloadQueue ? (
          <div className="util">
            {downloadQueue!.error ? (
              <button
                className={`btn btn-show-more ${showMore ? "active" : ""}`}
                aria-expanded={showMore ? "true" : "false"}
                aria-label="show error message"
                onClick={onBtnShowMore}
              >
                <span className="btn-show-more-inner">
                  <Cevron></Cevron>
                </span>
              </button>
            ) : downloadQueue!.currentImgStatus === "DONE" ? (
              <button
                className="btn btn-jump"
                onClick={onJump}
                aria-label={`Jump to image ${item.name}`}
              >
                Jump
              </button>
            ) : null}
          </div>
        ) : null}
        <div
          ref={countDownBarElRef}
          style={countDownBarElStyleRef.current}
          className="countdown-bar"
        ></div>
      </div>
      {showMore ? (
        <div className="more-info">{downloadQueue!.errorMsg}</div>
      ) : null}
      <style jsx>
        {`
          li {
            list-style-type: none;
            margin: 0;
          }

          .queue-item {
            border-bottom: 1px solid #ddd;
          }

          .main {
            position: relative;
            display: flex;
            align-items: center;
            padding: 5px 0;
            min-height: 50px;
          }

          .more-info {
            border-top: 1px solid #eee;
            padding: 8px;
          }

          .icon-holder {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 35px;
            height: 35px;
            padding: 12px;
            color: #000;
          }

          .btn {
            outline: 0;
          }

          .btn.focus-visible {
            outline: 3px solid #000;
            outline-offset: 2px;
          }

          .btn-jump {
            font-size: 16px;
            padding: 5px 0;
            width: 100px;
            background: #d9d9d9;
            transition: background-color 250ms, color 250ms;
          }

          .btn-jump:hover {
            background: #000 !important;
            color: #fff !important;
          }

          .btn-show-more {
            background: #d9d9d9;
            background: none;
            padding: 0;
            overflow: hidden;
          }

          .btn-show-more-inner {
            display: block;
            height: 28px;
            width: 100px;
            padding: 5px 0;
            transition: transform 250ms;
          }

          .btn-show-more.active .btn-show-more-inner {
            transform: rotate(-90deg);
          }

          .countdown-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            transform: scaleX(0);
            transform-origin: left;
            background: #00875c;
          }

          .name {
            display: block;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            max-height: 60px;
            text-overflow: ellipsis;
            word-break: break-all;
            padding: 3px 0;
            padding-right: 8px;
            font-size: 16px;
          }

          .util {
            margin-left: auto;
            margin-right: 10px;
          }

          .queue-item:last-child {
            border: 0;
          }

          .queue-item:first-child {
            padding-top: 18px;
          }

          .queue-item.success .btn-jump {
            background: #00875c;
            color: #fff;
          }

          .queue-item.success {
            background: #46ea8d;
          }

          .icon-holder.success {
            padding: 8px;
            color: #00875c;
          }

          .icon-holder.error {
            padding: 8px;
            color: #d20000;
          }

          .queue-item.error {
            background: #fcb7b7;
          }
          .queue-item.error .more-info {
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }

          .queue-item.error .countdown-bar {
            background: #d20000;
          }

          .icon-holder.loading {
            padding: 8px;
            transform: scale(0.6);
          }

          @media (min-width: 500px) {
            .icon-holder {
              padding: 12px;
            }

            .icon-holder.success,
            .icon-holder.error,
            .icon-holder.loading {
              padding: 5px;
            }

            .queue-item:first-child {
              padding-top: 25px;
            }

            .name {
              padding-left: 10px;
            }
          }

          @media (min-width: 800px) {
            .name {
              padding-left: 20px;
              font-size: 18px;
              padding-right: 15px;
            }
          }
        `}
      </style>
    </li>
  );
};

type TDownloadMenuItemsContainerProps = Pick<
  TDownloadMenuItemProps,
  | "countDownActivityRef"
  | "downloadMenuItemHandlerRef"
  | "goToNextRef"
  | "onFocusOutExitRef"
>;

export const DownloadMenuItemsContainer = React.memo(
  ({
    countDownActivityRef,
    downloadMenuItemHandlerRef,
    goToNextRef,
    onFocusOutExitRef,
  }: TDownloadMenuItemsContainerProps) => {
    const inputResult = useSelector(
      (state: RootState) => state.form.inputResult
    );
    return (
      <>
        {inputResult.map((item, idx) => (
          <DownloadMenuItem
            countDownActivityRef={countDownActivityRef}
            item={item}
            onFocusOutExitRef={onFocusOutExitRef}
            downloadMenuItemHandlerRef={downloadMenuItemHandlerRef}
            goToNextRef={goToNextRef}
            idx={idx}
            key={item.id}
          ></DownloadMenuItem>
        ))}
      </>
    );
  }
);

export default DownloadMenuItem;
