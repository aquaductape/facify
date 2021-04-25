import React, { useEffect, useRef } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { removeParentAndNodeChildren } from "../ImageResult/demographicsSlice";
import { default as CloseBtnIcon } from "../../../components/svg/CloseBtn";
import {
  removeImageHeight,
  setTriggerRefresh,
} from "../InfoResult/Table/imageHeightSlice";
import { reflow } from "../../../utils/reflow";
import { theadObserver } from "../InfoResult/Table/useCreateObserver";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { RootState } from "../../../store/rootReducer";

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
  id: string;
  idx: number;
};
const CloseBtn = ({ id, idx }: CloseBtnProps) => {
  const dispatch = useDispatch();
  const parents = useSelector((state: RootState) => state.demographics.parents);

  const mqlRef = useMatchMedia();

  const isFirstItem = () => {
    return parents[0].id === id;
  };

  const onClick = async () => {
    const transitionSiblings = parents.slice(idx + 1);
    const siblingsNodes = transitionSiblings.map(
      (parent) => document.getElementById(`demographic-node-${parent.id}`)!
    );
    const targetNode = document.getElementById(`demographic-node-${id}`)!;
    const neighborAfterNode = siblingsNodes[0];
    const isLastNode = parents.length === 1;
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
    // const easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
    const easing = "linear";
    let targetNodeHeight = Math.ceil(targetNodeBCR.height);

    const animateLastNode = () =>
      new Promise<boolean>((resolve) => {
        const landingEl = document.getElementById("landing")!;
        const targetNodeHeight = targetNode.clientHeight;
        const logo = document.getElementById("logo")!;
        const facesBoundingBoxes = document.querySelector(
          ".faces-bounding-boxes"
        ) as HTMLElement;

        targetNode.style.position = "relative";
        landingEl.style.display = "block";
        landingEl.style.pointerEvents = "none";
        landingEl.style.opacity = "0";
        mainBgEl.style.opacity = "0";

        if (mqlRef.current!.minWidth_1900_and_minHeight_850.matches) {
          logo.style.background = "var(--blue-main)";
          facesBoundingBoxes.style.transform = "translateX(-100%)";
          reflow();
          facesBoundingBoxes.style.transform = "translateX(0%)";
          facesBoundingBoxes.style.transition = `transform ${duration}ms`;
        } else {
          mainEl.style.clipPath = `polygon(0% 100vh, 0% 0%, 100% 0%, 100% 100vh)`;
        }

        reflow();

        const landingHeight = landingEl.clientHeight;

        if (landingHeight > targetNodeHeight) {
          targetNode.style.zIndex = "-1";
          landingEl.style.opacity = "1";
          landingEl.style.zIndex = "65";
          landingEl.style.transform = "translateY(-101%)";
          reflow();
          landingEl.style.transform = "translateY(0%)";
          landingEl.style.transition = `transform ${duration}ms`;
        } else {
          landingEl.style.opacity = "1";
          landingEl.style.zIndex = "-1";
          targetNode.style.transition = `transform ${duration}ms`;
          targetNode.style.transform = "translateY(-100%)";
        }

        setTimeout(() => {
          logo.style.background = "";

          if (mqlRef.current?.minWidth_1900_and_minHeight_850) {
            facesBoundingBoxes.style.transform = "";
            facesBoundingBoxes.style.transition = "";
          }

          landingEl.style.position = "";
          landingEl.style.transform = "";
          landingEl.style.transition = "";
          landingEl.style.opacity = "";
          landingEl.style.pointerEvents = "";
          landingEl.style.zIndex = "";
          mainEl.style.clipPath = "";
          mainBgEl.style.opacity = "";

          resolve(true);
        }, duration + 50);
      });

    const animateNodes = () =>
      new Promise<boolean>((resolve) => {
        neighborAfterNode.style.background = "none";
        gradientEls!.forEach((el) => {
          el.classList.toggle("active");
        });

        mainEl.style.clipPath = "polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)";
        targetNode.style.position = "relative";
        targetNode.style.zIndex = "-1";
        mainBgEl.style.transition = `transform ${duration}ms ${easing}`;

        siblingsNodes.forEach((parent) => {
          parent.style.pointerEvents = "none";
          parent.style.transition = `transform ${duration}ms ${easing}`;
        });

        reflow();

        requestAnimationFrame(() => {
          mainBgEl.style.transform = `translateY(-${targetNodeHeight}px)`;

          siblingsNodes.forEach((parent) => {
            parent.style.transform = `translateY(-${targetNodeHeight}px)`;
          });
        });

        setTimeout(() => {
          mainEl.style.clipPath = "";
          targetNode.style.display = "none";
          neighborAfterNode.style.background = "";
          // targetNode.style.pointerEvents = "";
          // targetNode.style.opacity = "1";
          // targetNode.style.zIndex = "";

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
      await animateNodes();
    };

    const removeTailNode = () =>
      new Promise<boolean>((resolve) => {
        // const mainMarginBottom = 50;
        // const targeNodeTop = targetNodeBCR.top;
        // const viewPortHeight = window.innerHeight;
        // const scrollY = window.scrollY;
        // const translateDuration = duration;

        targetNode.style.position = "relative";
        targetNode.style.zIndex = "-1";
        targetNode.style.transform = `translateY(-${targetNodeHeight}px)`;
        targetNode.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        mainBgEl.style.opacity = "0";
        mainEl.style.clipPath = "polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)";

        setTimeout(() => {
          targetNode.style.display = "none";
          mainEl.style.clipPath = "";
          mainBgEl.style.opacity = "";

          resolve(true);
        }, duration + 50);
      });

    const removeHeadNode = async () => {
      targetNodeHeight += seperatorHeight;
      await animateNodes();
    };

    targetNode.style.pointerEvents = "none";

    theadObserver.disconnect();

    if (isLastNode) {
      await animateLastNode();
    } else if (isFirstItem()) {
      await removeHeadNode();
      seperatorEl!.style.display = "none";
    } else if (!neighborAfterNode) {
      await removeTailNode();
    } else {
      await removeSandwichedNode();
    }

    reflow();

    theadObserver.reconnect();

    batch(() => {
      dispatch(removeParentAndNodeChildren({ id: idx }));
      dispatch(removeImageHeight({ id }));
      dispatch(setTriggerRefresh(Date.now()));
    });
  };

  const { onBlur, onFocus, onMouseEnter, onMouseLeave } = useBtnRemoveHover({
    id,
    idx,
  });
  return (
    <button
      className="btn-remove"
      aria-label="remove image section result"
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
            padding: 10px;
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
