import Table from "../../Table/Table";
import { appHeightDesktop } from "../../../constants";
import THead from "../../Table/THead";
import { InfoResultSentinel } from "../../Table/Sentinel";
import { useRef } from "react";

type TInforResultProps = { id: number };
const InfoResult = ({ id }: TInforResultProps) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {}, []);

  return (
    <div className="container" ref={containerElRef}>
      <InfoResultSentinel id={id}></InfoResultSentinel>
      <THead id={id} mobile={false}></THead>
      <div className="info-demo">
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
