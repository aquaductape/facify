import { TConcept } from "../ts";

const parseConceptValue = (value: number) => {
  value = value * 100;
  const strValue = value.toString();
  let renderValue = strValue;
  const periodIndex = strValue.indexOf(".");

  if (periodIndex !== -1) {
    renderValue = strValue.slice(0, periodIndex) + "%";
  }

  return renderValue;
};

type TParseProps = {
  concepts: {
    [key: string]: TConcept[];
  };
  faceNumber?: number | null;
};
const parseConcept = ({ concepts, faceNumber }: TParseProps) => {
  const faceStr = faceNumber != null ? "Face" : "Human Face";
  let msg = `${faceStr}${faceNumber != null ? faceNumber : ""}: `;
  const numRegex = /^[0-9\-]+$/;

  for (const conceptKey in concepts) {
    const concept = concepts[conceptKey];

    if (concept.length) {
      msg += `${conceptKey.replace(/\-|_/g, " ")}: `;
      // msg += ` ${concept.length} ${concept.length === 1 ? "value" : "values"}`;
    }
    concept.forEach(({ name, value }, idx) => {
      const valueStr = parseConceptValue(value);
      const end = idx === concept.length - 1 ? "" : ", ";
      if (!numRegex.test(name)) name = name.replace(/\-|_/g, " ");
      msg += `${name} ${valueStr}${end}`;
    });

    msg += ". ";
  }

  return msg;
};
export { parseConceptValue, parseConcept };
