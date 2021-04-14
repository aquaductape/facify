import Table from "../../Table/Table";
import { appHeightDesktop } from "../../../constants";
import THead from "../../Table/THead";
import { InfoResultSentinel } from "../../Table/Sentinel";
import { useEffect, useRef } from "react";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { querySelector } from "../../../utils/querySelector";

type TInforResultProps = { id: string; idx: number };
const InfoResult = ({ id, idx }: TInforResultProps) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const infoDemoElRef = useRef<HTMLDivElement | null>(null);
  const mqlGroup = useMatchMedia();

  useEffect(() => {
    const infoDemoEl = infoDemoElRef.current!;

    if (!mqlGroup.current?.minWidth_1300.matches) return;

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
  }, []);

  return (
    <div className="container" ref={containerElRef}>
      <InfoResultSentinel id={id}></InfoResultSentinel>
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
              max-height: ${appHeightDesktop}px;
              margin-top: -125px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InfoResult;
