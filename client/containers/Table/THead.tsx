import { capitalize } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import getScrollbarWidth from "../../utils/getScrollWidth";
import { sortChildIds } from "../FaceDetectionResult/ImageResult/demographicsSlice";

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
  const actionQueue = ["ASC", "DESC", "Initial"] as (
    | "ASC"
    | "DESC"
    | "Initial"
  )[];
  const actionQueueIdxRef = useRef(0);

  const onClick = () => {
    const actionQueueIdx = actionQueueIdxRef.current;
    const currentAction = actionQueue[actionQueueIdx];

    actionQueueIdxRef.current = (actionQueueIdxRef.current + 1) % 3;
    console.log(actionQueueIdxRef);

    dispatch(
      sortChildIds({
        id: parentIdx,
        action: currentAction,
        category: item as any,
      })
    );
  };

  const theadClickProp = idx !== 0 ? { onClick } : {};

  useEffect(() => {
    if (sort.category === item) return;
    actionQueueIdxRef.current = 0;
  }, [sort.category]);

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
              <span className="bg-static"></span>
              <span className="bg-scrolling"></span>
            </span>
          ) : null}
          <span className="name">{capitalize(item)}</span>
          <span
            className={`sort-active ${
              sort.action && sort.category === item
                ? sort.action.toLowerCase()
                : ""
            }`}
          >
            V
          </span>
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
              <span className="bg-static"></span>
              <span className="bg-scrolling"></span>
            </span>
          ) : null}
          <span className="name">{capitalize(item)}</span>
          <span
            className={`sort-active ${
              sort.action && sort.category === item
                ? sort.action.toLowerCase()
                : ""
            }`}
          >
            V
          </span>
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

          .sort-active {
            display: inline-block;
            padding-left: 8px;
            transform: scaleY(0);
            transition: transform 250ms;
          }

          .sort-active.asc {
            transform: scaleY(1);
          }

          .sort-active.desc {
            transform: scaleY(-1);
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
            background: #fff;
            width: 70px;
            height: 100%;
            padding: 0;
            pointer-events: all;
            transition: background-color 250ms;
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
            .th:hover .bg-static,
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
  const thead = ["face", "age", "gender", "multicultural"];

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
    <div data-id-sticky-thead={id} className={`container`}>
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
            margin-bottom: 80px;
            clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%);
            overflow: hidden;
            pointer-events: none;
            top: 0;
            z-index: 5;
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
