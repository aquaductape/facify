import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { removeInvalidUrlItems } from "../../formSlice";

type TUtilBarProps = {
  imgError: boolean;
  isOpenRef: React.MutableRefObject<boolean>;
};
const UtilBar = ({ imgError, isOpenRef }: TUtilBarProps) => {
  const dispatch = useDispatch();
  const urls = useSelector((state: RootState) => state.form.urlItems);

  const errorUrlsCount = urls.filter(({ error }) => error).length;

  const onBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeInvalidUrlItems());
  };

  return (
    <div className={`container `}>
      {errorUrlsCount ? (
        <div className="btn" role="button" onClick={onBtnClick}>
          <span>
            Remove <strong>{errorUrlsCount}</strong> error URLs
          </span>
        </div>
      ) : null}
      {!errorUrlsCount && imgError ? (
        <div className="imgError-info">
          This URL is invalid or image doesn't exist
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

          .imgError-info {
            color: #ff0000;
          }

          .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #c20000;
            color: #fff;
            margin-left: auto;
            font-size: 16px;
            white-space: nowrap;
            padding: 0 28px;
            border-radius: 0;
            height: 100%;
            cursor: pointer;
            pointer-events: all;
            transition: background-color 250ms;
          }

          .btn:hover {
            background: #ff0000;
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
            ${imgError && !urls.length
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
