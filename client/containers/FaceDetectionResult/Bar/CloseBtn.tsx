import React, { useEffect, useRef } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import {
  removeParentAndNodeChildren,
  selectParents,
} from "../ImageResult/demographicsSlice";
import { default as CloseBtnIcon } from "../../../components/Logo/svg/CloseBtn";
import { removeImageHeight } from "../../Table/imageHeightSlice";

const useBtnRemoveHover = ({
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

type CloseBtnProps = {
  id: number;
  _id: string;
  idx: number;
};
const CloseBtn = ({ id, _id, idx }: CloseBtnProps) => {
  const dispatch = useDispatch();
  const parents = useSelector(selectParents());

  const onClick = () => {
    const parentsSlice = parents.slice(idx);
    console.log(parentsSlice);
    batch(() => {
      dispatch(removeParentAndNodeChildren({ id }));
      dispatch(removeImageHeight({ id }));
    });
  };

  const { onBlur, onFocus, onMouseEnter, onMouseLeave } = useBtnRemoveHover({
    id: _id,
    idx,
  });
  return (
    <button
      className="btn-remove"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
    >
      <CloseBtnIcon></CloseBtnIcon>
      <style jsx>
        {`
          .btn-remove {
            height: 45px;
            width: 45px;
            background: #efefef;
            border: 3px solid #efefef;
            outline: none;
            transition: border-color 250ms;
          }

          .btn-remove:hover {
            border-color: #b0b7cf;
          }

          .btn-remove.focus-visible {
            border-color: #b0b7cf;
            outline: 3px solid #000;
            outline-offset: 3px;
            z-index: 100;
          }
        `}
      </style>
    </button>
  );
};

export default CloseBtn;
