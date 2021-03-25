import ErrorCircle from "./svg/ErrorCircle";

type TMiniImageProps = {
  url: string;
  error: boolean;
  maxHeight?: number;
  maxWidth?: number;
  isUrlTag?: boolean;
  margin?: string;
  onError: () => void;
};
const MiniImage = ({
  error,
  url,
  onError,
  maxHeight = 25,
  maxWidth = 35,
  isUrlTag = false,
  margin = "0 3px",
}: TMiniImageProps) => {
  return (
    <div className="container">
      {error ? (
        <div className="error">
          <ErrorCircle></ErrorCircle>
        </div>
      ) : (
        <div className="image-container">
          <div className="image">
            <img
              src={url}
              onError={onError}
              aria-hidden="true"
              alt="image base on url input"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .error {
          color: #f00;
          width: 25px;
          height: 25px;
        }

        .image-container {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          height: 100%;
          filter: drop-shadow(2px 2px 0px #002f9d);
          overflow: hidden;
        }

        .image {
          position: relative;
        }

        img {
          display: block;
        }
      `}</style>

      {/* dynamic */}
      <style jsx>
        {`
          img {
            max-width: ${maxWidth}px;
            max-height: ${maxHeight}px;
          }

          .container {
            margin: ${margin};
            ${isUrlTag ? `height: 100%;` : ""}
            ${error
              ? `
              display: flex;
              align-items: center;
              `
              : ""}
          }

          .image {
            ${isUrlTag
              ? `
              width: 35px;
              height: 100%;
              margin: 0 5px;
              `
              : ""}
          }

          img {
            ${isUrlTag
              ? `
              object-fit: contain;
              width: 100%;
              height: 100%;
              `
              : ""}
          }
          .error {
            ${isUrlTag
              ? `
            margin: 0 5px;
            width: 35px;
            `
              : ""}
          }

          @media (min-width: 500px) {
            .image {
              ${isUrlTag
                ? `
              margin-right: 10px;
              `
                : ""}
            }
            .error {
              ${isUrlTag
                ? `
              margin-right: 10px;
              `
                : ""}
            }
          }
        `}
      </style>
    </div>
  );
};

export default MiniImage;
