import {
  CSSProperties,
  MutableRefObject,
  SetStateAction,
  Dispatch,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import SwappingSquares from "../../../components/Spinners/SwappingSquares";
import CevronIcon from "../../../components/svg/CevronIcon";
import CircleCheck from "../../../components/svg/CircleCheck";
import CircleCross from "../../../components/svg/CircleCross";
import CircleDot from "../../../components/svg/CircleDot";
import { TManualExit } from "../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../store/rootReducer";
import { reflow } from "../../../utils/reflow";
import { TQueue } from "./Loader";

// Disable Notification Countdown
type TOptionsMenuProps = {
  optionsMenuElRef: MutableRefObject<HTMLDivElement | null>;
  onFocusOutExitRef: MutableRefObject<TManualExit | null>;
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
  queueIdx: number;
  queue: TQueue[];
  setQueue: Dispatch<SetStateAction<TQueue[]>>;
  countDownActivityRef: MutableRefObject<{
    countDownEnabled: boolean;
    active: boolean;
    queuing: boolean;
    timeoutId: number;
    timestamp: number;
    duration: number;
  }>;
};
const OptionsMenu = ({
  optionsMenuElRef,
  onFocusOutExitRef,
  queueIdx,
  queue,
  setQueue,
  openMenu,
  setOpenMenu,
  countDownActivityRef,
}: TOptionsMenuProps) => {
  const inputResult = useSelector((state: RootState) => state.form.inputResult);

  const currentResult = queue[queueIdx];
  const countDownActivity = countDownActivityRef.current;

  const currentQueueClass = ({ idx }: { idx?: number } = {}) => {
    if (idx != null) {
      if (idx !== queueIdx) return "";
    }

    if (!currentResult) return "";
    if (currentResult.error) return "error";
    if (currentResult.currentImgStatus === "DONE") return "success";
    return "";
  };

  useEffect(() => {
    if (!optionsMenuElRef.current) return;

    // if (!openMenu) {
    //   optionsMenuElRef.current!.style.clipPath = "none";
    //   reflow();
    //   debugger;
    //   optionsMenuElRef.current!.style.clipPath = "";
    //   // optionsMenuElRef.current!.style.clipPath = "";
    // }

    if (!openMenu) return;

    optionsMenuElRef.current?.focus();
  }, [openMenu]);

  const slideDuration = 200;

  return (
    <div className="container" tabIndex={-1} ref={optionsMenuElRef}>
      <div className="container-inner">
        <div className="shadow"></div>
        <div
          className={`top-border ${queueIdx === 0 ? currentQueueClass() : ""}`}
        ></div>
        <div className={`kebab-down-arrow ${currentQueueClass()}`}></div>
        <ul className="group">
          {inputResult.map((item, idx) => {
            const currentQueue = queue[idx];
            const countDownBarElRef = useRef<HTMLDivElement | null>(null);
            const countDownInitRef = useRef(false);

            const countDownBarPercent = (
              currentTimestamp: number = Date.now()
            ) => {
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

            const countDownElStyleRef = useRef<CSSProperties>(
              getCountDownElStyle()
            );

            useEffect(() => {
              if (!currentQueue) return;
              if (queueIdx !== idx) return;
              if (currentQueue.currentImgStatus !== "DONE") return;
              if (countDownInitRef.current) return;
              countDownInitRef.current = true;

              const countDownBarEl = countDownBarElRef.current!;
              const currentTimestamp = Date.now();
              const diff = currentTimestamp - countDownActivity.timestamp;

              // if (diff > countDownActivity.duration) return;

              console.log({ diff, idx });

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

              countDownElStyleRef.current = getCountDownElStyle(
                currentTimestamp
              );
            });

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

            const renderUtil = () => {
              if (!currentQueue) return null;

              const { currentImgStatus, error } = currentQueue;

              if (error)
                return (
                  <button className="btn-show-more">
                    <CevronIcon></CevronIcon>
                  </button>
                );

              if (currentImgStatus === "DONE")
                return (
                  <button className="btn-jump" onClick={onJump}>
                    Jump
                  </button>
                );

              return null;
            };

            return (
              <li
                className={`queue-item ${currentQueueClass({ idx })}`}
                key={idx}
              >
                <div className={`icon-holder ${iconClass()}`}>
                  {renderIcon()}
                </div>
                <div className="name">{item.name}</div>
                <div className="util">{renderUtil()}</div>
                <div
                  ref={countDownBarElRef}
                  style={countDownElStyleRef.current}
                  className="countdown-bar"
                ></div>
              </li>
            );
          })}
        </ul>
      </div>
      <style jsx>
        {`
          .slide-enter .container-inner {
            transform: translateY(calc(-101% - 10px));
          }

          .slide-enter-active .container-inner {
            transform: translateY(0);
            transition: transform 200ms;
          }
          .slide-enter-active .kebab-down-arrow {
            transition: none;
          }

          .slide-exit .container-inner {
            transform: translateY(0);
          }

          .slide-exit-active .container-inner {
            transform: translateY(calc(-101% - 10px));
            transition: transform 200ms;
          }

          .container {
            position: absolute;
            top: 45px;
            left: 0;
            max-width: 600px;
            width: 100%;
            overflow: hidden;
          }

          .container-inner {
            position: relative;
            background: #fff;
            color: #000;
            margin-bottom: 15px;
          }

          .shadow {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 100%;
            width: 100%;
            box-shadow: 0 12px 15px -15px #000;
            transform-origin: bottom;
          }

          .kebab-down-arrow {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 17.5px solid transparent !important;
            border-right: 17.5px solid transparent !important;
            border-top: 20px solid #000;
            transition: border-color 500ms;
            z-index: 10;
          }

          .top-border {
            position: absolute;
            top: 0px;
            left: 25px;
            height: 1px;
            width: calc(100% - 25px);
            background: transparent;
            pointer-events: none;
            z-index: 5;
          }

          .group {
            display: flex;
            flex-direction: column;
            padding: 0;
            margin: 0;
          }

          li {
            list-style-type: none;
            margin: 0;
          }

          .queue-item {
            position: relative;
            display: flex;
            align-items: center;
            min-height: 50px;
            padding: 5px 0;
            border-bottom: 1px solid #ddd;
          }

          .icon-holder {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 35px;
            padding: 12px;
            color: #000;
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
            height: 28px;
            width: 100px;
            padding: 5px 0;
            background: #d9d9d9;
            background: none;
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
            word-break: break-all;
            padding-right: 8px;
            font-size: 16px;
          }

          .util {
            margin-left: auto;
            margin-right: 10px;
          }

          .btn {
            padding: 2px 10px;
            border-radius: 5px;
            background: #d9d9d9;
          }

          li:last-child {
            border: 0;
          }

          li:first-child {
            padding-top: 18px;
          }

          .kebab-down-arrow.success {
            border-color: #004e53;
          }

          .queue-item.success .btn-jump {
            background: #00875c;
            color: #fff;
          }

          .top-border.success,
          .top-border.error {
            background: rgba(0, 0, 0, 0.2);
          }

          .queue-item.success {
            background: #46ea8d;
          }

          .icon-holder.success {
            padding: 8px;
            color: #00875c;
          }

          .kebab-down-arrow.error {
            border-color: #7a003e;
          }

          .icon-holder.error {
            padding: 8px;
            color: #d20000;
          }

          .queue-item.error {
            background: #fcb7b7;
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

            li:first-child {
              padding-top: 25px;
            }

            .name {
              padding-left: 10px;
            }
          }

          @media (min-width: 645px) {
            .container-inner {
              margin-right: 15px;
            }

            .shadow {
              box-shadow: 12px 12px 15px -13px #000;
              transform: scaleY(1.2);
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
    </div>
  );
};

export default OptionsMenu;
