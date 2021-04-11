export const findAndSlice = <T>(cb: (item: T) => boolean, arr: T[]): T[] => {
  const slice: T[] = [];
  let isFound;
  for (const item of arr) {
    if (isFound) {
      slice.push(item);
      continue;
    }

    isFound = cb(item);

    if (isFound) {
      slice.push(item);
    }
  }

  return slice;
};
