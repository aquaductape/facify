import Table from "./Table/Table";
import THead from "./Table/THead";
import { ClassifySentinelBottom, InfoResultSentinel } from "./Table/Sentinel";
import { useEffect, useRef, useState } from "react";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { querySelector } from "../../../utils/querySelector";
import UtilBarDropdown from "./UtilBar/UtilBarDropdown";
import { CONSTANTS } from "../../../constants";
import store from "../../../store/store";

type TInforResultProps = { id: string; idx: number };
const InfoResult = ({ id, idx }: TInforResultProps) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const infoDemoElRef = useRef<HTMLDivElement | null>(null);
  const [displayUtilBar, setDisplayUtilBar] = useState(true);
  const mqlGroup = useMatchMedia();

  useEffect(() => {
    const infoDemoEl = infoDemoElRef.current!;

    // const itemsLength = store.getState().demographics.demographicNodes
    //

    if (mqlGroup.current!.minWidth_1300.matches) {
      setDisplayUtilBar(false);
    }

    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setDisplayUtilBar(false);
      } else {
        setDisplayUtilBar(true);
      }
    };

    mqlGroup.current!.minWidth_1300.addEventListener("change", onChange);

    if (!mqlGroup.current?.minWidth_1300.matches) {
      return;
    }

    const run = async () => {
      const thead = await querySelector({
        selector: `[data-id-sticky-thead="${id}"]`,
        parent: containerElRef.current!,
      });

      if (infoDemoEl.clientHeight === infoDemoEl.scrollHeight) {
        thead!.style.width = "100%";
      }
    };

    run();

    return () => {
      mqlGroup.current!.minWidth_1300.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className="container" ref={containerElRef}>
      <ClassifySentinelBottom id={id}></ClassifySentinelBottom>
      <InfoResultSentinel id={id}></InfoResultSentinel>
      {displayUtilBar ? (
        <UtilBarDropdown id={id} parentIdx={idx}></UtilBarDropdown>
      ) : null}
      <THead id={id} parentIdx={idx} type={"sticky"}></THead>
      <div data-id-info-result={id} className="info-demo" ref={infoDemoElRef}>
        <Table id={id} idx={idx}></Table>
      </div>
      <style jsx>
        {`
          .container {
            position: relative;
          }

          @media (min-width: 1300px) {
            .info-demo {
              overflow-y: auto;
              max-height: ${CONSTANTS.imageHeightDesktop}px;
              margin-top: -130px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InfoResult;
