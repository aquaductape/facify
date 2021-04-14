import { useSelector, shallowEqual } from "react-redux";
import BoundingCroppedImage from "../FaceDetectionResult/BoundingCroppedImage/BoundingCroppedImage";
import ScrollShadow from "./ScrollShadow";
import { HorizontalSentinel, THeadSentinel } from "./Sentinel";
import { parseConceptValue } from "../../utils/parseConcept";
import {
  selectDemographicParentChildIds,
  selectDemographicsConcepts,
} from "../FaceDetectionResult/ImageResult/demographicsSlice";
import { useEffect, useRef, useState } from "react";
import { querySelector } from "../../utils/querySelector";
import { TConcept } from "../../ts";
import { FireFox } from "../../lib/onFocusOut/browserInfo";
import THead from "./THead";
import { RootState } from "../../store/rootReducer";

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

  // filterConceptsSlice

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
  let demographicParentChildIds = useSelector(
    selectDemographicParentChildIds({ id: idx })
  );
  const sortedChildIds = useSelector(
    (state: RootState) =>
      state.demographics.parents[idx].tableClassify.sort.childIds
  );

  if (sortedChildIds) {
    demographicParentChildIds = sortedChildIds;
  }
  const tableContainerElRef = useRef<HTMLDivElement | null>(null);

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
      const scrollLeft = tableContainerEl.scrollLeft;

      if (!FireFox) {
        theadEl!.setAttribute("scroll-left", scrollLeft.toString());
      }

      theadEl!.scrollLeft = scrollLeft;
    };

    tableContainerEl.addEventListener("scroll", onScroll);
    return () => {
      tableContainerEl.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!demographicParentChildIds.length) return <div>No Faces Found :(</div>;

  return (
    <div data-id-table={id} className="table-container">
      <ScrollShadow id={id}></ScrollShadow>
      <div className="table-scroll-container" ref={tableContainerElRef}>
        <div className="table-container-inner">
          <HorizontalSentinel id={id}></HorizontalSentinel>
          <THeadSentinel id={id}></THeadSentinel>
          <table>
            <THead id={id} parentIdx={parentIdNumber}></THead>
            <tbody>
              {demographicParentChildIds.map((item, idx) => (
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
