import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";

type TInputSelectorProps = {
  id?: string;
  type: "checkbox" | "radio";
  label: string;
  checked: boolean;
  name?: string;
  onChange: ChangeEventHandler;
  checkColor: {
    static: {
      default: string;
      checked: string;
    };
    hover?: {
      default: string;
      checked: string;
    };
  };
  labelColor: {
    static: {
      default: string;
      checked: string;
    };
    hover?: {
      default: string;
      checked: string;
    };
  };
  padding?: string;
};

const InputSelector = ({
  id,
  type,
  name,
  label,
  checked,
  onChange,
  checkColor,
  labelColor,
  padding = "",
}: TInputSelectorProps) => {
  const [focused, setFocused] = useState(false);

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!e.key.match(/tab|left|right|up|down/i)) return;
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  return (
    <label
      className={`checkbox-button ${focused ? "focused" : ""} ${
        checked ? "checked" : ""
      }`}
    >
      <input
        type={type}
        name={name}
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
            {type === "checkbox" ? (
              <>
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".529"
                  strokeLinecap="square"
                  strokeDashoffset="16.97"
                  d="M.265.265h4.763v4.763H.265z"
                />
                <path
                  className={"icon__fill"}
                  fill="currentColor"
                  d="M1.587 1.588h2.117v2.117H1.587z"
                />
              </>
            ) : (
              <>
                <circle
                  cx={2.646}
                  cy={2.646}
                  r={2.382}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.527}
                  strokeLinecap="square"
                  strokeDashoffset={16.97}
                />
                <circle
                  className={"icon__fill"}
                  fill="currentColor"
                  cx={2.646}
                  cy={2.646}
                  r={1.059}
                />
              </>
            )}
          </g>
        </svg>
      </span>
      <span className={"checkbox-button__label"}>{label}</span>
      <style jsx>
        {`
          .checkbox-button {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            width: 100%;
            height: 100%;
            padding: ${padding};
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
            color: ${checkColor.static.default};
            transition: color 250ms;
          }

          .icon__fill {
            transform: scale(0);
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 250ms;
          }

          .checkbox-button.checked .icon__fill {
            transform: scale(1);
          }

          .checkbox-button__label {
            color: ${labelColor.static.default};
            transition: color 250ms;
          }

          .checkbox-button.checked .checkbox-button__label {
            color: ${labelColor.static.checked};
          }

          .checkbox-button.checked .checkbox-button__control {
            color: ${checkColor.static.checked};
          }

          @media not all and (pointer: coarse) {
            .checkbox-button:hover .checkbox-button__label {
              color: ${labelColor.hover ? labelColor.hover.default : ""};
            }

            .checkbox-button.checked:hover .checkbox-button__label {
              color: ${labelColor.hover ? labelColor.hover.checked : ""};
            }

            .checkbox-button:hover .checkbox-button__control {
              color: ${checkColor.hover ? checkColor.hover.default : ""};
            }

            .checkbox-button.checked:hover .checkbox-button__control {
              color: ${checkColor.hover ? checkColor.hover.checked : ""};
            }
          }
        `}
      </style>
    </label>
  );
};

export default InputSelector;
