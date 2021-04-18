import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputCheckBox from "../../../../../components/InputCheckBox";
import { CONSTANTS } from "../../../../../constants";
import { RootState } from "../../../../../store/rootReducer";
import { filterChildIds } from "../../../ImageResult/demographicsSlice";

const conceptValues = {
  age: CONSTANTS.demographicImg.ageList,
  gender: CONSTANTS.demographicImg.genderList,
  multicultural: CONSTANTS.demographicImg.multiculturalList,
} as { [key: string]: string[] };

type TSelectorProps = {
  id: number;
  type: "filter" | "sort";
  currentConcept: string;
  value: string;
};

const Selector = ({ id, type, currentConcept, value }: TSelectorProps) => {
  const dispatch = useDispatch();

  const conceptAppearance = (currentConcept +
    "-appearance") as "age-appearance";
  const checked = !!useSelector(
    (state: RootState) =>
      // @ts-ignore
      state.demographics.parents[id].tableClassify[type][conceptAppearance][
        value
      ]
  ) as boolean;

  return (
    <div className={`selector ${checked ? "active" : ""}`}>
      <InputCheckBox
        id={""}
        checked={checked}
        label={value}
        onChange={(e) => {
          const target = e.currentTarget as HTMLInputElement;
          // target.checked = !target.checked;

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
      ></InputCheckBox>
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

export const MemoSelectorGroup = React.memo(
  ({ id, currentConcept, type }: Omit<TSelectorProps, "value">) => {
    return (
      <div className="selector-group">
        {conceptValues[currentConcept].map((value, idx) => (
          <Selector
            id={id}
            currentConcept={currentConcept}
            type={type!}
            value={value}
            key={value}
          ></Selector>
        ))}
        <style jsx>
          {`
            .selector-group {
              display: flex;
              flex-wrap: wrap;
              padding: 5px;
            }
          `}
        </style>
      </div>
    );
  }
);

export default Selector;
