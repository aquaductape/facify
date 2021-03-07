export const hasAttributeValue = (
  el: HTMLElement | Element,
  { attr, val }: { attr: string; val: string }
) => {
  const attrResult = el.getAttribute(attr);
  if (!attrResult) return false;
  return attrResult === val;
};
