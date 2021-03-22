import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import CloseBtn from "../../../components/svg/CloseBtn";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";

type TURLItemProps = TURLItem & {
  onRemove: (id: string) => void;
  onError: (id: string) => void;
};
const URLItem = ({ id, content, error, onError, onRemove }: TURLItemProps) => {
  const displayURL = content.replace(/(https:\/\/|http:\/\/)/g, "");

  return (
    <li data-id-url-item={id} className="url-item" key={id}>
      <div className="image-container">
        <div className="image">
          {error ? (
            <div>Bad</div>
          ) : (
            <img
              src={content}
              onError={() => onError(id)}
              aria-hidden="true"
              alt="image base on url input"
            />
          )}
        </div>
      </div>
      <div className="content">{displayURL}</div>
      <button
        className="url-item__close-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(id);
        }}
      >
        <CloseBtn></CloseBtn>
      </button>
      <style jsx>
        {`
          .url-item {
            display: flex;
            align-items: center;
            height: 45px;
            padding: 8px;
            margin-top: 10px;
            background: #cedaff;
            color: #002f9d;
            list-style-type: none;
            flex: 1 0 auto;
            transition: all 100ms linear, opacity 50ms linear;
          }

          .url-item__close-btn {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            width: 40px;
            padding: 5px;
            margin: 0 2px;
            margin-left: auto;
            color: inherit;
            background: inherit;
          }

          .content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .image-container {
            overflow: hidden;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            height: 100%;
          }

          .image {
            width: 35px;
            height: 100%;
            margin: 0 5px;
          }

          img {
            display: block;
            object-fit: contain;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </li>
  );
};

type TURLItem = { id: string; content: string; error: boolean };

type TMainProps = {
  onCloseInput: () => void;
};
const Main = ({ onCloseInput }: TMainProps) => {
  const urlsElRef = useRef<HTMLUListElement | null>(null);
  const [urls, setUrls] = useState<TURLItem[]>([
    // {
    //   id: nanoid(),
    //   content:
    //     "https://static.billboard.com/files/media/post-malone-dj-khaled-2018-billboard-1548-768x433.jpg",
    //   error: false,
    // },
    // { id: nanoid(), content: "https://mgur.com/nt0RgAH.jpg", error: false },
    // { id: nanoid(), content: "https://i.imgur.com/nt0RgAH.jpg", error: false },
  ]);

  //   useEffect(() => {
  //     setTimeout(() => {
  //       setUrls((prev) => {
  //         const copy = JSON_Stringify_Parse(prev);
  //         copy.push({
  //           id: nanoid(),
  //           content:
  //             "https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg",
  //           error: false,
  //         });
  //
  //         return copy;
  //       });
  //     }, 3000);
  //   }, []);

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
      setUrls((prev) => {
        const copy = JSON_Stringify_Parse(prev);
        const foundIndex = copy.findIndex((item) => item.id === id);
        copy.splice(foundIndex, 1);
        return copy;
      });
    }, 100);
  };

  const onError = (id: string) => {
    setUrls((prev) => {
      const copy = JSON_Stringify_Parse(prev);
      const item = copy.find((item) => item.id === id)!;
      item.error = true;
      return copy;
    });
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCloseInput();
  };

  return (
    <div className="main">
      <div className="bar">
        <button className="close-btn" onClick={onClick}>
          <CloseBtn></CloseBtn>
        </button>
        <div className="title">
          <div className="title-sub-1"> To paste multiple URLs, </div>{" "}
          <span className="title-sub-2">separate by Space</span>
        </div>
      </div>
      <ul ref={urlsElRef} className="urls">
        {urls.map(({ id, content, error }) => (
          <URLItem
            id={id}
            content={content}
            error={error}
            onError={onError}
            onRemove={onRemoveUrlList}
          ></URLItem>
        ))}
      </ul>
      <style jsx>{`
        .main {
          position: relative;
          background: #fff;
          height: 100%;
        }

        .urls {
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0 10px;
          padding-bottom: 50px;
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
          width: 45px;
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

export default Main;
