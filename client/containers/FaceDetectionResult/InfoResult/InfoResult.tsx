import { useSelector } from "react-redux";
import Table from "../../Table/Table";
import { RootState } from "../../../store/rootReducer";
import Stats from "../../Stats/Stats";
import { appHeight } from "../../../constants";
import THead from "../../Table/THead";
import { InfoResultSentinel } from "../../Table/Sentinel";

const InfoResult = () => {
  const imageUrl = useSelector((state: RootState) => state.imageUrl);

  if (imageUrl.elOnLoadStatus !== "DONE") return null;

  return (
    <div className="container">
      <InfoResultSentinel></InfoResultSentinel>
      <THead mobile={false}></THead>
      <div className="info-demo">
        <Stats />
        <Table></Table>
      </div>

      <style jsx>
        {`
          .container {
            position: relative;
          }

          @media (min-width: 1300px) {
            .info-demo {
              overflow-y: auto;
              max-height: ${appHeight}px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InfoResult;
