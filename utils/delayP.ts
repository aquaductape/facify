export const delayP = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, delay);
  });
