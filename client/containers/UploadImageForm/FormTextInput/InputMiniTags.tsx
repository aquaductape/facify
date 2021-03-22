import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";

const InputMiniTags = () => {
  const urls = useSelector((state: RootState) => state.form.urlItems);

  return (
    <div aria-hidden="true" className="container">
      <div className="content">
        <div className="tags">
          {urls.slice(0, 3).map(({ id, content, error }) => {
            return (
              <div className="image-container" key={id}>
                <div className="image">
                  {error ? (
                    <div>Bad</div>
                  ) : (
                    <img
                      src={content}
                      // onError={() => onError(id)}
                      aria-hidden="true"
                      alt="image base on url input"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {urls.length ? <div className="url-count">{urls.length}</div> : null}
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

          .tags {
            display: none;
            height: 100%;
            margin-right: 5px;
          }

          .image-container {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            height: 100%;
            filter: drop-shadow(2px 2px 0px #002f9d);
            overflow: hidden;
            margin: 0 3px;
          }

          .image {
            position: relative;
          }

          img {
            display: block;
            max-width: 35px;
            max-height: 25px;
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
