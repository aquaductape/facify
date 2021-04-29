import { CONSTANTS } from "../../../../constants";
import smoothScrollTo from "../../../../utils/smoothScrollTo";

type TOnClickJumpToImage = {
  id: string;
  goToNext: (props?: {
    clearCurrentTimout?: boolean | undefined;
    enableCountDown?: boolean | undefined;
  }) => void;
  closeLoaderWhenDone: (props?: { fireNow?: boolean | undefined }) => void;
  isLast: boolean;
};

export const onClickJumpToImage = ({
  id,
  goToNext,
  closeLoaderWhenDone,
  isLast,
}: TOnClickJumpToImage) => {
  if (isLast) {
    closeLoaderWhenDone!({ fireNow: true });
    console.log("is last");
    jumpToEl(id);
    return;
  }

  jumpToEl(id);

  goToNext({ clearCurrentTimout: true });
};

const jumpToEl = (id: string) => {
  const nodeSelector = `demographic-node-${id}`;
  const nodeEl = document.getElementById(nodeSelector)!;
  const prevNodeEl = nodeEl.previousElementSibling;
  let destination = 0;
  const {
    uploadImageFormHeight,
    viewportTopPadding,
    seperatorHeight,
  } = CONSTANTS;

  if (!prevNodeEl) {
    destination = uploadImageFormHeight + viewportTopPadding;
    console.log({ destination });
  } else {
    destination =
      prevNodeEl.getBoundingClientRect().bottom +
      window.scrollY -
      (uploadImageFormHeight + viewportTopPadding) +
      seperatorHeight;
  }

  smoothScrollTo({ destination, duration: 300 });
};
