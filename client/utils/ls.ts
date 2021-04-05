export const loadFromLocalStorage = <T>(key: string): T | undefined => {
  if (typeof window !== "object") return undefined;
  try {
    const serialisedState = localStorage.getItem(key);
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (err) {
    console.warn(err);
    return undefined;
  }
};

export const saveToLocalStorage = ({
  key,
  value,
}: {
  key: string;
  value: any;
}) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.log(err);
  }
};
