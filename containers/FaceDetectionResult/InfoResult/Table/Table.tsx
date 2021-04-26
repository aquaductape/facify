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
import { FireFox, IOS } from "../../../../lib/onFocusOut/browserInfo";
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
        <div className="bg">
          <div className="bg__color"></div>
          <div className="bg__hider-gradient"></div>
        </div>
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

          .bg {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            width: 85px;
            height: 100%;
            z-index: -1;
          }

          .bg__color {
            width: 70px;
          }

          .bg__hider-gradient {
            width: 15px;
            flex-shrink: 0;
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
      {/* dynamic */}
      <style jsx>
        {`
          .bg__color {
            background: ${idx % 2 === 0 ? "#eee" : "#fff"};
          }

          .bg__hider-gradient {
            background: ${idx % 2 === 0
              ? "linear-gradient( 90deg, #eee 0%, rgba(255, 255, 255, 0) 100%)"
              : "linear-gradient( 90deg, #fff 0%, rgba(255, 255, 255, 0) 100%)"};
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

    const onTableScrolling = (position: number) => {
      if (!FireFox || IOS) {
        theadStickyEl!.setAttribute("scroll-left", position.toString());
      }

      theadStickyEl!.scrollLeft = position;
      tableContainerEl.scrollLeft = position;
      if (position > 50) return;
      theadStaticBgScrollingEl!.style.transform = `translate(-${position}px)`;
      theadStickyBgScrollingEl!.style.transform = `translate(-${position}px)`;
    };

    const onScroll = () => {
      const scrollLeft = tableContainerEl.scrollLeft;

      onTableScrolling(scrollLeft);
    };

    const onTouchStart = (e: TouchEvent) => {
      const startClientX =
        e.targetTouches[0].clientX + tableContainerEl.scrollLeft;
      const theadOffsetWidth = tableContainerEl.offsetWidth;

      const onTouchMove = (e: TouchEvent) => {
        // e.preventDefault();
        const diff = startClientX - e.changedTouches[0].clientX;

        if (diff < 0 || diff > theadOffsetWidth) return;

        onTableScrolling(diff);
      };

      const onTouchEnd = () => {
        tableContainerEl.removeEventListener("touchmove", onTouchMove);
        tableContainerEl.removeEventListener("touchend", onTouchEnd);
      };

      tableContainerEl.addEventListener("touchmove", onTouchMove);
      tableContainerEl.addEventListener("touchend", onTouchEnd);
    };

    tableContainerEl.addEventListener("touchstart", onTouchStart);
    tableContainerEl.addEventListener("scroll", onScroll);

    return () => {
      tableContainerEl.removeEventListener("scroll", onScroll);
      tableContainerEl.removeEventListener("touchstart", onTouchStart);
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
            margin-top: -130px;
          }

          .table-scroll-container {
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
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
