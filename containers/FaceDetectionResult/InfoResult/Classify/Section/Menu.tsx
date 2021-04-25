import { capitalize } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircleDot from "../../../../../components/svg/CircleDot";
import { CONSTANTS } from "../../../../../constants";
import { RootState } from "../../../../../store/rootReducer";
import isObjEmpty from "../../../../../utils/isObjEmpty";
import { resetFilter, resetSort } from "../../../ImageResult/demographicsSlice";
import Selector, { MemoSelectorGroup } from "./Selector";

type TMenuProps = {
  id: string;
  parentIdx: number;
  type: "sort" | "filter" | null;
};

let globalCurrentConcept = "age";

const Menu = ({ id, parentIdx, type }: TMenuProps) => {
  const dispatch = useDispatch();
  const [currentConcept, setCurrentConcept] = useState(globalCurrentConcept);
  const currentConceptAppearance = `${currentConcept}-appearance`;
  const dirty = useSelector(
    (state: RootState) =>
      state.demographics.parents[parentIdx].tableClassify.dirty
  );

  const onClickConcept = (concept: string) => {
    globalCurrentConcept = concept;
    setCurrentConcept(concept);
  };
  const demographicNodePositionRef = useRef<number | null>(null);

  const onChangeScroll = useCallback(() => {
    const { scrollY } = window;
    const padding = 45;
    if (!demographicNodePositionRef.current) {
      const demographicNodeEl = document.getElementById(
        `demographic-node-${id}`
      )!;
      demographicNodePositionRef.current =
        demographicNodeEl.getBoundingClientRect().top + scrollY - padding;
    }

    if (demographicNodePositionRef.current > scrollY) return;
    window.scrollTo({ top: demographicNodePositionRef.current });
  }, []);

  const onClickReset = (e: React.MouseEvent, concept: string) => {
    e.stopPropagation(); // workaround onFocusOut bug, although there are other workarounds https://stackoverflow.com/a/43885664/8234457
    // luckily I don't need bubbling for anyting else for this btn
    // another workaround is keeping JSX and hiding it by display none, that way the bubbling target is connected in the DOM

    if (type === "filter") {
      dispatch(resetFilter({ id: parentIdx, concept: concept as any }));
    }

    if (type === "sort") {
      dispatch(resetSort({ id: parentIdx }));
    }
  };

  const isDirty = (concept: string) => dirty[type!][concept + "-appearance"];

  const concepts =
    type === "filter" ? CONSTANTS.concepts.slice(1) : CONSTANTS.concepts;

  if (type === "filter" && currentConcept === "face") {
    globalCurrentConcept = "age";
    setCurrentConcept("age");
    return null;
  }

  return (
    <div className="container">
      <div className="title">{capitalize(type as string)}</div>
      <div className="content">
        <div className="column column-concepts">
          {concepts.map((concept, idx) => {
            return (
              <button
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
              </button>
            );
          })}
          {!isObjEmpty(dirty[type!]) ? (
            <button
              className="btn-reset column-concepts__btn-reset"
              onClick={(e) => onClickReset(e, "all")}
            >
              Reset
            </button>
          ) : null}
        </div>
        <div className="column column-inputs">
          <MemoSelectorGroup
            id={parentIdx}
            currentConcept={currentConcept}
            type={type!}
            onChangeScroll={onChangeScroll}
          ></MemoSelectorGroup>
          {dirty[type!][currentConceptAppearance] && type === "filter" ? (
            <button
              className="btn-reset column-inputs__btn-reset"
              onClick={(e) => onClickReset(e, currentConcept)}
            >
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
            border: 0;
            background: #fff;
            position: relative;
            display: flex;
            align-items: center;
            font-size: 16px;
            padding-left: 8px;
            width: 100%;
            height: 40px;
            transition: background-color 250ms;
          }

          .concept.active {
            background: #b7b7b7;
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
            border: 3px solid #555;
            padding: 2px 18px;
            color: #555;
            font-size: 16px;
            transition: background-color 250ms, color 250ms;
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

          @media not all and (pointer: coarse) {
            .concept:hover:not(.active) {
              background: #eee;
            }

            .btn-reset:hover {
              color: #fff;
              background: #555;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Menu;
