import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";

type TInputCheckBoxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: ChangeEventHandler;
  checkColor?: {
    default: string;
    active: string;
  };
  labelColor?: {
    default: string;
    active: string;
  };
};
const InputCheckBox = ({
  id,
  label,
  checked,
  onChange,
  checkColor = { active: "var(--blue-main)", default: "#666" },
  labelColor = { active: "currentColor", default: "currentColor" },
}: TInputCheckBoxProps) => {
  const [focused, setFocused] = useState(false);

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!e.key.match(/(tab)/i)) return;
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  return (
    <label className={`checkbox-button ${focused ? "focused" : ""}`}>
      <input
        type="checkbox"
        className="checkbox-button__input"
        onChange={onChange}
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        checked={checked}
        id={id}
      />
      <span className="checkbox-button__control">
        <svg
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 5.292 5.292"
        >
          <g paintOrder="markers fill stroke">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth=".529"
              strokeLinecap="square"
              strokeDashoffset="16.97"
              d="M.265.265h4.763v4.763H.265z"
            />
            <path
              className={`icon__fill ${checked ? "active" : ""}`}
              fill="currentColor"
              d="M1.587 1.588h2.117v2.117H1.587z"
            />
          </g>
        </svg>
      </span>
      <span className={`checkbox-button__label ${checked ? "active" : ""}`}>
        {label}
      </span>
      <style jsx>
        {`
          .checkbox-button {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
          }

          .checkbox-button.focused {
            outline: 3px solid #000;
            outline-offset: 3px;
          }

          input[type="checkbox"] {
            box-sizing: border-box;
            padding: 0;
          }

          input {
            border-radius: 0;
            outline: 0;
            width: 0;
            height: 0;
            margin: 0;
            flex-basis: 0;
            opacity: 0;
            background-color: transparent;
          }

          .checkbox-button__control {
            position: relative;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 15px;
            height: 15px;
            margin-right: 12px;
            vertical-align: middle;
            color: ${checkColor.default};
          }

          .icon__fill {
            transform: scale(0);
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 250ms;
          }

          .icon__fill.active {
            transform: scale(1);
          }

          .checkbox-button__label {
            color: ${labelColor.default};
            transition: color 250ms;
          }

          .checkbox-button__label.active {
            color: ${labelColor.active};
            transition: color 250ms;
          }

          .checkbox-button__input:checked + .checkbox-button__control {
            color: ${checkColor.active};
          }
        `}
      </style>
    </label>
  );
};

export default InputCheckBox;
