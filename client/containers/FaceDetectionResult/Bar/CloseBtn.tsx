import React, { useEffect, useRef } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import {
  removeParentAndNodeChildren,
  selectParents,
} from "../ImageResult/demographicsSlice";
import { default as CloseBtnIcon } from "../../../components/Logo/svg/CloseBtn";
import {
  removeImageHeight,
  setTriggerRefresh,
} from "../../Table/imageHeightSlice";
import { reflow } from "../../../utils/reflow";

const useBtnRemoveHover = ({
  id,
  idx,
}: {
  id: number;
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
  idx: number;
};
const CloseBtn = ({ id, idx }: CloseBtnProps) => {
  const dispatch = useDispatch();
  const parents = useSelector(selectParents());

  const isFirstItem = () => {
    for (let i = 0; i < parents.length; i++) {
      const parent = parents[i];
      if (parent != null && i !== id) return false;
      if (i === id) return true;
    }
    return false;
  };

  const onClick = async () => {
    const transitionSiblings = parents.slice(id + 1).filter((parent) => parent);
    const siblingsNodes = transitionSiblings.map(
      (parent) => document.getElementById(`demographic-node-${parent.id}`)!
    );
    const targetNode = document.getElementById(`demographic-node-${id}`)!;
    const neighborAfterNode = siblingsNodes[0];
    const mainEl = document.getElementById("main")!;
    const mainBgEl = mainEl.querySelector(".main-bg") as HTMLElement;
    const seperatorEl = neighborAfterNode
      ? (neighborAfterNode.querySelector(".seperator") as HTMLElement)
      : null;
    const gradientEls = neighborAfterNode
      ? (seperatorEl!.querySelectorAll(".gradient") as NodeListOf<HTMLElement>)
      : null;
    const targetNodeBCR = targetNode.getBoundingClientRect();
    const seperatorHeight = 80;
    const duration = 500;
    let targetNodeHeight = Math.ceil(targetNodeBCR.height);

    const animateNodes = () =>
      new Promise<boolean>((resolve) => {
        gradientEls!.forEach((el) => {
          el.classList.toggle("active");
        });

        mainEl.style.clipPath = "polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)";
        targetNode.style.position = "relative";
        targetNode.style.zIndex = "-1";
        mainBgEl.style.transform = `translateY(-${targetNodeHeight}px)`;
        mainBgEl.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        siblingsNodes.forEach((parent) => {
          parent.style.pointerEvents = "none";
          parent.style.transform = `translateY(-${targetNodeHeight}px)`;
          parent.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        });

        setTimeout(() => {
          mainEl.style.clipPath = "";
          targetNode.style.display = "none";
          mainBgEl.style.transform = "";
          mainBgEl.style.transition = "";

          siblingsNodes.forEach((parent) => {
            parent.style.pointerEvents = "";
            parent.style.transform = "";
            parent.style.transition = "";
          });

          gradientEls!.forEach((el) => {
            el.classList.toggle("active");
          });

          resolve(true);
        }, duration + 50);
      });

    const removeSandwichedNode = async () => {
      targetNode.style.pointerEvents = "none";
      await animateNodes();
    };

    const removeTailNode = () =>
      new Promise<boolean>((resolve) => {
        const mainMarginBottom = 50;
        const targeNodeTop = targetNodeBCR.top;
        const viewPortHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const translateDuration = duration;

        targetNode.style.position = "relative";
        targetNode.style.zIndex = "-1";
        targetNode.style.transform = `translateY(-${targetNodeHeight}px)`;
        targetNode.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        mainBgEl.style.transform = `translateY(-${targetNodeHeight}px)`;
        mainBgEl.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        setTimeout(() => {
          targetNode.style.display = "none";
          mainBgEl.style.transform = "";
          mainBgEl.style.transition = "";

          resolve(true);
        }, duration);
      });

    const removeHeadNode = async () => {
      targetNodeHeight += seperatorHeight;
      await animateNodes();
    };

    if (isFirstItem()) {
      await removeHeadNode();
      seperatorEl!.style.display = "none";
    } else if (!neighborAfterNode) {
      // too disorienting
      // await removeTailNode();
    } else {
      await removeSandwichedNode();
    }

    reflow();
    batch(() => {
      dispatch(removeParentAndNodeChildren({ id }));
      dispatch(removeImageHeight({ id }));
      dispatch(setTriggerRefresh(Date.now()));
    });
    // console.log( isFirstItem());
  };

  const { onBlur, onFocus, onMouseEnter, onMouseLeave } = useBtnRemoveHover({
    id,
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
