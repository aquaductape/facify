import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputSelector from "../../../../../components/InputCheckBox";
import { CONSTANTS } from "../../../../../constants";
import { RootState } from "../../../../../store/rootReducer";
import {
  filterChildIds,
  setSortValue,
  sortChildIds,
} from "../../../ImageResult/demographicsSlice";

const conceptFilterValues = {
  age: CONSTANTS.filterConcepts.ageList,
  gender: CONSTANTS.filterConcepts.genderList,
  multicultural: CONSTANTS.filterConcepts.multiculturalList,
} as { [key: string]: string[] };

// const conceptSortValues = {
//
// } as {[key: string]: string}

type TSelectorProps = {
  id: number;
  type: "filter" | "sort";
  currentConcept: string;
  value: string;
  onChangeScroll: () => void;
};

const Selector = ({
  id,
  type,
  currentConcept,
  value,
  onChangeScroll,
}: TSelectorProps) => {
  const dispatch = useDispatch();

  const conceptAppearance = (currentConcept +
    "-appearance") as "age-appearance";

  const checked = !!useSelector(
    (state: RootState) =>
      state.demographics.parents[id].tableClassify.filter.concepts[
        conceptAppearance
      ][value]
  ) as boolean;

  return (
    <div className={`selector ${checked ? "active" : ""}`}>
      <InputSelector
        id={""}
        type={"checkbox"}
        checked={checked}
        label={value}
        onChange={(e) => {
          const target = e.currentTarget as HTMLInputElement;
          // target.checked = !target.checked;
          onChangeScroll();

          dispatch(
            filterChildIds({
              id,
              concept: conceptAppearance,
              value,
            })
          );
        }}
        checkColor={{ active: "#fff", default: "#4d4d4d" }}
        labelColor={{ active: "#fff", default: "#4d4d4d" }}
      ></InputSelector>
      <style jsx>
        {`
          .selector {
            display: flex;
            padding: 2px 8px;
            margin: 2px;
            background: #e6e6e6;
          }

          .selector.active {
            background: #4d4d4d;
          }
        `}
      </style>
    </div>
  );
};

const SortSelectors = ({
  id,
  currentConcept,
  type,
}: Omit<TSelectorProps, "value" | "onChangeScroll">) => {
  const dispatch = useDispatch();
  const conceptAppearance = (currentConcept +
    "-appearance") as "age-appearance";

  const sortOnValues = useSelector(
    (state: RootState) =>
      state.demographics.parents[id].tableClassify.sort.concepts[
        conceptAppearance
      ].values
  );

  return (
    <div>
      <div className="direction"></div>
      <div className="values">
        {sortOnValues.map((val) => {
          return (
            <InputSelector
              id={""}
              type={"radio"}
              name={currentConcept}
              checked={val.active}
              label={val.type}
              onChange={(e) => {
                dispatch(
                  setSortValue({
                    id,
                    category: currentConcept as any,
                    value: val.type,
                  })
                );
              }}
              checkColor={{ active: "#fff", default: "#4d4d4d" }}
              labelColor={{ active: "#fff", default: "#4d4d4d" }}
            ></InputSelector>
          );
        })}
      </div>
    </div>
  );
};

export const MemoSelectorGroup = React.memo(
  ({
    id,
    currentConcept,
    type,
    onChangeScroll,
  }: Omit<TSelectorProps, "value">) => {
    return (
      <>
        {type === "filter" ? (
          <div className="filter-selectors">
            {conceptFilterValues[currentConcept].map((value, idx) => (
              <Selector
                id={id}
                currentConcept={currentConcept}
                onChangeScroll={onChangeScroll}
                type={type!}
                value={value}
                key={value}
              ></Selector>
            ))}
          </div>
        ) : (
          <SortSelectors
            id={id}
            currentConcept={currentConcept}
            type={type}
          ></SortSelectors>
        )}
        <style jsx>
          {`
            .filter-selectors {
              display: flex;
              flex-wrap: wrap;
              padding: 5px;
            }
          `}
        </style>
      </>
    );
  }
);

export default Selector;
