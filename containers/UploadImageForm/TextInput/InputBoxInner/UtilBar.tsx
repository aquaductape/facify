import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CONSTANTS } from "../../../../constants";
import { useMatchMedia } from "../../../../hooks/useMatchMedia";
import { RootState } from "../../../../store/rootReducer";
import { removeInvalidUrlItems } from "../../formSlice";

const UtilBar = () => {
  const dispatch = useDispatch();
  const urls = useSelector((state: RootState) => state.form.urlItems);
  const inputError = useSelector((state: RootState) => state.form.error);
  const shortMsg = "Must contain";
  const longMsg = "Pasted URLs must be prefixed with";
  const [pastedErrorMsg, setPastedErrorMsg] = useState(shortMsg);

  const mql = useMatchMedia();

  const errorUrlsCount = urls.filter(({ error }) => error).length;

  const onBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeInvalidUrlItems());
  };

  useEffect(() => {
    const minWidth_565 = mql.current!.minWidth_565!;

    setPastedErrorMsg(minWidth_565.matches ? longMsg : shortMsg);

    minWidth_565.addEventListener("change", (e) => {
      setPastedErrorMsg(e.matches ? longMsg : shortMsg);
    });
  }, []);

  return (
    <div className={`container `}>
      {errorUrlsCount ? (
        <div className="btn" role="button" onClick={onBtnClick}>
          <span>
            Remove <strong>{errorUrlsCount}</strong> error Image
            {errorUrlsCount > 1 ? "s" : ""}
          </span>
        </div>
      ) : null}
      {!errorUrlsCount && (inputError.inputVal || inputError.pastedVal) ? (
        <div className="imgError-info">
          {inputError.inputVal ? (
            CONSTANTS.imageExistErrorMsg
          ) : (
            <>
              {pastedErrorMsg} <code>https://</code> or <code>data:image/</code>
            </>
          )}
        </div>
      ) : null}
      {urls.length ? (
        <div className={`url-count ${errorUrlsCount ? "error" : ""}`}>
          <span>{urls.length}</span>
        </div>
      ) : null}
      <style jsx>
        {`
          .container {
            position: absolute;
            left: 5px;
            bottom: 40px;
            width: calc(100% - 10px);
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            padding: 0 10px;
            font-size: 16px;
            z-index: 5;
          }

          code {
            background: #ffcece;
            color: #000;
          }

          .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 3px solid #d20000;
            background: none;
            color: #d20000;
            margin-left: auto;
            padding: 0 15px;
            font-size: 15px;
            white-space: nowrap;
            border-radius: 0;
            height: 100%;
            cursor: pointer;
            pointer-events: all;
            transition: background-color 250ms, color 250ms;
          }

          @media (min-width: 330px) {
            .btn {
              font-size: 16px;
              padding: 0 28px;
            }
          }

          .btn:hover {
            background: #d20000;
            color: #fff;
          }

          .url-count {
            display: flex;
            align-items: center;
            height: 100%;
            margin-left: auto;
            background: #cedaff;
            color: #002f9d;
            font-weight: bold;
            padding: 2px 4px;
            transition: background-color 250ms, color 250ms;
          }

          .url-count.error {
            background: #ffcece;
            color: #550000;
          }

          .imgError-info {
            color: #d20000;
            font-size: 13px;
          }

          @media (min-width: 320px) {
            .imgError-info {
              font-size: 14px;
            }
          }
          @media (min-width: 360px) {
            .imgError-info {
              font-size: 15px;
              position: relative;
              top: -2px;
            }
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .container {
            ${(inputError.inputVal || inputError.pastedVal) && !urls.length
              ? `
          align-items: flex-start;
          height: 35px;
          bottom: 17px;
          padding: 0;
          white-space: nowrap;
          pointer-events: none;
          `
              : ""}
          }
        `}
      </style>
    </div>
  );
};

export default UtilBar;
