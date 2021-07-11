import debounce from "lodash/debounce";
import React, {
  ChangeEvent,
  Dispatch,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import MiniImage from "../../../../components/MiniImage";
import ArrowToRight from "../../../../components/svg/ArrowToRight";
import { Android, IOS } from "../../../../lib/onFocusOut/browserInfo";
import { RootState } from "../../../../store/rootReducer";
import store from "../../../../store/store";
import { doesImageExist } from "../../../../utils/doesURLExist";
import {
  addUrlItem,
  removeUrlItem,
  setInputError,
  TURLItem,
} from "../../formSlice";
import Input from "./Input";
import UtilBar from "./UtilBar";
import { checkDebouncedUrls, splitValueIntoUrlItems } from "./utils";

let keyDownProps: { key: string; paste: boolean } = {
  key: "",
  paste: false,
};

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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    onInputUrls(e);

    if (hasSubmitRef.current) {
      onInputCheckUrlDebouncedRef.current.cancel();
      hasSubmitRef.current = false;
      return;
    }

    onInputCheckUrlDebouncedRef.current(value);
  };

  const checkImageExist = async (value: string) => {
    const success = await doesImageExist(value);
    console.log({ success });
    setImgUrl(value);
    dispatch(setInputError({ inputVal: !success, pastedVal: false }));
  };

  const onInputCheckUrlDebouncedRef = useRef(
    debounce(
      async (value: string) => {
        // when there's multiple URLs present (from using Ctrl-a or Backspacing), currently there's no support to detect which URL is invalid
        // Therefore input string will not be validated
        if (!value || value.match(/\s/g)) {
          value = "";
          dispatch(setInputError({ inputVal: false }));
          setImgUrl(value);
          return;
        }

        checkImageExist(value);
      },
      500,
      { leading: true }
    )
  );

  const mobileScrollDown = (inputUrlItems: TURLItem[]) => {
    if (!(Android || IOS)) return;

    const { scrollY } = window;
    const maxItems = 3;
    const itemHeight = 55;
    const maxScrollY = itemHeight * 2;
    const urlItems = store.getState().form.urlItems;

    // android has issues focusing aligned to input, so I wont use this func for now
    const scrollDownIfNearTop = () => {
      if (scrollY > maxScrollY) return;
      window.scrollTo({ top: maxScrollY - itemHeight });
    };

    if (urlItems.length > 2) {
      // scrollDownIfNearTop();
      return;
    }

    const total =
      inputUrlItems.length + urlItems.length > maxItems
        ? 0
        : inputUrlItems.length + urlItems.length;

    if (!total) {
      // scrollDownIfNearTop();
      return;
    }

    if (scrollY > maxScrollY) return;

    window.scrollTo({ top: scrollY + itemHeight * total });
  };

  const onInputUrls = (e: ChangeEvent<HTMLInputElement>) => {
    const { key, paste } = keyDownProps;
    const value = e.target.value.trim();

    if (!value) {
      e.target.value = "";
      return;
    }

    if (paste || (key === " " && value)) {
      const urlItems = splitValueIntoUrlItems({
        value,
      });

      hasSubmitRef.current = true;
      e.target.value = "";
      setImgUrl("");
      dispatch(
        setInputError({
          inputVal: false,
          pastedVal: !urlItems.length,
        })
      );

      mobileScrollDown(urlItems);

      dispatch(addUrlItem(urlItems));

      // a chance submission occurs during debounce, therefore a valid url will still
      // be marked as invalid, which will have a stuck invalid tag. This line covers that basis
      checkDebouncedUrls(dispatch, urlItems);
      return;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const caretPosition = target.selectionStart;
    const value = target.value.trim();
    const vpressed = /v/i.test(e.key);
    const paste =
      (vpressed && e.ctrlKey) ||
      (vpressed && e.metaKey) ||
      /insert/i.test(e.key);
    const selectAll = /a/.test(e.key) && e.ctrlKey;

    keyDownProps = { key: e.key, paste };

    if (e.key.match(/backspace/i) && caretPosition === 0) {
      const urlItems = store.getState().form.urlItems;
      const lastItem = urlItems[urlItems.length - 1];

      if (!lastItem) return;
      e.preventDefault();
      e.stopPropagation();

      const content = lastItem.content;
      target.value = content + (value ? " " + value : "");
      target.setSelectionRange(content.length, content.length);
      target.blur();
      target.focus();
      dispatch(removeUrlItem({ type: "pop" }));
      setImgUrl("");

      if (!value) {
        checkImageExist(content);
      } else {
        dispatch(setInputError({ inputVal: false, pastedVal: false }));
      }
      return;
    }

    if (selectAll) {
      const urlItems = store.getState().form.urlItems;
      const reducedContent = urlItems.reduce(
        (acc, curr, idx) => acc + (idx ? " " : "") + curr.content,
        ""
      );

      if (!reducedContent) return;

      target.value = reducedContent + (value ? " " + value : "");
      target.setSelectionRange(0, target.value.length);

      dispatch(removeUrlItem({ type: "all" }));

      return;
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // @ts-ignore
  };

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    // fire order: 1. keydown 2. oninput 3. onChange 4. keyup
    const { key } = keyDownProps;
    const keyIsUnidentified = !!key.match(/unidentified/i) || key === undefined;

    if (keyIsUnidentified) {
      // @ts-ignore
      keyDownProps.key = e.nativeEvent.data as string;
    }

    // @ts-ignore
    if (e.nativeEvent.inputType === "insertFromPaste") {
      keyDownProps.paste = true;
    }
  };

  useEffect(() => {
    if (isOpenRef.current) return;
  }, []);

  return (
    <div className={`input-box-inner ${isOpenRef.current ? "active" : ""}`}>
      <div className="utilbar-container">
        <UtilBar></UtilBar>
      </div>
      <ArrowContainer imgUrl={imgUrl} isOpenRef={isOpenRef}></ArrowContainer>
      <Input
        onChange={onChange}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        isOpenRef={isOpenRef}
        displayErrorRef={displayErrorRef}
        containerElRef={containerElRef}
        contentElRef={contentElRef}
        setImgUrl={setImgUrl}
      ></Input>
      <style jsx>
        {`
          .input-box-inner {
            height: 100%;
            pointer-events: none;
          }

          .utilbar-container {
            display: none;
          }

          .input-box-inner.active .utilbar-container {
            display: block;
          }
        `}
      </style>
    </div>
  );
};

type TArrowContainerProps = {
  isOpenRef: React.MutableRefObject<boolean>;
  imgUrl: string;
};

const ArrowContainer = ({ imgUrl, isOpenRef }: TArrowContainerProps) => {
  const error = useSelector((state: RootState) => state.form.error.inputVal);

  return (
    <div className={`arrow-container ${isOpenRef.current ? "active" : ""}`}>
      {imgUrl && !error ? (
        <MiniImage
          url={imgUrl}
          onError={() => {}}
          maxWidth={25}
          margin={"0"}
          error={error}
        ></MiniImage>
      ) : (
        <div id="input-arrow" className="arrow">
          <ArrowToRight></ArrowToRight>
        </div>
      )}
      <style jsx>
        {`
          .arrow-container {
            display: none;
            position: absolute;
            left: 5px;
            width: 35px;
            height: 35px;
            padding-left: 10px;
            bottom: 5px;
            background: #fff;
          }

          .arrow-container.active {
            display: flex;
            align-items: center;
            z-index: 5;
          }

          .arrow {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            color: #000;
          }
        `}
      </style>
    </div>
  );
};

export default InputBoxInner;
