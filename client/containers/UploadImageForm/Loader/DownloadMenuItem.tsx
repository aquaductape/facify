import {
  CSSProperties,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import SwappingSquares from "../../../components/Spinners/SwappingSquares";
import CevronIcon from "../../../components/svg/CevronIcon";
import CircleCheck from "../../../components/svg/CircleCheck";
import CircleCross from "../../../components/svg/CircleCross";
import CircleDot from "../../../components/svg/CircleDot";
import { TManualExit } from "../../../lib/onFocusOut/onFocusOut";
import { reflow } from "../../../utils/reflow";
import { TURLItem } from "../formSlice";
import { TQueue } from "./Loader";

type TDownloadMenuItemProps = {
  idx: number;
  optionsMenuElRef: MutableRefObject<HTMLDivElement | null>;
  onFocusOutExitRef: MutableRefObject<TManualExit | null>;
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
  queueIdx: number;
  queue: TQueue[];
  item: TURLItem;
  setQueue: Dispatch<SetStateAction<TQueue[]>>;
  countDownActivityRef: MutableRefObject<{
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
  openMenu,
  optionsMenuElRef,
  queue,
  queueIdx,
  setOpenMenu,
  setQueue,
  item,
}: TDownloadMenuItemProps) => {
  const [showMore, setShowMore] = useState(false);
  const currentQueue = queue[idx];
  const countDownBarElRef = useRef<HTMLDivElement | null>(null);
  const countDownInitRef = useRef(false);
  const countDownActivity = countDownActivityRef.current;
  const currentResult = queue[queueIdx];

  const currentQueueClass = ({ idx }: { idx?: number } = {}) => {
    if (idx != null) {
      if (idx !== queueIdx) return "";
    }

    if (!currentResult) return "";
    if (currentResult.error) return "error";
    if (currentResult.currentImgStatus === "DONE") return "success";
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

  const getCountDownElStyle = (
    currentTimestamp: number = Date.now()
  ): CSSProperties => {
    if (!currentQueue) return {};
    if (currentQueue.currentImgStatus !== "DONE") return {};

    return queueIdx === idx
      ? {
          transition: `transform ${
            countDownActivity.duration -
            (currentTimestamp - countDownActivity.timestamp)
          }ms linear`,
        }
      : {};
  };

  const countDownElStyleRef = useRef<CSSProperties>(getCountDownElStyle());

  const onBtnShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const stopAndRemoveCountDownDisplay = () => {
    // console.log("reset", countDownActivityRef.current);
    if (countDownActivityRef.current.enabled) return;
    countDownBarElRef.current!.style.transform = "scaleX(0)";
    countDownBarElRef.current!.style.transition = "none";

    countDownElStyleRef.current = {};
  };

  const renderIcon = () => {
    // return <SwappingSquares></SwappingSquares>;
    if (!currentQueue) {
      return <CircleDot></CircleDot>;
    }
    const { currentImgStatus, error } = currentQueue;

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
    if (!currentQueue) {
      return "";
    }
    const { currentImgStatus, error } = currentQueue;

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
      window.clearTimeout(countDownActivity.timeoutId);
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
    if (!currentQueue) return;
    // if (queueIdx === 2) debugger;
    if (queueIdx !== idx) return;
    if (currentQueue.currentImgStatus !== "DONE") return;
    if (countDownInitRef.current) {
      if (!countDownActivity.enabled) {
        stopAndRemoveCountDownDisplay();
        countDownInitRef.current = true;
        return;
      }
      return;
    }

    if (!countDownActivity.enabled) {
      stopAndRemoveCountDownDisplay();
      countDownInitRef.current = true;
      return;
    }

    countDownInitRef.current = true;

    const countDownBarEl = countDownBarElRef.current!;
    const currentTimestamp = Date.now();
    const diff = currentTimestamp - countDownActivity.timestamp;

    // if (diff > countDownActivity.duration) return;

    // console.log({ diff, idx });

    countDownBarEl.style.transform = `scaleX(${countDownBarPercent(
      currentTimestamp
    )})`;
    countDownBarEl.style.transition = "none";
    reflow();
    countDownBarEl.style.transform = "scaleX(0)";
    countDownBarEl.style.transition = `transform ${
      countDownActivity.duration -
      (currentTimestamp - countDownActivity.timestamp)
    }ms linear`;

    countDownElStyleRef.current = getCountDownElStyle(currentTimestamp);
  });

  return (
    <li className={`queue-item ${currentQueueClass({ idx })}`} key={idx}>
      <div className="main">
        <div className={`icon-holder ${iconClass()}`}>{renderIcon()}</div>
        <div className="name">{item.name}</div>
        {currentQueue ? (
          <div className="util">
            {currentQueue!.error ? (
              <button
                className={`btn btn-show-more ${showMore ? "active" : ""}`}
                aria-expanded={showMore ? "true" : "false"}
                aria-label="show error message"
                onClick={onBtnShowMore}
              >
                <span className="btn-show-more-inner">
                  <CevronIcon></CevronIcon>
                </span>
              </button>
            ) : currentQueue!.currentImgStatus === "DONE" ? (
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
          style={countDownElStyleRef.current}
          className="countdown-bar"
        ></div>
      </div>
      {showMore ? (
        <div className="more-info">{currentQueue.errorMsg}</div>
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

export default DownloadMenuItem;
