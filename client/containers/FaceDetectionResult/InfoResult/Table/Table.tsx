import { useSelector, shallowEqual } from "react-redux";
import BoundingCroppedImage from "../../BoundingCroppedImage/BoundingCroppedImage";
import ScrollShadow from "./ScrollShadow";
import { HorizontalSentinel, THeadSentinel } from "./Sentinel";
import { parseConceptValue } from "../../../../utils/parseConcept";
import {
  selectDemographicParentChildIds,
  selectDemographicsConcepts,
} from "../../ImageResult/demographicsSlice";
import { useEffect, useRef, useState } from "react";
import { querySelector } from "../../../../utils/querySelector";
import { TConcept } from "../../../../ts";
import { FireFox } from "../../../../lib/onFocusOut/browserInfo";
import THead from "./THead";
import { RootState } from "../../../../store/rootReducer";
import { createSelector } from "reselect";

type TRowProps = {
  id: string;
  parentId: string;
  parentIdNumber: number;
  idx: number;
};

// const selectDemographics = (id: string ) => {
//
//   return createSelector(
//     (state: RootState) => state.demographics.demographicNodes,
//     (result) => {
//       return result[id].concepts;
//     }
//   );
// }
const Row = ({ id, parentIdNumber, parentId, idx }: TRowProps) => {
  const concepts = useSelector(selectDemographicsConcepts({ id }));
  const isRemoved = useSelector(
    (state: RootState) => state.demographics.demographicNodes[id].removed
  );

  const {
    "age-appearance": age,
    "gender-appearance": gender,
    "multicultural-appearance": multicultural,
  } = concepts;

  // filterConceptsSlice

  if (isRemoved) return null;

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
  const demographicParentChildIds = useSelector(
    selectDemographicParentChildIds({ id: idx })
  );
  const sortedChildIds = useSelector(
    (state: RootState) =>
      state.demographics.parents[idx].tableClassify.sort.childIds
  );

  let renderChildIds: string[] = [];

  if (sortedChildIds) {
    renderChildIds = sortedChildIds;
  } else {
    renderChildIds = demographicParentChildIds;
  }
  const tableContainerElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tableContainerEl = tableContainerElRef.current!;
    let theadStickyEl: HTMLElement | null = null;
    let theadStaticEl: HTMLElement | null = null;
    let theadStaticBgScrollingEl: HTMLElement | null = null;
    let theadStickyBgScrollingEl: HTMLElement | null = null;

    const run = async () => {
      theadStickyEl = await querySelector({
        selector: `[data-id-sticky-thead="${id}"]`,
      });
      theadStaticEl = await querySelector({
        selector: `[data-id-static-thead="${id}"]`,
        parent: tableContainerEl,
      });
      theadStaticBgScrollingEl = await querySelector({
        selector: ".bg-scrolling",
        parent: theadStaticEl!,
      });
      theadStickyBgScrollingEl = await querySelector({
        selector: ".bg-scrolling",
        parent: theadStickyEl!,
      });
    };

    run();

    const onScroll = () => {
      const scrollLeft = tableContainerEl.scrollLeft;

      if (!FireFox) {
        theadStickyEl!.setAttribute("scroll-left", scrollLeft.toString());
      }

      theadStickyEl!.scrollLeft = scrollLeft;
      if (scrollLeft > 50) return;
      theadStaticBgScrollingEl!.style.transform = `translate(-${scrollLeft}px)`;
      theadStickyBgScrollingEl!.style.transform = `translate(-${scrollLeft}px)`;
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
              {renderChildIds.map((item, idx) => (
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
