import {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FixedSizeList } from "react-window";
import MiniImage from "../../../../components/MiniImage";
import { ScrollShadow } from "../../../../components/ScrollShadow";
import CloseBtn from "../../../../components/svg/CloseBtn";
import { useMatchMedia } from "../../../../hooks/useMatchMedia";
import { RootState } from "../../../../store/rootReducer";
import smoothScrollTo from "../../../../utils/smoothScrollTo";
import { removeUrlItem, setUrlItemError, TURLItem } from "../../formSlice";

// turning off auto scroll will not be enabled since content is manually added, as well as content visuall size is already so small

type TURLTagProps = TURLTag & {
  onRemove: (id: string) => void;
  onError: (id: string) => void;
  parent: React.MutableRefObject<HTMLUListElement | null>;
  isScrollContainer: boolean;
  style?: CSSProperties;
};

const URLTags = ({
  id,
  content,
  error,
  name,
  parent,
  isScrollContainer,
  style = {},
  onError,
  onRemove,
}: TURLTagProps) => {
  const displayURL = error ? content : name;

  return (
    <li data-id-url-item={id} className={`url-item ${error ? "error" : ""}`}>
      <MiniImage
        error={error}
        onError={() => {
          if (error) return;
          // onError(id);
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
            background: #cedaff;
            color: #002f9d;
            height: 45px;
            padding: 8px;
            margin: 0 10px;
            margin-top: 10px;
            list-style-type: none;
            font-size: 15px;
          }

          .url-tag-enter {
            opacity: 0;
            height: 0;
            padding: 0;
            margin: 0;
          }

          .url-tag-enter-done {
            height: 45px;
            padding: 8px;
            margin: 0 10px;
            margin-top: 10px;
          }

          .url-tag-enter-active {
            opacity: 1;
            height: 45px;
            padding: 8px;
            margin: 0 10px;
            margin-top: 10px;
            transition: all 100ms linear, opacity 50ms 50ms linear;
          }

          .url-tag-exit {
            opacity: 1;
            height: 45px;
            padding: 8px;
            margin: 0 10px;
            margin-top: 10px;
          }

          .url-tag-exit-active {
            opacity: 0;
            height: 0;
            padding: 0;
            margin: 0;
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
            -webkit-tap-highlight-color: transparent;
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

type TURLTag = { id: string; content: string; name: string; error: boolean };

const TagsArea = () => {
  const dispatch = useDispatch();
  const urls = useSelector((state: RootState) => state.form.urlItems);
  const mqlRef = useMatchMedia();
  const hasRemovedRef = useRef(false);
  const [refreshContainer, setRefreshContainer] = useState(0);
  // const isScrollContainerRef = useRef(false);
  const isScrollContainer =
    mqlRef.current && mqlRef.current.minWidth_850.matches
      ? urls.length > 5
      : urls.length > 2;
  const urlsContainerScrollOffsetRef = useRef(0);

  // https://i.imgur.com/nt0RgAH.jpg https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg https://static.tvtropes.org/pmwiki/pub/images/aubrey_plaza.jpg

  const urlsContainerElRef = useRef<HTMLUListElement | null>(null);
  const scrollShadowElsRef = useRef<{
    top: { current: HTMLDivElement | null };
    bottom: { current: HTMLDivElement | null };
  }>({
    top: { current: null },
    bottom: { current: null },
  });

  const animateExitByRemoveBtn = (id: string) => {
    return new Promise<boolean>((resolve) => {
      if (!isScrollContainer) {
        resolve(true);
        return;
      }

      const itemHeight = 55;
      const targetIdx = urls.findIndex((item) => item.id === id);
      const targetEl = urlsContainerElRef.current!.querySelector(
        `[data-id-url-item="${id}"]`
      ) as HTMLDivElement;
      const urlsContainerOffsetScroll = urlsContainerElRef.current!.scrollTop;
      const isScrollNearBottom =
        urlsContainerOffsetScroll + itemHeight >=
        urlsContainerElRef.current!.scrollHeight -
          urlsContainerElRef.current!.clientHeight;

      const startingIdx = () => {
        const idx = targetIdx - 6;
        if (Math.sign(idx) === -1) return 0;
        return idx;
      };

      const urlsSlice = isScrollNearBottom
        ? urls.slice(startingIdx(), targetIdx)
        : urls.slice(targetIdx + 1, targetIdx + 6);
      const siblingsEl = urlsSlice.map(
        ({ id }) =>
          urlsContainerElRef.current!.querySelector(
            `[data-id-url-item="${id}"]`
          ) as HTMLDivElement
      );

      targetEl.style.pointerEvents = "none";
      targetEl.style.opacity = "0";
      targetEl.style.transition = "opacity 50ms linear";

      siblingsEl.forEach((el) => {
        if (!el) return;
        el.style.position = "relative";
        el.style.pointerEvents = "none";
        el.style.zIndex = "1";
        el.style.transition = "transform 100ms linear";
        el.style.transform = `translateY(${
          isScrollNearBottom ? itemHeight : -itemHeight
        }px)`;
      });

      const onAnimationEnd = () => {
        targetEl.parentElement!.style.display = "none";
        resolve(true);
      };

      setTimeout(() => {
        onAnimationEnd();
      }, 100);
    });
  };

  const onRemoveUrlList = async (id: string) => {
    if (isScrollContainer) {
      hasRemovedRef.current = true;
    }

    await animateExitByRemoveBtn(id);

    dispatch(removeUrlItem({ id }));
  };

  const onError = (id: string) => {
    dispatch(setUrlItemError({ id, error: true }));
  };

  const onScroll = (offset: number) => {
    if (hasRemovedRef.current) return;

    const nearTop = offset < 5;
    const nearBottom = offset + 5 > urlsContainerScrollOffsetRef.current;
    const scrollShadowElTop = scrollShadowElsRef.current.top.current!;
    const scrollShadowElBottom = scrollShadowElsRef.current.bottom.current!;

    if (nearTop) {
      scrollShadowElTop.style.opacity = "0";
    } else {
      scrollShadowElTop.style.opacity = "1";
    }

    if (nearBottom) {
      scrollShadowElBottom.style.opacity = "0";
    } else {
      scrollShadowElBottom.style.opacity = "1";
    }
  };

  useEffect(() => {
    const onChange = () => {
      setRefreshContainer(Date.now());
    };

    mqlRef.current!.minWidth_850.addEventListener("change", onChange);

    return () => {
      mqlRef.current!.minWidth_850.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (isScrollContainer) {
      urlsContainerScrollOffsetRef.current =
        urlsContainerElRef.current!.scrollHeight -
        urlsContainerElRef.current!.clientHeight;
    }

    if (!isScrollContainer || hasRemovedRef.current) {
      hasRemovedRef.current = false;
      return;
    }

    smoothScrollTo({
      destination:
        urlsContainerElRef.current!.scrollHeight -
        urlsContainerElRef.current!.clientHeight,
      container: urlsContainerElRef.current!,
      easing: "easeInOutQuad",
      duration: 200,
    });
  }, [urls.length]);

  useEffect(() => {
    if (!isScrollContainer) return;

    urlsContainerScrollOffsetRef.current =
      urlsContainerElRef.current!.scrollHeight -
      urlsContainerElRef.current!.clientHeight;
  }, [refreshContainer]);

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
        <div className="urls-container-inner">
          {isScrollContainer ? (
            <>
              <ScrollShadow
                top={true}
                scrollShadowElsRef={scrollShadowElsRef}
              ></ScrollShadow>
              <ScrollShadow
                top={false}
                scrollShadowElsRef={scrollShadowElsRef}
              ></ScrollShadow>
            </>
          ) : null}
          {!isScrollContainer ? (
            <ul className="urls">
              <TransitionGroup component={null}>
                {urls.map(({ id, content, name, error }) => {
                  return (
                    <CSSTransition
                      classNames={isScrollContainer ? "null" : "url-tag"}
                      timeout={100}
                      key={id}
                    >
                      <URLTags
                        id={id}
                        content={content}
                        name={name}
                        error={error}
                        parent={urlsContainerElRef}
                        onError={onError}
                        onRemove={onRemoveUrlList}
                        isScrollContainer={isScrollContainer}
                      ></URLTags>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </ul>
          ) : (
            // @ts-ignore
            <FixedSizeList
              height={
                mqlRef.current && mqlRef.current.minWidth_850.matches
                  ? 280
                  : 150
              }
              itemCount={urls.length}
              itemSize={55}
              itemData={urls}
              innerElementType={"ul"}
              className={"fixed-list"}
              outerRef={urlsContainerElRef}
              onScroll={(props) => onScroll(props.scrollOffset)}
            >
              {({ data, index, style }) => {
                const { id, content, error, name } = data[index] as TURLTag;

                return (
                  <div style={style}>
                    <URLTags
                      id={id}
                      content={content}
                      name={name}
                      error={error}
                      parent={urlsContainerElRef}
                      onError={onError}
                      onRemove={onRemoveUrlList}
                      isScrollContainer={isScrollContainer}
                    ></URLTags>
                  </div>
                );
              }}
            </FixedSizeList>
          )}
        </div>
      </div>
      <style jsx>{`
        .main {
          position: relative;
          background: #fff;
          height: 100%;
        }

        .urls-container {
          padding-bottom: 50px;
        }

        .urls-container-inner {
          position: relative;
        }

        :global(.fixed-list ul) {
          margin: 0;
        }

        .urls {
          position: relative;
          max-height: 150px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
        }

        .bar {
          position: relative;
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
          -webkit-tap-highlight-color: transparent;
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
      {/* dynamic */}
      <style jsx>
        {`
          .urls-container {
            padding-bottom: ${urls.length ? "70px" : "50px"};
          }

          .urls {
            overflow-y: ${isScrollContainer ? "auto" : "hidden"};
            max-height: ${mqlRef.current && mqlRef.current.minWidth_850.matches
              ? "280px"
              : "150px"};
          }
        `}
      </style>
    </div>
  );
};

// max-height: 280px
// width: 850px

export default TagsArea;
