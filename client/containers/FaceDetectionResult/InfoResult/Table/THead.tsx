import { capitalize } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sorting from "../../../../components/svg/Sorting";
import { CONSTANTS } from "../../../../constants";
import { RootState } from "../../../../store/rootReducer";
import getScrollbarWidth from "../../../../utils/getScrollWidth";
import {
  sortChildIds,
  TSortValueType,
} from "../../ImageResult/demographicsSlice";

const THChildEl = ({
  parentIdx,
  idx,
  type,
  item,
}: Omit<THeadProps, "id"> & {
  idx: number;
  item: string;
}) => {
  const dispatch = useDispatch();
  const sort = useSelector(
    (state: RootState) =>
      state.demographics.parents[parentIdx].tableClassify.sort
  );
  const [actionQueue] = useState(() => {
    const actions = CONSTANTS.sortActions;
    const result: {
      action: "ASC" | "DESC" | "Initial";
      value: TSortValueType;
    }[] = [];
    const sortConcept = CONSTANTS.sortConcepts[item];

    sortConcept.forEach((sortValue) => {
      actions.slice(0, actions.length - 1).forEach((action) => {
        result.push({ action: action as "ASC", value: sortValue });
      });
    });

    result.push({
      action: actions[actions.length - 1] as "Initial",
      value: sortConcept[0],
    });

    return result;
  });

  const actionQueueIdxRef = useRef(0);
  const itemAppearance = item + "-appearance";

  const onClick = () => {
    const currentQueue = actionQueue[actionQueueIdxRef.current];
    actionQueueIdxRef.current =
      (actionQueueIdxRef.current + 1) % actionQueue.length;

    dispatch(
      sortChildIds({
        id: parentIdx,
        action: currentQueue.action,
        sortOnValue: currentQueue.value,
        category: item as any,
      })
    );
  };

  const theadClickProp = idx !== 0 ? { onClick } : {};

  useEffect(() => {
    if (sort.concepts[itemAppearance].active) return;
    actionQueueIdxRef.current = 0;
  }, [sort.concepts]);

  return (
    <>
      {type === "sticky" ? (
        <div
          className={`th ${idx === 0 ? "thead-image" : ""}`}
          onClick={() => idx !== 0 && onClick()}
          key={idx}
        >
          {idx !== 0 ? <span className="buffer"></span> : null}
          {idx === 0 ? (
            <span className="sticky-dynamic-btn" onClick={onClick}>
              <span className="bg-static">
                <div className="bg-static-color"></div>
                <div className="bg-static__hider-gradient"></div>
              </span>
              <span className="bg-scrolling"></span>
            </span>
          ) : null}
          <span className="name">{capitalize(item)}</span>
          {sort.action && sort.concepts[itemAppearance].active ? (
            <span className="sorting-icon">
              <Sorting
                action={sort.action as any}
                show={
                  sort.concepts[itemAppearance].values.find(
                    (value) => value.active
                  )!.type
                }
              ></Sorting>
            </span>
          ) : null}
        </div>
      ) : (
        <th
          className={`th ${idx === 0 ? "thead-image" : ""}`}
          {...theadClickProp}
          key={idx}
        >
          {idx !== 0 ? <span className="buffer"></span> : null}
          {idx === 0 ? (
            <span className="sticky-dynamic-btn" onClick={onClick}>
              <span className="bg-static">
                <div className="bg-static__color"></div>
                <div className="bg-static__hider-gradient"></div>
              </span>
              <span className="bg-scrolling"></span>
            </span>
          ) : null}
          <span className="name">{capitalize(item)}</span>
          {sort.action && sort.concepts[itemAppearance].active ? (
            <span className="sorting-icon">
              <Sorting
                action={sort.action as any}
                show={
                  sort.concepts[itemAppearance].values.find(
                    (value) => value.active
                  )!.type
                }
              ></Sorting>
            </span>
          ) : null}
        </th>
      )}
      <style jsx>
        {`
          .th {
            position: relative;
            text-align: left;
            padding: 8px 0;
            height: 100%;
            cursor: pointer;
            transition: background-color 250ms;
          }

          .buffer {
            background: #fff;
            position: absolute;
            top: 0;
            left: -10px;
            width: 10px;
            height: 100%;
            transition: background-color 250ms;
          }

          .sorting-icon {
            position: relative;
            top: 1px;
            display: inline-flex;
            height: 15px;
            width: 30px;
            margin-left: 8px;
            transform: scale(1.25);
            animation: ${"Appear"} 400ms;
          }

          .thead-image {
            position: sticky;
            top: 0;
            left: 0;
            width: 120px;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
          }

          .thead-image .name {
            display: inline-block;
            position: relative;
            pointer-events: none;
            padding-left: 10px;
          }

          .sticky-dynamic-btn {
            position: absolute;
            top: 0;
            left: 0;
            width: 110px;
            height: 100%;
            padding: 0;
          }

          .bg-static {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            width: 85px;
            height: 100%;
            padding: 0;
          }

          .bg-static__color {
            width: 70px;
            background: #fff;
            transition: background-color 250ms;
            pointer-events: all;
          }

          .bg-static__hider-gradient {
            flex-shrink: 0;
            width: 15px;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0) 100%
            );
          }

          .bg-scrolling {
            position: absolute;
            top: 0;
            left: 70px;
            background: #fff;
            width: 40px;
            height: 100%;
            padding: 0;
            pointer-events: all;
            transition: background-color 250ms;
          }

          @media not all and (pointer: coarse) {
            .th:hover .bg-static__color,
            .th:hover .bg-scrolling {
              background: #d8deef;
            }

            .th.thead-image:hover {
              background: transparent;
            }

            .th:hover {
              background: #d8deef;
            }

            .th:hover .buffer {
              background: #d8deef;
            }
          }
        `}
      </style>
    </>
  );
};

