import { SetStateAction, useRef } from "react";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";
import Input from "./Input";

type TFormTextInputProps = {
  uploadState: {
    urlInput: {
      value: string;
      placeholder: string;
      error: boolean;
    };
    submitBtn: {
      hover: boolean;
    };
  };
  setUploadState: React.Dispatch<
    SetStateAction<{
      urlInput: {
        value: string;
        placeholder: string;
        error: boolean;
      };
      submitBtn: {
        hover: boolean;
      };
    }>
  >;
  onSubmitForm: any;
};

const FormTextInput = ({
  onSubmitForm,
  setUploadState,
  uploadState,
}: TFormTextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmitBtnMouseEvents = (isMouseenter: boolean) => {
    if (uploadState.urlInput.error) isMouseenter = false;
    if (uploadState.submitBtn.hover === isMouseenter) return;

    setUploadState((prev) => {
      const copy = JSON_Stringify_Parse(prev);
      copy.submitBtn.hover = isMouseenter;
      return copy;
    });
  };

  const onInputChange = (e: InputEvent) => {
    // @ts-ignore
    const value = e.target.value as string;
    setUploadState((prev) => {
      const copy = JSON_Stringify_Parse(prev);
      copy.urlInput.placeholder = "Paste URL...";
      copy.urlInput.value = value;
      copy.urlInput.error = false;
      return copy;
    });
  };

  return (
    <form
      id="url-input-form"
      onSubmit={onSubmitForm}
      aria-label="Paste Image URL"
    >
      <Input
        ref={inputRef}
        onInputChange={onInputChange}
        placeholder={uploadState.urlInput.placeholder}
        value={uploadState.urlInput.value}
        error={uploadState.urlInput.error}
        submitBtnHover={uploadState.submitBtn.hover}
      ></Input>
      <button
        onMouseEnter={() => onSubmitBtnMouseEvents(true)}
        onMouseLeave={() => onSubmitBtnMouseEvents(false)}
        className="detect-button"
        type="submit"
      >
        Detect
      </button>
      <style jsx>
        {`
          form {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .detect-button {
            border: none;
            padding: 10px 20px;
            color: #fff;
            position: relative;
            background: #000066;
            font-size: 1rem;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
          }

          .detect-button:hover {
            color: #ffffff;
            background: #000000;
          }

          .detect-button:focus {
            outline: none;
          }

          .detect-button.focus-visible {
            color: #ffffff;
            background: #000000;
            outline: 3px solid #000;
            outline-offset: 2px;
          }
        `}
      </style>
    </form>
  );
};

export default FormTextInput;
