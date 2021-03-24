import { useSelector } from "react-redux";
import MiniImage from "../../../components/MiniImage";
import { RootState } from "../../../store/rootReducer";

const InputMiniTags = () => {
  const urls = useSelector((state: RootState) => state.form.urlItems);

  const urlItemsValid = () => urls.every((item) => item.error);
  return (
    <div aria-hidden="true" className="container">
      <div className="content">
        <div className="tags">
          {urls.slice(0, 3).map(({ id, content, error }) => {
            return (
              <MiniImage
                url={content}
                error={error}
                onError={() => {}}
                key={id}
              ></MiniImage>
            );
          })}
        </div>
        {urls.length ? (
          <div className={`url-count ${urlItemsValid() ? "error" : ""}`}>
            {urls.length}
          </div>
        ) : null}
      </div>
      <style jsx>
        {`
          .container {
            position: absolute;
            top: 5px;
            right: 5px;
            height: calc(100% - 10px);
            pointer-events: none;
            z-index: 1;
          }

          .content {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 2px 0;
          }

          .url-count {
            background: #cedaff;
            color: #002f9d;
            font-weight: bold;
            padding: 2px 4px;
          }

          .url-count.error {
            background: #ffcece;
            color: #550000;
          }

          .tags {
            display: none;
            height: 100%;
            margin-right: 5px;
          }

          @media (min-width: 1000px) {
            .tags {
              display: flex;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InputMiniTags;
