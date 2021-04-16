import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import Filter from "../../../../components/svg/Filter";
import Sort from "../../../../components/svg/Sort";

type TClassifyDropdownBtns = {};

const ClassifyDropdownBtns = ({}: TClassifyDropdownBtns) => {
  const onClickBtn: MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.currentTarget as HTMLButtonElement;
    const type = target.dataset.value;
  };

  return (
    <div className="container">
      <button data-value="filter" className="filter-icon" onClick={onClickBtn}>
        <Filter></Filter>
      </button>
      <button data-value="sort" className="sort-icon" onClick={onClickBtn}>
        <Sort></Sort>
      </button>
      <style jsx>
        {`
          button {
            border: 0;
            margin: 0;
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
            transition: background-color 250ms;
          }

          @media not all and (pointer: coarse) {
            .filter-icon:hover,
            .sort-icon:hover {
              background: #ddd;
            }

            :global(.icon-filter_scrubber-neck) {
              transition: fill 250ms;
            }

            .filter-icon:hover :global(.icon-filter_scrubber-neck) {
              fill: #999;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ClassifyDropdownBtns;
