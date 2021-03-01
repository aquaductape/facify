import { useSelector } from "react-redux";
import Table from "../../Table/Table";
import { RootState } from "../../../store/rootReducer";
import Stats from "../../Stats/Stats";
import { appHeight } from "../../../constants";

const InfoResult = () => {
  const imageUrl = useSelector((state: RootState) => state.imageUrl);

  if (imageUrl.elOnLoadStatus !== "DONE") return null;

  return (
    <div className="info-demo">
      <Stats />
      <Table></Table>
      <style jsx>
        {`
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
