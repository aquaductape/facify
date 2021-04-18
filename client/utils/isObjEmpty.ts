// https://stackoverflow.com/a/59787784/8234457
const isObjEmpty = (obj: {}) => {
  for (const i in obj) return false;

  return true;
};

export default isObjEmpty;
