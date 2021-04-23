import { capitalize } from "lodash";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputSelector from "../../../../../components/InputSelector";
import { CONSTANTS } from "../../../../../constants";
import { RootState } from "../../../../../store/rootReducer";
import {
  filterChildIds,
  setSortValue,
  sortChildIds,
  TSortValueType,
} from "../../../ImageResult/demographicsSlice";

const conceptFilterValues = {
  age: CONSTANTS.filterConcepts.ageList,
  gender: CONSTANTS.filterConcepts.genderList,
  multicultural: CONSTANTS.filterConcepts.multiculturalList,
} as { [key: string]: string[] };

const FilterSelector = ({
  id,
  currentConcept,
  onChangeScroll,
  value,
}: Omit<TSelectorProps, "type">) => {
  const dispatch = useDispatch();

  const conceptAppearance = (currentConcept +
    "-appearance") as "age-appearance";

  const checked = !!useSelector(
    (state: RootState) =>
      state.demographics.parents[id].tableClassify.filter.concepts[
        conceptAppearance
      ][value]
  ) as boolean;

  const onChange = () => {
    onChangeScroll();

    dispatch(
      filterChildIds({
        id,
        concept: conceptAppearance,
        value,
      })
    );
  };

  return (
    <Selector
      inputType={"checkbox"}
      onChange={onChange}
      label={value}
      checked={checked}
    ></Selector>
  );
};

const SortSelector = ({
  id,
  type,
  currentConcept,
  label,
  sortValueType,
  action,
}: Omit<TSelectorProps, "type" | "onChangeScroll" | "value"> & {
  type: "sortAction" | "sortValue";
  sortValueType?: TSortValueType;
  label: string;
  action?: string;
}) => {
  const dispatch = useDispatch();

  const conceptAppearance = (currentConcept +
    "-appearance") as "age-appearance";
  // let classifyAction: string | null = "";
  // let sortOnValues:
  //   | {
  //       type: TSortValueType;
  //       active: boolean;
  //     }[]
  //   | null = null;

  // if (type === "sortAction") {
  const classifySort = useSelector(
    (state: RootState) => state.demographics.parents[id].tableClassify.sort
  );
  const classifyAction = classifySort.action;
  // } else {
  const classifyConcept = classifySort.concepts[conceptAppearance];
  const sortOnValues = classifyConcept.values;
  // }
  // const sortOnValues = classifySort.concepts[conceptAppearance].values;

  const inputName =
    currentConcept + (type === "sortAction" ? "-action" : "-value");

  const checked =
    type === "sortAction"
      ? classifyAction === action && classifyConcept.active
      : sortOnValues!.find((value) => value.type === sortValueType)!.active;

  const onChange = () => {
    if (type === "sortAction") {
      dispatch(
        sortChildIds({
          id,
          action: action as "ASC",
          category: currentConcept as "age",
        })
      );
    } else {
      if (classifyAction) {
        dispatch(
          sortChildIds({
            id,
            action: classifyAction as "ASC",
            category: currentConcept as "age",
            sortOnValue: sortValueType!,
          })
        );
        return;
      }

      dispatch(
        setSortValue({
          id,
          category: currentConcept as any,
          value: sortValueType!,
        })
      );
    }
  };

  return (
    <Selector
      inputType="radio"
      label={label}
      name={inputName}
      onChange={onChange}
      checked={checked}
    ></Selector>
  );
};

type TSelectorProps = {
  id: number;
  type: "filter" | "sort";
  currentConcept: string;
  value: string;
  onChangeScroll: () => void;
};

const Selector = ({
  inputType,
  checked,
  label,
  onChange,
  name,
}: {
  inputType: "checkbox" | "radio";
  onChange: () => void;
  label: string;
  checked: boolean;
  name?: string;
}) => {
  const inputSelectorStyle = { checked: "#fff", default: "#4d4d4d" };
  return (
    <div className={`selector ${checked ? "active" : ""}`}>
      <InputSelector
        type={inputType}
        checked={checked}
        name={name}
        label={label}
        onChange={onChange}
        checkColor={{
          static: inputSelectorStyle,
          hover: { checked: inputSelectorStyle.checked, default: "#000" },
        }}
        labelColor={{
          static: inputSelectorStyle,
          hover: { checked: inputSelectorStyle.checked, default: "#000" },
        }}
        padding={"2px 8px"}
      ></InputSelector>
      <style jsx>
        {`
          .selector {
            display: flex;
            margin: 2px;
            background: #e6e6e6;
            transition: background-color 250ms;
          }

          .selector.active {
            background: #354592;
          }

          @media not all and (pointer: coarse) {
            .selector:hover:not(.active) {
              background: #d4d8e1;
            }

            .selector:hover.active {
              background: ${inputType === "checkbox" ? "#4d60b7" : ""};
            }
          }
        `}
      </style>
    </div>
  );
};

const SortSelectors = ({
  id,
  currentConcept,
}: Omit<TSelectorProps, "value" | "onChangeScroll" | "type">) => {
  return (
    <div className="container">
      <div className="direction">
        <div className="title">Direction</div>
        {CONSTANTS.sortActions.slice(0, 2).map((action, idx) => {
          const label = capitalize(
            action === "ASC" ? "ascending" : "descending"
          );
          // const label = action;

          return (
            <SortSelector
              id={id}
              type={"sortAction"}
              currentConcept={currentConcept}
              label={label}
              action={action}
              key={action + idx}
            ></SortSelector>
          );
        })}
      </div>
      <div className="values">
        {CONSTANTS.sortConcepts[currentConcept][0] !== "none" ? (
          <div className="title">Sort By</div>
        ) : null}
        {CONSTANTS.sortConcepts[currentConcept].map((val, idx) => {
          if (val === "none") return;

          return (
            <SortSelector
              id={id}
              type={"sortValue"}
              currentConcept={currentConcept}
              label={capitalize(val)}
              sortValueType={val}
              key={val + idx}
            ></SortSelector>
          );
        })}
      </div>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: 1fr;
          }

          .title {
            font-weight: bold;
            text-align: center;
            padding: 5px 0;
          }

          .direction,
          .values {
            display: flex;
            flex-direction: column;
          }

          .wrapper {
            font-size: 15px;
          }

          @media (min-width: 465px) {
            .container {
              grid-template-columns: 1fr 1fr;
              grid-column-gap: 10px;
            }
          }
        `}
      </style>
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
              <FilterSelector
                id={id}
                currentConcept={currentConcept}
                onChangeScroll={onChangeScroll}
                value={value}
                key={idx}
              ></FilterSelector>
            ))}
          </div>
        ) : (
          <div className="sort-selectors">
            <SortSelectors
              id={id}
              currentConcept={currentConcept}
            ></SortSelectors>
          </div>
        )}
        <style jsx>
          {`
            .filter-selectors {
              display: flex;
              flex-wrap: wrap;
              padding: 5px;
            }

            .sort-selectors {
              padding: 5px;
            }
          `}
        </style>
      </>
    );
  }
);

export default Selector;
