import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CloseBtn from "../../../components/Logo/svg/CloseBtn";
import Stats from "../../Stats/Stats";
import { selectName } from "../../UploadImageForm/imageUrlSlice";

export const useBtnRemoveHover = ({
  id,
  idx,
}: {
  id: string;
  idx: number;
}): {
  onMouseLeave: () => void;
  onMouseEnter: () => void;
  onFocus: () => void;
  onBlur: () => void;
} => {
  const btnShadowElRef = useRef<HTMLElement | null>(null);

  const onChangeColor = (active: boolean) => {
    if (idx === 0) return;

    const el = btnShadowElRef.current!;
    el.style.color = active ? "#d5daea" : "";
  };
  const onMouseEnter = () => onChangeColor(true);
  const onMouseLeave = () => onChangeColor(false);
  const onFocus = () => onChangeColor(true);
  const onBlur = () => onChangeColor(false);

  useEffect(() => {
    if (idx === 0) return;

    btnShadowElRef.current = document.querySelector(
      `[data-id-close-btn-shadow="${id}"]`
    );
  }, []);

  return { onMouseLeave, onMouseEnter, onFocus, onBlur };
};

const Bar = ({ id, idx }: { id: string; idx: number }) => {
  const imageName = useSelector(selectName({ id }));

  const { onBlur, onFocus, onMouseEnter, onMouseLeave } = useBtnRemoveHover({
    id,
    idx,
  });

  return (
    <div className="bar">
      <div className="title">
        <div className="title-number">{idx + 1}</div>
        <div className="title-name">{imageName}</div>
      </div>
      <div className="stats">
        <Stats id={id}></Stats>
      </div>
      <button
        className="btn-remove"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <CloseBtn></CloseBtn>
      </button>
      <style jsx>
        {`
          .bar {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
          }

          .title {
            display: flex;
            align-items: center;
          }

          .title-number {
            color: #888;
            font-size: 28px;
            margin: 0 15px;
            font-weight: bold;
          }

          .title-name {
            font-size: 18px;
            max-width: 225px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .stats {
            position: absolute;
            top: 0;
            left: 50%;
            height: 100%;
            display: none;
          }

          .btn-remove {
            height: 45px;
            width: 45px;
            background: #efefef;
            border: 3px solid #efefef;
            transition: border-color 250ms;
          }

          .btn-remove:hover,
          .btn-remove:focus {
            border-color: #b0b7cf;
          }

          .btn-remove:focus {
            outline: 3px solid #000;
            outline-offset: 2px;
          }

          @media (min-width: 1300px) {
            .title-number {
              font-size: 30px;
              margin: 0 20px;
              margin-right: 35px;
            }
            .title-name {
              font-size: 20px;
              max-width: 500px;
            }

            .stats {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Bar;
