import { capitalize } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import CircleDot from "../../../../../components/svg/CircleDot";
import { CONSTANTS } from "../../../../../constants";
import { RootState } from "../../../../../store/rootReducer";
import isObjEmpty from "../../../../../utils/isObjEmpty";
import Selector, { MemoSelectorGroup } from "./Selector";

type TMenuProps = {
  id: string;
  parentIdx: number;
  type: "sort" | "filter" | null;
};

const Menu = ({ id, parentIdx, type }: TMenuProps) => {
  const [currentConcept, setCurrentConcept] = useState("age");
  const currentConceptAppearance = `${currentConcept}-appearance`;
  const dirty = useSelector(
    (state: RootState) =>
      state.demographics.parents[parentIdx].tableClassify.dirty
  );

  const onClickConcept = (concept: string) => {
    setCurrentConcept(concept);
  };

  const isDirty = (concept: string) => dirty[type!][concept + "-appearance"];

  return (
    <div className="container">
      <div className="title">{capitalize(type as string)}</div>
      <div className="content">
        <div className="column column-concepts">
          {CONSTANTS.demographicImg.concepts.slice(1).map((concept, idx) => {
            return (
              <div
                onClick={() => onClickConcept(concept)}
                className={`concept ${
                  concept === "multicultural" ? "small" : ""
                } ${concept === currentConcept ? "active" : ""}`}
                key={idx}
              >
                {isDirty(concept) ? (
                  <span className="dirty-notification">
                    <CircleDot></CircleDot>
                  </span>
                ) : null}
                <span className="concept-text">{capitalize(concept)}</span>
              </div>
            );
          })}
          {!isObjEmpty(dirty[type!]) ? (
            <button className="btn-reset column-concepts__btn-reset">
              Reset
            </button>
          ) : null}
        </div>
        <div className="column column-inputs">
          <MemoSelectorGroup
            id={parentIdx}
            currentConcept={currentConcept}
            type={type!}
          ></MemoSelectorGroup>
          {dirty[type!][currentConceptAppearance] ? (
            <button className="btn-reset column-inputs__btn-reset">
              Reset
            </button>
          ) : null}
        </div>
      </div>
      <style jsx>
        {`
          .container {
          }

          .content {
            display: flex;
          }

          .column.column-concepts {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 95px;
            flex-shrink: 0;
            border-right: 1px solid #999;
          }

          .concept {
            position: relative;
            display: flex;
            align-items: center;
            font-size: 16px;
            padding-left: 8px;
            width: 100%;
            height: 45px;
          }

          .concept.active {
            background: #ccc;
          }

          .concept.small {
            font-size: 15px;
          }

          .column.column-inputs {
            position: relative;
            overflow-x: auto;
            width: 100%;
            height: 195px;
          }

          .title {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 25px;
            border-bottom: 1px solid #999;
          }

          .dirty-notification {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 8px;
            padding: 0 2px;
            height: 100%;
          }

          .btn-reset {
            background: #fff;
            border: 3px solid #999;
            padding: 2px 15px;
          }

          .column-concepts__btn-reset {
            margin-top: auto;
            margin-bottom: 5px;
          }
          .column-inputs__btn-reset {
            position: absolute;
            right: 5px;
            bottom: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default Menu;
