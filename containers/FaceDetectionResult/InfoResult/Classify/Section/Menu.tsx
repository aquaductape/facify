import { capitalize } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ScrollShadow,
  SentinelShadow,
} from "../../../../../components/ScrollShadow";
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
  const scrollShadowElsRef = useRef<{
    top: { current: HTMLDivElement | null };
    bottom: { current: HTMLDivElement | null };
  }>({
    top: { current: null },
    bottom: { current: null },
  });
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

        <div className="column-inputs-container">
          <ScrollShadow
            top={true}
            scrollShadowElsRef={scrollShadowElsRef}
          ></ScrollShadow>
          <div className="column-inputs">
            <MemoSelectorGroup
              id={parentIdx}
              currentConcept={currentConcept}
              type={type!}
              onChangeScroll={onChangeScroll}
            ></MemoSelectorGroup>
            <SentinelShadow
              top={true}
              scrollShadowElsRef={scrollShadowElsRef}
            ></SentinelShadow>
            <SentinelShadow
              top={false}
              scrollShadowElsRef={scrollShadowElsRef}
            ></SentinelShadow>
          </div>
          <div className="sticky-bottom-container">
            <ScrollShadow
              top={false}
              scrollShadowElsRef={scrollShadowElsRef}
            ></ScrollShadow>
            {dirty[type!][currentConceptAppearance] && type === "filter" ? (
              <div className="btn-reset-container">
                <div className="btn-shadow"></div>
                <button
                  className="btn-reset  column-inputs__btn-reset"
                  onClick={(e) => onClickReset(e, currentConcept)}
                >
                  Reset
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .container {
            height: 100%;
          }

          .content {
            display: flex;
            height: calc(100% - 25px);
          }

          .column-concepts {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 95px;
            height: 100%;
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

          .column-inputs-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .column-inputs {
            position: relative;
            overflow-x: auto;
            width: 100%;
            height: 100%;
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
            position: relative;
            background: #fff;
            border: 3px solid #555;
            padding: 2px 18px;
            color: #555;
            font-size: 16px;
            transition: background-color 250ms, color 250ms;
            z-index: 2;
          }

          .column-inputs__btn-reset {
            z-index: 15;
          }

          .column-concepts__btn-reset {
            margin-top: auto;
            margin-bottom: 5px;
          }

          .btn-reset-container {
            position: absolute;
            right: 0;
            bottom: 0;
            padding: 5px;
          }

          .btn-shadow {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: #fff;
            box-shadow: 0 0 6px 4px #fff;
            z-index: -1;
          }

          .sticky-bottom-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 1;
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
