import Table from "../../Table/Table";
import Stats from "../../Stats/Stats";
import { appHeight, appHeightDesktop } from "../../../constants";
import THead from "../../Table/THead";
import { InfoResultSentinel } from "../../Table/Sentinel";
import { TImageItem } from "../../UploadImageForm/imageUrlSlice";
import { useEffect, useRef } from "react";

type TInforResultProps = Pick<TImageItem, "id" | "elOnLoadStatus">;
const InfoResult = ({ id, elOnLoadStatus }: TInforResultProps) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);
  if (elOnLoadStatus !== "DONE") return null;

  useEffect(() => {}, []);

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
