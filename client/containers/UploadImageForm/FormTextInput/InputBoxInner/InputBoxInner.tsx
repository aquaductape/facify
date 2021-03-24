import debounce from "lodash/debounce";
import { nanoid } from "nanoid";
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import MiniImage from "../../../../components/MiniImage";
import ArrowToRight from "../../../../components/svg/ArrowToRight";
import { addUrlItem } from "../../formSlice";
import Input from "./Input";

type TInputBoxInner = {
  isOpenRef: React.MutableRefObject<boolean>;
  displayErrorRef: React.MutableRefObject<boolean>;
  contentElRef: React.MutableRefObject<HTMLDivElement | null>;
  containerElRef: React.MutableRefObject<HTMLDivElement | null>;
};
const InputBoxInner = ({
  isOpenRef,
  displayErrorRef,
  containerElRef,
  contentElRef,
}: TInputBoxInner) => {
  const dispatch = useDispatch();

  // const [value, setValue] = useState("");
  const hasSubmitRef = useRef(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgError, setImgError] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // setValue(value);

    onInputUrls(e);

    if (hasSubmitRef.current) {
      onInputCheckUrlDebouncedRef.current.cancel();
      hasSubmitRef.current = false;
      return;
    }

    onInputCheckUrlDebouncedRef.current(value);
  };

  const onInputCheckUrlDebouncedRef = useRef(
    debounce(
      (value: string) => {
        setImgError(false);
        setImgUrl(value);
      },
      500,
      { leading: true }
    )
  );

  const onImgError = () => {
    setImgError(true);
  };

  const onInputUrls = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const hasSpace = value.match(/\s/);
    const urls = value.split(" ").filter((item) => item);

    if (urls.length && hasSpace) {
      // setValue("");
      hasSubmitRef.current = true;
      e.target.value = "";
      setImgUrl("");
      setImgError(false);

      dispatch(
        addUrlItem(
          urls.map((url) => ({ id: nanoid(), content: url, error: false }))
        )
      );
    }
  };

  useEffect(() => {
    if (isOpenRef.current && !imgError) return;

    setImgUrl("");
    setImgError(false);
  }, []);

  return (
    <div className={`input-box-inner ${isOpenRef.current ? "active" : ""}`}>
      <div className="result">
        {imgUrl ? (
          <MiniImage
            url={imgUrl}
            error={imgError}
            onError={onImgError}
            margin={"0"}
          ></MiniImage>
        ) : (
          <div className="arrow">
            <ArrowToRight></ArrowToRight>
          </div>
        )}
      </div>
      <Input
        onChange={onChange}
        isOpenRef={isOpenRef}
        displayErrorRef={displayErrorRef}
        containerElRef={containerElRef}
        contentElRef={contentElRef}
        imgError={imgError}
        setImgUrl={setImgUrl}
      ></Input>
      <style jsx>
        {`
          .input-box-inner {
            height: 100%;
            pointer-events: none;
          }
          .result {
            display: none;
            position: absolute;
            left: 5px;
            width: 35px;
            height: 35px;
            padding-left: 10px;
            bottom: 5px;
          }

          .arrow {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            color: #000;
          }

          .input-box-inner.active .result {
            display: block;
          }
        `}
      </style>
    </div>
  );
};

export default InputBoxInner;
