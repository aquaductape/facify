import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../../../../components/svg/Filter";
import Sort from "../../../../components/svg/Sort";
import { useMatchMedia } from "../../../../hooks/useMatchMedia";
import { RootState } from "../../../../store/rootReducer";
import smoothScrollTo from "../../../../utils/smoothScrollTo";
import { setClassifyDisplay } from "./classifySlice";

type TClassifyDropdownBtns = { id: string; parentIdx: number };

const ClassifyDropdownBtns = ({ id, parentIdx }: TClassifyDropdownBtns) => {
  const dispatch = useDispatch();
  const classify = useSelector((state: RootState) => state.classify);
  const mqlGroup = useMatchMedia();

  const onClickBtn: MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.currentTarget as HTMLButtonElement;
    const type = target.dataset.value as "filter" | "sort";
    const imageSelection = `[data-id-image-result="${id}"]`;
    const imageEl = document.querySelector(imageSelection) as HTMLElement;
    const imageBCR = imageEl.getBoundingClientRect();
    const location = mqlGroup.current?.minWidth_1300.matches
      ? "bar"
      : ("viewport" as "bar" | "viewport");

    const open = (classify.type !== type && classify.open) || !classify.open;

    if (location === "bar") {
      dispatch(
        setClassifyDisplay({
          id,
          parentIdx,
          open,
          type,
          location,
        })
      );
      return;
    }

    if (imageBCR.top < 60 && !classify.open) {
      const padding = 50; // to prevent slight nudge down, which will close dropdown
      const destination =
        window.scrollY - Math.abs(imageBCR.top - 60) - padding;
      smoothScrollTo({
        destination,
        duration: 200,
        onEnd: () => {
          dispatch(
            setClassifyDisplay({
              id,
              parentIdx,
              open,
              type,
              location,
            })
          );
        },
      });

      return;
    }

    dispatch(setClassifyDisplay({ id, parentIdx, open, type, location }));
  };

  const isActive = (value: "filter" | "sort") => {
    return classify.id === id && classify.type === value && classify.open
      ? "active"
      : "";
  };

  return (
    <div className="container">
      <button
        data-value="filter"
        className={`filter-icon ${isActive("filter")}`}
        onClick={onClickBtn}
      >
        <Filter></Filter>
      </button>
      <button
        data-value="sort"
        className={`sort-icon ${isActive("sort")}`}
        onClick={onClickBtn}
      >
        <Sort></Sort>
      </button>
      <style jsx>
        {`
          button {
            border: 0;
            margin: 0;
            pointer-events: all;
          }

          .container {
            display: flex;
            justify-content: center;
            height: 100%;
            width: 100%;
          }

          .filter-icon,
          .sort-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 45px;
            height: 100%;
            padding: 5px;
            user-select: none;
            background: #fff;
            outline: 0;
            transition: background-color 250ms, color 250ms;
          }

          .filter-icon.active,
          .sort-icon.active {
            background: #666666;
            color: #fff;
          }
          .filter-icon.active :global(.icon-filter_scrubber-neck) {
            fill: #aaa;
          }

          @media not all and (pointer: coarse) {
            .filter-icon:hover,
            .sort-icon:hover {
              background: #ddd;
            }

            :global(.icon-filter_scrubber-neck) {
              transition: fill 250ms;
            }

            .filter-icon:hover:not(.active)
              :global(.icon-filter_scrubber-neck) {
              fill: #999;
            }
            .filter-icon.active:hover,
            .sort-icon.active:hover {
              background: #555;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ClassifyDropdownBtns;
