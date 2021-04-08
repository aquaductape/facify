import { MutableRefObject } from "react";
import { TDownloadMenuItemHandler } from "../DownloadMenuItem";
import { TQueue } from "../Loader";

type TDisplayCountDown = {
  active: boolean;
  enabled: boolean;
};

export const updateDownloadMenuItemQueue = (
  props: Partial<TQueue>,
  {
    downloadMenuItemHandlerRef,
    idx,
  }: {
    idx: number;
    downloadMenuItemHandlerRef: MutableRefObject<TDownloadMenuItemHandler>;
  }
) => {
  const downloadMenuItemHandler = downloadMenuItemHandlerRef.current[idx];

  if (downloadMenuItemHandler) {
    downloadMenuItemHandler.downloadQueue = {
      ...downloadMenuItemHandler.downloadQueue!,
      ...props,
    };
  } else {
    downloadMenuItemHandlerRef.current[idx] = {
      downloadQueue: props as TQueue,
    } as any;
  }

  if (!downloadMenuItemHandler || !downloadMenuItemHandler.setDownloadQueue) {
    return;
  }

  downloadMenuItemHandler.setDownloadQueue((prev) => {
    if (!prev) return props as TQueue;
    return { ...prev!, ...props };
  });
};

export const updateDownloadMenuItemDisplayCountDown = (
  props: Partial<TDisplayCountDown>,
  {
    downloadMenuItemHandlerRef,
    idx,
  }: {
    idx: number;
    downloadMenuItemHandlerRef: MutableRefObject<TDownloadMenuItemHandler>;
  }
) => {
  const downloadMenuItemHandler = downloadMenuItemHandlerRef.current[idx];

  if (downloadMenuItemHandler) {
    if (!downloadMenuItemHandler.displayCountDown) {
      downloadMenuItemHandler.displayCountDown = {
        active: false,
        enabled: true,
        ...props,
      };
    } else {
      downloadMenuItemHandler.displayCountDown = {
        ...downloadMenuItemHandler.displayCountDown,
        ...props,
      };
    }
  } else {
    downloadMenuItemHandlerRef.current[idx] = {
      displayCountDown: { active: false, enabled: true, ...props },
    } as any;
  }

  // if (!openMenu) return;
  if (
    !downloadMenuItemHandler ||
    !downloadMenuItemHandler.setDisplayCountDown
  ) {
    return;
  }

  downloadMenuItemHandler.setDisplayCountDown((prev) => {
    if (!prev) return props as TDisplayCountDown;
    return { ...prev!, ...props };
  });
};
