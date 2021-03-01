import { forwardRef, useState } from "react";

type InputProps = {
  value: string;
  onInputChange: (e: InputEvent) => void;
  placeholder: string;
  error: boolean;
  submitBtnHover: boolean;
};

const Input = forwardRef(
  (
    { onInputChange, value, placeholder, error, submitBtnHover }: InputProps,
    ref: any
  ) => {
    const [inputFocused, setInputFocused] = useState(false);

    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Tab") return;
      setInputFocused(true);
    };

    const onBlur = () => {
      setInputFocused(false);
    };

    return (
      <div className="container">
        <div className="container-inner">
          <div className="gradient blue"></div>
          <div className="gradient black"></div>
          <div className="gradient red-error"></div>
          <input
            ref={ref}
            autoFocus
            spellCheck="false"
            value={value}
            onChange={onInputChange as any}
            className="input-url"
            type="text"
            placeholder={placeholder}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
          />
        </div>
        <style jsx>
          {`
            .container {
              flex-grow: 1;
            }

            .container-inner {
              position: relative;
              left: -5px;
              width: calc(100% + 5px);
              height: 100%;
              padding: 5px 0;
              padding-left: 5px;
              background: #102466fc;
              overflow: hidden;
            }

            .gradient {
              position: absolute;
              top: 0;
              left: 0;
              width: 200%;
              height: 100%;
              transition: transform ease-in-out 450ms;
            }

            .blue {
              background: linear-gradient(
                90deg,
                #c6c6c6,
                #102466fc 50%,
                #102466fc
              );
            }

            .black {
              background: linear-gradient(90deg, #102466fc, #000 50%, #000);
            }
            .red-error {
              background: linear-gradient(90deg, #000, red 50%, red);
            }

            .black,
            .red-error {
              transform: translateX(101%);
            }

            input {
              position: relative;
              display: block;
              height: 100%;
              width: 100%;
              padding: 0 5px;
              border: 0;
              outline: none;
            }

            input:focus::placeholder {
              color: #000;
              font-weight: bold;
            }

            .container:hover .blue,
            .container:focus-within .blue {
              transform: translateX(-100%);
            }

            .container:focus {
              background: #000;
            }
          `}
        </style>
        {/* dynamic */}
        <style jsx>
          {`
            .container {
              ${inputFocused
                ? `
              outline: 3px solid #000;
              outline-offset: 4px;
              z-index: 2;
            `
                : ""}
            }

            input::placeholder {
              color: ${error ? "red !important" : ""};
            }

            .blue {
              transform: ${error ? "translateX(-100%)" : ""};
            }

            .red-error {
              transform: ${error ? "translateX(-50%)" : ""};
            }

            .black {
              transform: ${submitBtnHover ? "translateX(-50%)" : ""};
            }

            .blue {
              transform: ${submitBtnHover ? "translateX(-100%)" : ""};
            }

            .black {
              transform: ${error ? "translateX(101%)" : ""};
            }
          `}
        </style>
      </div>
    );
  }
);

export default Input;
