import Table from "../../Table/Table";
import { appHeightDesktop } from "../../../constants";
import THead from "../../Table/THead";
import { InfoResultSentinel } from "../../Table/Sentinel";
import { useEffect, useRef } from "react";
import { useMatchMedia } from "../../../hooks/matchMedia";

type TInforResultProps = { id: number };
const InfoResult = ({ id }: TInforResultProps) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const infoDemoElRef = useRef<HTMLDivElement | null>(null);
  const mql = useMatchMedia();

  useEffect(() => {
    if (!mql.current!.matches) return;

    setTimeout(() => {
      const infoDemoEl = infoDemoElRef.current!;
      const thead = containerElRef.current!.querySelector(
        `.thead-sticky-desktop-${id}`
      ) as HTMLDivElement;

      if (infoDemoEl.clientHeight === infoDemoEl.scrollHeight) {
        thead.style.width = "100%";
      }
    }, 200);
  }, []);

  return (
    <div className="container" ref={containerElRef}>
      <InfoResultSentinel id={id}></InfoResultSentinel>
      <THead id={id} mobile={false}></THead>
      <div data-id-info-result={id} className="info-demo" ref={infoDemoElRef}>
        {/* <Stats id={id} /> */}
        <Table id={id}></Table>
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
