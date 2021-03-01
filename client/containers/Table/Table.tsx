import { useSelector } from "react-redux";
import BoundingCroppedImage from "../FaceDetectionResult/BoundingCroppedImage/BoundingCroppedImage";
import { RootState } from "../../store/rootReducer";
import ScrollShadow from "./ScrollShadow";
import { HorizontalSentinel, THeadSentinel } from "./Sentinel";
import { parseConceptValue } from "../../utils/parseConcept";
import THead from "./THead";

const Table = () => {
  const demographics = useSelector(
    (state: RootState) => state.demographics.demographics
  );
  const thead = ["Face", "Age", "Gender", "Multicultural"];

  return (
    <div className="table-container">
      <THead mobile={false}></THead>
      <ScrollShadow></ScrollShadow>
      <div className="table-scroll-container">
        <THead mobile={true}></THead>
        <div className="table-container-inner">
          <HorizontalSentinel></HorizontalSentinel>
          <THeadSentinel></THeadSentinel>
          <table>
            <thead className="thead">
              <tr>
                {thead.map((item, idx) => {
                  return (
                    <th className={idx === 0 ? "thead-image" : ""} key={idx}>
                      {idx === 0 ? <span className="bg"></span> : null}
                      <span>{item}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {demographics.map(({ id, bounding_box, concepts }, idx) => {
                const {
                  "age-appearence": age,
                  "gender-appearance": gender,
                  "multicultural-appearance": multicultural,
                } = concepts;

                return (
                  <tr className="row" key={id + idx}>
                    <td className="td-image">
                      <BoundingCroppedImage
                        id={id}
                        bounding_box={bounding_box}
                        concepts={concepts}
                        idx={idx}
                      />
                    </td>
                    <td>
                      {age.map(({ id, name, value }, idx) => (
                        <TdInnerValue
                          name={name}
                          value={value}
                          idx={idx}
                          key={id}
                        ></TdInnerValue>
                      ))}
                    </td>
                    <td>
                      {gender.map(({ id, name, value }, idx) => (
                        <TdInnerValue
                          name={name}
                          value={value}
                          idx={idx}
                          key={id}
                        ></TdInnerValue>
                      ))}
                    </td>
                    <td>
                      {multicultural.map(({ id, name, value }, idx) => (
                        <TdInnerValue
                          name={name}
                          value={value}
                          idx={idx}
                          key={id}
                        ></TdInnerValue>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>
        {`
          .table-container {
            position: relative;
          }

          .table-scroll-container {
            overflow-x: auto;
          }

          .table-container-inner {
            position: relative;
            min-width: 700px;
          }

          table {
            position: relative;
            width: 100%;
            table-layout: fixed;
            border: 0px;
            border-collapse: collapse;
            border-spacing: 0px;
          }

          .thead {
            border-bottom: 1px solid #000;
          }

          .thead th {
            text-align: left;
            padding: 8px 0;
          }

          .row:nth-child(odd) {
            background: #eee;
          }

          td {
            min-height: 90px;
            padding: 10px 0;
          }

          .td-image {
            position: sticky;
            top: 0;
            left: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
          }

          .thead-image {
            position: sticky;
            top: 0;
            left: 0;
            width: 120px;
            overflow: hidden;
          }

          .thead-image span {
            display: inline-block;
            position: relative;
            background: #fff;
            padding: 0 10px;
            padding-right: 20px;
          }

          .thead-image .bg {
            position: absolute;
            top: 0;
            left: calc(-100% + 5px);
            background: #fff;
            width: 100%;
            height: 100%;
          }

          @media (min-width: 1300px) {
            .table-scroll-container {
              overflow-x: hidden;
            }
          }
        `}
      </style>
    </div>
  );
};

type TdInnerValueProps = {
  name: string;
  value: number;
  idx: number;
};

const TdInnerValue = ({ name, value, idx }: TdInnerValueProps) => {
  name = name.replace("_", " ");
  return (
    <div className="container">
      <span>{name}</span>: <span>{parseConceptValue(value)}</span>
      <style jsx>{``}</style>
      {/* dynamic */}
      <style jsx>
        {`
          .container {
            font-size: 18px;
            opacity: ${idx === 0 ? "1" : "0.6"};
          }
        `}
      </style>
    </div>
  );
};
export default Table;
