import { TMqlGroup } from "../../hooks/useMatchMedia";
import { IOS, Safari } from "../../lib/onFocusOut/browserInfo";
import { reflow } from "../../utils/reflow";
import smoothScrollTo from "../../utils/smoothScrollTo";

type TStartAnimate = {
  firstImage: boolean;
};

export const startAnimate = ({ firstImage }: TStartAnimate) =>
  new Promise<boolean>((resolve) => {
    // if (!firstImage) return resolve(true);

    const landingEl = document.getElementById("landing")!;
    const mainEl = document.getElementById("main")!;
    const mainBgEl = mainEl.querySelector(".main-bg") as HTMLElement;
    // const viewportHeight = window.innerHeight;
    // const scrollHeight = document.body.scrollHeight;

    // const isContentOverflow = scrollHeight > viewportHeight;

    const run = () => {
      landingEl.style.position = "absolute";
      landingEl.style.top = "0";
      landingEl.style.left = "0";
      landingEl.style.width = "100%";
      landingEl.style.height = "auto";
      mainBgEl.style.opacity = "0";
      mainBgEl.style.height = `${mainBgEl.clientHeight}px`;

      if (!firstImage) {
        mainEl.style.clipPath = "polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)";
      }

      resolve(true);
    };

    if (firstImage) {
      smoothScrollTo({
        destination: 0,
        duration: 180,
        easing: "easeInOutQuad",
        onEnd: () => {
          run();
        },
      });
      return;
    }

    run();
  });

type TAnimationEnd = {
  id?: string;
};
export const animationEnd = ({ id }: TAnimationEnd = {}) => {
  const mainEl = document.getElementById("main")!;
  const mainBgEl = mainEl.querySelector(".main-bg") as HTMLElement;
  const logo = document.getElementById("logo")!;
  const demographicEl = document.getElementById(`demographic-node-${id}`)!;
  const landingEl = document.getElementById("landing")!;

  if (demographicEl) {
    demographicEl.style.transform = "";
    demographicEl.style.transition = "";
    demographicEl.style.zIndex = "";
  }
  landingEl.style.display = "none";
  landingEl.style.transform = "";
  landingEl.style.transition = "";
  landingEl.style.zIndex = "";
  logo.style.background = "";
  mainEl.style.clipPath = "";
  mainBgEl.style.opacity = "";
  mainBgEl.style.height = "";
};

type TAnimateResult = {
  id: string;
  mql: TMqlGroup;
  firstImage: boolean;
};
export const animateResult = ({ id, firstImage, mql }: TAnimateResult) => {
  if (!firstImage) return;

  const run = () => {
    const demographicEl = document.getElementById(`demographic-node-${id}`)!;
    const landingEl = document.getElementById("landing")!;
    const demographicHeight = demographicEl.clientHeight;
    const landingHeight = landingEl.clientHeight;

    if (mql.minWidth_1900_and_minHeight_850.matches) {
      const logo = document.getElementById("logo")!;
      const facesBoundingBoxes = document.querySelector(
        ".faces-bounding-boxes"
      ) as HTMLElement;

      logo.style.background = "var(--blue-main)";
      facesBoundingBoxes.style.transform = "translateX(-100%)";
      facesBoundingBoxes.style.transition = "transform 500ms";
    } else {
      const mainEl = document.getElementById("main")!;
      mainEl.style.clipPath = "polygon(0% 100vh, 0% 0%, 100% 0%, 100% 100vh)";
    }

    // For Safari, the descision is that landing will always translate up and reveal result behind it. There's an issue where either demographicHeight/landingHeight is not correct, so it will translate/zindex the wrong elements. Unable to solve it since I don't have a Mac to do thorough debugging, that's why I hardcoded the result using IOS var.
    if (landingHeight > demographicHeight || IOS || Safari) {
      demographicEl.style.opacity = "1";
      demographicEl.style.zIndex = "-1";
      landingEl.style.zIndex = "65";
      landingEl.style.transform = `translateY(-101%)`;
      landingEl.style.transition = "transform 500ms";
    } else {
      landingEl.style.zIndex = "-1";
      demographicEl.style.opacity = "1";
      demographicEl.style.transform = "translateY(-100%)";
      reflow();
      demographicEl.style.transform = "translateY(0%)";
      demographicEl.style.transition = "transform 500ms";
    }
  };

  run();

  setTimeout(() => {
    animationEnd({ id });
  }, 500);
};
