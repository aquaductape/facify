import {
  MutableRefObject,
  SetStateAction,
  Dispatch,
  useEffect,
  ChangeEventHandler,
} from "react";
import { useSelector } from "react-redux";
import { TManualExit } from "../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../store/rootReducer";
import InputCheckBox from "./InputCheckBox";
import DownloadMenuItem from "./DownloadMenuItem";
import { TQueue } from "./Loader";

// Disable Notification Countdown
type TDownloadMenuProps = {
  optionsMenuElRef: MutableRefObject<HTMLDivElement | null>;
  onFocusOutExitRef: MutableRefObject<TManualExit | null>;
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
  queueIdx: number;
  queue: TQueue[];
  setQueue: Dispatch<SetStateAction<TQueue[]>>;
  runningQueue: () => void;
  countDownActivityRef: MutableRefObject<{
    enabled: boolean;
    active: boolean;
    queuing: boolean;
    timeoutId: number;
    timestamp: number;
    duration: number;
  }>;
};
// DownloadMenu
const DownloadMenu = ({
  optionsMenuElRef,
  onFocusOutExitRef,
  queueIdx,
  queue,
  setQueue,
  runningQueue,
  openMenu,
  setOpenMenu,
  countDownActivityRef,
}: TDownloadMenuProps) => {
  const inputResult = useSelector((state: RootState) => state.form.inputResult);

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

  useEffect(() => {
    if (!optionsMenuElRef.current) return;

    if (!openMenu) return;

    optionsMenuElRef.current?.focus();
  }, [openMenu]);

  const onChangeCheckBox: ChangeEventHandler<HTMLInputElement> = (e) => {
    countDownActivity.enabled = !e.target.checked;
    window.clearTimeout(countDownActivity.timeoutId);
    countDownActivity.timestamp = Date.now();
    runningQueue();
  };

  return (
    <div className="container" tabIndex={-1} ref={optionsMenuElRef}>
      <div className="container-inner">
        <div className="shadow"></div>
        <div
          className={`top-border ${queueIdx === 0 ? currentQueueClass() : ""}`}
        ></div>
        <div className={`kebab-down-arrow ${currentQueueClass()}`}></div>
        <ul className="group">
          {inputResult.map((item, idx) => (
            <DownloadMenuItem
              countDownActivityRef={countDownActivityRef}
              item={item}
              onFocusOutExitRef={onFocusOutExitRef}
              openMenu={openMenu}
              optionsMenuElRef={optionsMenuElRef}
              queue={queue}
              queueIdx={queueIdx}
              setOpenMenu={setOpenMenu}
              setQueue={setQueue}
              idx={idx}
              key={item.id}
            ></DownloadMenuItem>
          ))}
        </ul>
        <div className="options">
          <div className="input-checkbox">
            <InputCheckBox onChange={onChangeCheckBox}></InputCheckBox>
          </div>
        </div>
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
            pointer-events: none;
            box-shadow: 0 12px 15px -15px #000;
            transform-origin: bottom;
          }

          .input-checkbox {
            text-align: center;
            padding: 20px 0;
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

          .kebab-down-arrow.success {
            border-color: #004e53;
          }

          .kebab-down-arrow.error {
            border-color: #7a003e;
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

          .top-border.success,
          .top-border.error {
            background: rgba(0, 0, 0, 0.2);
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
        `}
      </style>
    </div>
  );
};

export default DownloadMenu;
