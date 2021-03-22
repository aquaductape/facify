type TMiniImageProps = {
  url: string;
  error: boolean;
  maxHeight?: number;
  maxWidth?: number;
  onError: () => void;
};
const MiniImage = ({
  error,
  onError,
  url,
  maxHeight = 25,
  maxWidth = 35,
}: TMiniImageProps) => {
  return (
    <div className="container">
      <div className="image">
        {error ? (
          <div>Bad</div>
        ) : (
          <img
            src={url}
            onError={onError}
            aria-hidden="true"
            alt="image base on url input"
          />
        )}
      </div>
      <style jsx>{`
        .container {
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
        }
      `}</style>
      {/* dynamic */}
      <style jsx>
        {`
          img {
            max-width: ${maxWidth}px;
            max-height: ${maxHeight}px;
          }
        `}
      </style>
    </div>
  );
};

export default MiniImage;
