import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MiniImage from "../../../../components/MiniImage";
import CloseBtn from "../../../../components/svg/CloseBtn";
import { RootState } from "../../../../store/rootReducer";
import { removeUrlItem, setUrlItemError } from "../../formSlice";
import ScrollShadow from "./ScrollShadow";

type TURLTagProps = TURLTag & {
  onRemove: (id: string) => void;
  onError: (id: string) => void;
};
const URLTags = ({ id, content, error, onError, onRemove }: TURLTagProps) => {
  const displayURL = content.replace(/(https:\/\/|http:\/\/)/g, "");

  return (
    <li
      data-id-url-item={id}
      className={`url-item ${error ? "error" : ""}`}
      key={id}
    >
      <MiniImage
        error={error}
        onError={() => {
          if (error) return;
          onError(id);
        }}
        url={content}
        isUrlTag={true}
        margin={"0"}
        maxHeight={100}
        maxWidth={100}
      ></MiniImage>
      <div className="content">{displayURL}</div>
      <div
        className="url-item__close-btn"
        role="button"
        aria-label="remove url tag"
        onClick={() => {
          // e.preventDefault();
          // e.stopPropagation();
          onRemove(id);
        }}
      >
        <CloseBtn></CloseBtn>
      </div>
      <style jsx>
        {`
          .url-item {
            display: flex;
            align-items: center;
            flex: 1 0 auto;
            height: 45px;
            padding: 8px;
            margin-top: 10px;
            background: #cedaff;
            color: #002f9d;
            list-style-type: none;
            font-size: 15px;
            transition: all 100ms linear, opacity 50ms linear;
          }

          .url-item__close-btn {
            flex-shrink: 0;
            position: relative;
            left: 8px;
            display: flex;
            align-items: center;
            width: 40px;
            padding: 12px;
            height: 45px;
            margin: 0;
            margin-left: auto;
            color: inherit;
            background: inherit;
            cursor: pointer;
            user-select: none;
            transition: background-color 250ms, color 250ms;
          }

          .url-item__close-btn:hover {
            background: #6f8bdc;
            color: #fff;
          }

          .content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .url-item.error {
            background: #ffcece;
            color: #550000;
          }

          .url-item.error .url-item__close-btn:hover {
            background: #dc6f6f;
            color: #fff;
          }

          @media (min-width: 500px) {
            .url-item {
              font-size: 18px;
            }
          }
        `}
      </style>
    </li>
  );
};

type TURLTag = { id: string; content: string; error: boolean };

const TagsArea = () => {
  const dispatch = useDispatch();
  const urlsElRef = useRef<HTMLUListElement | null>(null);
  const urls = useSelector((state: RootState) => state.form.urlItems);
  // https://i.imgur.com/nt0RgAH.jpg https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg https://static.tvtropes.org/pmwiki/pub/images/aubrey_plaza.jpg

  const onRemoveUrlList = (id: string) => {
    const el = urlsElRef.current!.querySelector(
      `[data-id-url-item="${id}"]`
    ) as HTMLElement;

    el.style.height = "0";
    el.style.padding = "0";
    el.style.opacity = "0";
    el.style.margin = "0";
    el.style.overflow = "hidden";

    setTimeout(() => {
      dispatch(removeUrlItem({ id }));
    }, 100);
  };

  const onError = (id: string) => {
    dispatch(setUrlItemError({ id, error: true }));
  };

  return (
    <div className="main">
      <div className="bar">
        <div
          className="close-btn"
          role="button"
          aria-label="collapse input box"
        >
          <CloseBtn></CloseBtn>
        </div>
        <div className="title">
          <div className="title-sub-1"> To paste multiple URLs, </div>{" "}
          <span className="title-sub-2">separate by Space</span>
        </div>
      </div>
      <div className="urls-container">
        {urls.length > 3 ? (
          <>
            <ScrollShadow top={true}></ScrollShadow>
            <ScrollShadow top={false}></ScrollShadow>
          </>
        ) : null}
        <ul ref={urlsElRef} className="urls">
          {urls.map(({ id, content, error }) => (
            <URLTags
              id={id}
              content={content}
              error={error}
              onError={onError}
              onRemove={onRemoveUrlList}
              key={id}
            ></URLTags>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .main {
          position: relative;
          background: #fff;
          height: 100%;
        }

        .urls-container {
          position: relative;
          padding-bottom: 50px;
        }

        .urls {
          max-height: 200px;
          overflow: hidden;
          overflow-y: scroll;
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0 10px;
        }

        .bar {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 40px;
          background: #ececec;
          transition: height 100ms linear;
        }

        .close-btn {
          flex-shrink: 0;
          display: flex;
          align-item: center;
          width: 40px;
          padding: 10px;
          background: #ececec;
          cursor: pointer;
          user-select: none;
          transition: background-color 250ms, color 250ms;
        }

        .close-btn:hover {
          background: #102466;
          color: #fff;
        }

        .title {
          width: 50%;
          font-size: 10px;
        }
        .title-sub-1,
        .title-sub-2 {
          display: inline-block;
          white-space: nowrap;
        }

        @media (min-width: 320px) {
          .title {
            font-size: 13px;
          }
        }

        @media (min-width: 360px) {
          .title {
            font-size: 15px;
          }
        }

        @media (min-width: 375px) {
          .title {
            font-size: 16px;
          }
        }

        @media (min-width: 500px) {
          .title {
            font-size: 17px;
            width: 55%;
          }
        }
        @media (min-width: 800px) {
          .title {
            font-size: 20px;
            width: 60%;
          }
        }
        @media (min-width: 800px) {
          .title {
            margin-left: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default TagsArea;
