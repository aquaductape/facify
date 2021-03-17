import { useSelector, shallowEqual } from "react-redux";
import BoundingCroppedImage from "../FaceDetectionResult/BoundingCroppedImage/BoundingCroppedImage";
import ScrollShadow from "./ScrollShadow";
import { HorizontalSentinel, THeadSentinel } from "./Sentinel";
import { parseConceptValue } from "../../utils/parseConcept";
import {
  selectDemographicParentChildIds,
  selectDemographicsConcepts,
} from "../FaceDetectionResult/ImageResult/demographicsSlice";
import { useEffect, useRef } from "react";
import { querySelector } from "../../utils/querySelector";

type TRowProps = {
  id: string;
  parentId: string;
  parentIdNumber: number;
  idx: number;
};
const Row = ({ id, parentIdNumber, parentId, idx }: TRowProps) => {
  const concepts = useSelector(selectDemographicsConcepts({ id }));

  const {
    "age-appearence": age,
    "gender-appearance": gender,
    "multicultural-appearance": multicultural,
  } = concepts;

  return (
    <tr className="row">
      <td className="td-image">
        <BoundingCroppedImage
          id={id}
          parentId={parentId}
          parentIdNumber={parentIdNumber}
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
      <style jsx>
        {`
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
        `}
      </style>
    </tr>
  );
};

const Table = ({ id, idx }: { id: string; idx: number }) => {
  const parentId = id;
  const parentIdNumber = idx;
  const demographicParent = useSelector(
    selectDemographicParentChildIds({ id: idx })
  );
  const tableContainerElRef = useRef<HTMLDivElement | null>(null);
  const thead = ["Face", "Age", "Gender", "Multicultural"];

  useEffect(() => {
    const tableContainerEl = tableContainerElRef.current!;
    let theadEl: HTMLElement | null = null;

    const run = async () => {
      theadEl = await querySelector({
        selector: `[data-id-thead-sticky="${id}"]`,
      });
    };

    run();

    const onScroll = () => {
      theadEl!.scrollTo({ left: tableContainerEl.scrollLeft });
    };

    tableContainerEl.addEventListener("scroll", onScroll);
    return () => {
      tableContainerEl.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div data-id-table={id} className="table-container">
      <ScrollShadow id={id}></ScrollShadow>
      <div className="table-scroll-container" ref={tableContainerElRef}>
        <div className="table-container-inner">
          <HorizontalSentinel id={id}></HorizontalSentinel>
          <THeadSentinel id={id}></THeadSentinel>
          <table>
            <thead data-id-static-thead={id} className="thead">
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
              {demographicParent.map((item, idx) => (
                <Row
                  id={item}
                  parentId={parentId}
                  parentIdNumber={parentIdNumber}
                  idx={idx}
                  key={idx}
                ></Row>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>
        {`
          .table-container {
            position: relative;
            margin-top: -125px;
          }

          .table-scroll-container {
            overflow-x: auto;
            overflow-y: hidden;
          }

          .table-container-inner {
            position: relative;
            min-width: 700px;
          }

          table {
            background: #fff;
            position: relative;
            width: 100%;
            table-layout: fixed;
            border: 0px;
            border-collapse: collapse;
            border-spacing: 0px;
          }

          .thead {
            border-top: 1px solid #d5d5d5;
          }

          .thead th {
            text-align: left;
            padding: 8px 0;
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
            .table-container {
              margin-top: 0;
            }

            .table-scroll-container {
              overflow-x: hidden;
              overflow-y: auto;
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
