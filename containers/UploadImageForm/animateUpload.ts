import { TMqlGroup } from "../../hooks/useMatchMedia";
import { reflow } from "../../utils/reflow";
import smoothScrollTo from "../../utils/smoothScrollTo";

type TStartAnimate = {
  firstImage: boolean;
};

let landingHeight = 0;

export const startAnimate = ({ firstImage }: TStartAnimate) =>
  new Promise<boolean>((resolve) => {
    if (!firstImage) return resolve(true);

    console.log("startAimate", { firstImage });
    const landingEl = document.getElementById("landing")!;
    landingHeight = landingEl.clientHeight;
    const mainEl = document.getElementById("main")!;
    const mainBgEl = mainEl.querySelector(".main-bg") as HTMLElement;
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.body.scrollHeight;

    const isContentOverflow = scrollHeight > viewportHeight;

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

    if (firstImage && isContentOverflow) {
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
    // const landingHeight = landingEl.clientHeight;

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

    if (landingHeight > demographicHeight) {
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

  if (firstImage) {
    setTimeout(() => {
      run();

      setTimeout(() => {
        animationEnd({ id });
      }, 500);
    }, 200);
    return;
  }
};
