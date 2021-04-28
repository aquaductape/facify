import {
  MutableRefObject,
  SetStateAction,
  Dispatch,
  useEffect,
  ChangeEventHandler,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { TManualExit } from "../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../store/rootReducer";
import InputCheckBox from "./InputCheckBox";
import DownloadMenuItem, {
  DownloadMenuItemsContainer,
  TDownloadMenuItemHandler,
} from "./DownloadMenuItem";
import { TQueue } from "./Loader";
import { ScrollShadow, SentinelShadow } from "../../../components/ScrollShadow";

// Disable Notification Countdown
type TDownloadMenuProps = {
  optionsMenuElRef: MutableRefObject<HTMLDivElement | null>;
  onFocusOutExitRef: MutableRefObject<TManualExit | null>;
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
  queue: TQueue[];
  queueIdx: number;
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
// DownloadMenu
const DownloadMenu = ({
  optionsMenuElRef,
  onFocusOutExitRef,
  queue,
  queueIdx,
  openMenu,
  setOpenMenu,
  goToNextRef,
  countDownActivityRef,
}: TDownloadMenuProps) => {
  const countDownActivity = countDownActivityRef.current;
  const groupElRef = useRef<HTMLUListElement | null>(null);
  const goToNext = goToNextRef.current;
  const currentResult = queue[queueIdx];
  const [isScrollContainer, setIsScrollContainer] = useState(false);
  const scrollShadowElsRef = useRef<{
    top: { current: HTMLDivElement | null };
    bottom: { current: HTMLDivElement | null };
  }>({
    top: { current: null },
    bottom: { current: null },
  });

  const currentQueueClass = ({ idx }: { idx?: number } = {}) => {
    if (idx != null) {
      if (idx !== queueIdx) return "";
    }

    if (!currentResult) return "";
    if (currentResult.error) return "error";
    if (currentResult.currentImgStatus === "DONE") return "success";
    return "";
  };

  const onChangeCheckBox: ChangeEventHandler<HTMLInputElement> = (e) => {
    const checkValue = !e.target.checked;
    countDownActivity.enabled = checkValue;
    // debugger;
    goToNext({ clearCurrentTimout: true, enableCountDown: checkValue });
  };

  useEffect(() => {
    if (!optionsMenuElRef.current) return;

    if (!openMenu) return;

    optionsMenuElRef.current?.focus();
  }, [openMenu]);

  useEffect(() => {
    const groupEl = groupElRef.current!;
    if (groupEl.scrollHeight <= groupEl.clientHeight) {
      return;
    }

    setIsScrollContainer(true);
  }, []);

  return (
    <div className="container" tabIndex={-1} ref={optionsMenuElRef}>
      {/* <div className={`top-border ${currentQueueClass()}`}></div> */}
      <div className={`container-inner ${currentQueueClass()}`}>
        <div className="shadow"></div>

        <div className="group-container">
          {isScrollContainer ? (
            <>
              <ScrollShadow
                top={true}
                scrollShadowElsRef={scrollShadowElsRef}
              ></ScrollShadow>
              <ScrollShadow
                top={false}
                scrollShadowElsRef={scrollShadowElsRef}
              ></ScrollShadow>
            </>
          ) : null}

          <ul className="group" ref={groupElRef}>
            <DownloadMenuItemsContainer
              countDownActivityRef={countDownActivityRef}
              goToNextRef={goToNextRef}
              onFocusOutExitRef={onFocusOutExitRef}
            ></DownloadMenuItemsContainer>
            {isScrollContainer ? (
              <>
                <SentinelShadow
                  top={true}
                  scrollShadowElsRef={scrollShadowElsRef}
                ></SentinelShadow>
                <SentinelShadow
                  top={false}
                  scrollShadowElsRef={scrollShadowElsRef}
                ></SentinelShadow>
              </>
            ) : null}
          </ul>
        </div>
        <div className="options">
          <div className="input-checkbox">
            <div className="input-checkbox-inner">
              <InputCheckBox onChange={onChangeCheckBox}></InputCheckBox>
            </div>
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
            outline: 0;
          }

          .container-inner {
            position: relative;
            background: #fff;
            color: #000;
            margin-bottom: 15px;
            border: 4px solid #0c0534;
            border-bottom: 0;
            border-right: 0;
            transition: border-color 500ms;
          }

          .container-inner.success {
            border-color: #004e53;
          }

          .container-inner.error {
            border-color: #7a003e;
          }
          .top-border {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: #0c0534;
            height: 1px;
            pointer-events: none;
            z-index: 5;
            transition: background-color 500ms;
          }

          .top-border.success {
            background: #004e53;
          }

          .top-border.error {
            background: #7a003e;
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
          .input-checkbox-inner {
            display: inline-block;
          }

          .group-container {
            position: relative;
          }

          .group {
            position: relative;
            display: flex;
            flex-direction: column;
            max-height: 20vh;
            overflow-y: auto;
            padding: 0;
            margin: 0;
          }

          @media (min-width: 645px) {
            .container-inner {
              margin-right: 15px;
            }

            .top-border {
              width: calc(100% - 15px);
            }

            .shadow {
              box-shadow: 12px 12px 15px -13px #000;
              transform: scaleY(1.2);
            }

            .group {
              scrollbar-color: #9397b0 #dbdde5;
            }

            .group::-webkit-scrollbar-track {
              background: #dbdde5;
            }

            .group::-webkit-scrollbar-thumb {
              background: #9397b0;
            }

            .group::-webkit-scrollbar-thumb:hover {
              background-color: #7d89c5;
            }

            .group::-webkit-scrollbar-thumb:active {
              background-color: #0f1c66;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DownloadMenu;
