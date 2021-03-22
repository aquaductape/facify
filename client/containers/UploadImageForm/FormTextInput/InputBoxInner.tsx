import { nanoid } from "nanoid";
import { ChangeEvent, ForwardedRef, forwardRef, useState } from "react";
import { useDispatch } from "react-redux";
import ArrowToRight from "../../../components/svg/ArrowToRight";
import { addUrlItem } from "../formSlice";

type TInputBoxInner = {
  onOpenInput: () => void;
  isOpenRef: React.MutableRefObject<boolean>;
  placeholder: string;
  error: boolean;
};
const InputBoxInner = forwardRef(
  (
    { onOpenInput, isOpenRef, placeholder, error }: TInputBoxInner,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const dispatch = useDispatch();

    const [value, setValue] = useState("");
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setValue(value);

      onInputChange(value);
    };

    const onInputChange = (value: string) => {
      const hasSpace = value.match(/\s/);
      const urls = value.split(" ").filter((item) => item);

      if (urls.length && hasSpace) {
        setValue("");

        dispatch(
          addUrlItem(
            urls.map((url) => ({ id: nanoid(), content: url, error: false }))
          )
        );
      }
    };
    return (
      <div className={`input-box-inner ${isOpenRef.current ? "active" : ""}`}>
        <div className="result">
          {value ? (
            <div></div>
          ) : (
            <div className="arrow">
              <ArrowToRight></ArrowToRight>
            </div>
          )}
        </div>
        <input
          ref={ref}
          spellCheck="false"
          value={value}
          onClick={onOpenInput}
          onFocus={onOpenInput}
          onChange={onChange}
          className="input-url"
          type="text"
          placeholder={placeholder}
        />
        <style jsx>
          {`
            .result {
              display: none;
              position: absolute;
              left: 5px;
              width: 35px;
              height: 35px;
              padding-left: 10px;
              bottom: 5px;
            }

            .input-box-inner {
              height: 100%;
            }

            input {
              position: relative;
              top: calc(-100% + 5px);
              left: 0;
              display: block;
              height: calc(100% - 10px);
              width: 100%;
              padding: 0 5px;
              border: 0;
              outline: none;
            }

            input::placeholder {
              color: #757575;
            }

            input:focus::placeholder {
              color: #000;
              font-weight: bold;
            }

            .arrow {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              color: #000;
            }

            .input-box-inner.active input {
              position: absolute;
              top: unset;
              bottom: 5px;
              left: 5px;
              width: calc(100% - 45px);
              height: 35px;
            }

            .input-box-inner.active .result {
              display: block;
            }
          `}
        </style>
        {/* dynamic */}
        <style jsx>
          {`
            input::placeholder {
              color: ${error ? "red !important" : ""};
            }
          `}
        </style>
      </div>
    );
  }
);

export default InputBoxInner;