type THeadProps = {
  id: string;
  parentIdx: number;
  type?: "sticky";
};

const THead = ({ id, parentIdx, type }: THeadProps) => {
  const theadStickyElRef = useRef<HTMLDivElement | null>(null);
  const thead = ["face", "age", "gender", "multicultural"];

  useEffect(() => {
    if (type !== "sticky") return;
    const theadStickyEl = theadStickyElRef.current!;
    const tableSelector = `[data-id-table="${id}"]`;
    const tableScrollSelector = ".table-scroll-container";
    const tableScrollEl = document
      .querySelector(tableSelector)
      ?.querySelector(tableScrollSelector) as HTMLElement;

    const onScroll = () => {
      tableScrollEl.scrollLeft = theadStickyEl.scrollLeft;
    };

    // Why I chose wheel instead of scroll event
    // When table overflow is scrolled, it also scrolls this container, this would
    // fire this container's scroll event which is unneccessary.
    // Will cause reseting parent's scrollLeft back to 0 bug, when thead sticky el is transition in and out of states. See `forceRestoreScrollPosition()` for more details of this bug.
    theadStickyEl.addEventListener("wheel", onScroll);
    return () => {
      theadStickyEl.removeEventListener("wheel", onScroll);
    };
  }, []);

  if (type !== "sticky") {
    return (
      <thead data-id-static-thead={id} className="thead">
        <tr>
          {thead.map((item, idx) => (
            <THChildEl
              parentIdx={parentIdx}
              idx={idx}
              item={item}
              type={type}
              key={idx}
            ></THChildEl>
          ))}
        </tr>
        <style jsx>
          {`
            .thead {
              border-top: 1px solid #d5d5d5;
            }
          `}
        </style>
      </thead>
    );
  }

  return (
    <div
      data-id-sticky-thead={id}
      ref={theadStickyElRef}
      className={"container"}
    >
      <div
        className="thead-container"
        data-triggered-by-info-result="false"
        data-triggered-by-thead="false"
      >
        {thead.map((item, idx) => (
          <THChildEl
            parentIdx={parentIdx}
            idx={idx}
            item={item}
            type={type}
            key={idx}
          ></THChildEl>
        ))}
      </div>

      <style jsx>
        {`
          .container {
            position: sticky;
            top: 0;
            left: 0;
            height: 45px;
            margin-top: -125px;
            margin-bottom: 80px;
            clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%);
            overflow: hidden;
            pointer-events: none;
            top: 0;
            overflow-x: scroll;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* Internet Explorer 10+ and Legacy Edge */

            z-index: 5;
          }

          .container::-webkit-scrollbar {
            /* WebKit */
            width: 0;
            height: 0;
          }

          .thead-container {
            display: grid;
            grid-template-columns: 120px 1fr 1fr 1fr;
            border-top: 1px solid #d5d5d5;
            height: 38px;
            min-width: 700px;
            font-weight: bold;
            text-align: left;
            background: #fff;
            box-shadow: 0 12px 12px -15px #000;
            pointer-events: all;
            transform: translateY(-125%);
            transition: transform 250ms;
          }

          @media (min-width: 1300px) {
            .container {
              top: 60px;
              margin-top: 0;
              clip-path: polygon(0% 100%, 0% 0%, 1300px 0%, 1300px 100%);
            }
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          @media (min-width: 1300px) {
            .container {
              width: ${`calc(100% - ${getScrollbarWidth()}px)`};
            }
          }
        `}
      </style>
    </div>
  );
};

export default THead;
