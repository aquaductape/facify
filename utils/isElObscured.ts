/**
 * basic detection, doesn't have support if el is obscured by child
 * @returns boolean
 */
const isElObscured = (el: HTMLElement) => {
  const elBCR = el.getBoundingClientRect();
  // get element at element's position
  const elFromPoint = document.elementFromPoint(elBCR.x, elBCR.y);
  const obscured = !el.contains(elFromPoint);

  return {
    obscured,
    targetBCR: elBCR,
    targetFromPointBCR: obscured ? elFromPoint!.getBoundingClientRect() : elBCR,
  };
};
export default isElObscured;
