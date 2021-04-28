import Table from "./Table/Table";
import THead from "./Table/THead";
import { ClassifySentinelBottom, InfoResultSentinel } from "./Table/Sentinel";
import { useEffect, useRef, useState } from "react";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { querySelector } from "../../../utils/querySelector";
import UtilBarDropdown from "./UtilBar/UtilBarDropdown";
import { CONSTANTS } from "../../../constants";
import store from "../../../store/store";
import Face from "../../../components/svg/Face";

type TInforResultProps = { id: string; idx: number };
const InfoResult = ({ id, idx }: TInforResultProps) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const infoDemoElRef = useRef<HTMLDivElement | null>(null);
  const [displayUtilBar, setDisplayUtilBar] = useState(true);
  const [hasFaces] = useState(
    () => !!store.getState().demographics.parents[idx].childIds.length
  );
  const mqlGroup = useMatchMedia();

  useEffect(() => {
    const infoDemoEl = infoDemoElRef.current!;

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
      if (!hasFaces) return;

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

  const noChildrenRender = (
    <div className="container">
      <div className="face-icon">
        <Face title="No Faces Found" sad={true}></Face>
      </div>
      <div className="message">No Faces Found</div>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #888;
            height: 125px;
            margin-top: -130px;
          }

          .face-icon {
            width: 50px;
            height: 50px;
          }

          .message {
            margin-top: 8px;
            font-size: 20px;
            font-weight: bold;
          }

          @media (min-width: 1300px) {
            .container {
              height: 100%;
              margin-top: 0;
              color: #aaa;
            }
            .message {
              margin-top: 20px;
              font-size: 30px;
            }

            .face-icon {
              width: 100px;
              height: 100px;
            }
          }
        `}
      </style>
    </div>
  );

  const tableRender = (
    <>
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
          @media (min-width: 1300px) {
            .info-demo {
              height: 100%;
              overflow-y: auto;
              margin-top: -130px;
            }
          }
        `}
      </style>
    </>
  );

  return (
    <div className="container" ref={containerElRef}>
      {hasFaces ? tableRender : noChildrenRender}
      <style jsx>
        {`
          .container {
            position: relative;
          }
        `}
      </style>
    </div>
  );
};

export default InfoResult;
