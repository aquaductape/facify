const squareSize = 25;
const color = "#fff";

const SwappingSquares = () => {
  return (
    <div className="swapping-squares-spinner">
      <div className="square" />
      <div className="square" />
      <div className="square" />
      <div className="square" />
      <style jsx>
        {`
          .swapping-squares-spinner,
          .swapping-squares-spinner * {
            box-sizing: border-box;
          }

          .swapping-squares-spinner {
            height: ${squareSize}px;
            width: ${squareSize}px;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            transform: scale(1.5);
          }

          .swapping-squares-spinner .square {
            height: calc(${squareSize}px * 0.25 / 1.3);
            width: calc(${squareSize}px * 0.25 / 1.3);
            animation-duration: 1000ms;
            border: calc(${squareSize}px * 0.04 / 1.3) solid ${color};
            margin-right: auto;
            margin-left: auto;
            position: absolute;
            animation-iteration-count: infinite;
          }

          .swapping-squares-spinner .square:nth-child(1) {
            animation-name: swapping-squares-animation-child-1;
            animation-delay: 500ms;
          }

          .swapping-squares-spinner .square:nth-child(2) {
            animation-name: swapping-squares-animation-child-2;
            animation-delay: 0ms;
          }

          .swapping-squares-spinner .square:nth-child(3) {
            animation-name: swapping-squares-animation-child-3;
            animation-delay: 500ms;
          }

          .swapping-squares-spinner .square:nth-child(4) {
            animation-name: swapping-squares-animation-child-4;
            animation-delay: 0ms;
          }

          @keyframes swapping-squares-animation-child-1 {
            50% {
              transform: translate(150%, 150%) scale(2, 2);
            }
          }

          @keyframes swapping-squares-animation-child-2 {
            50% {
              transform: translate(-150%, 150%) scale(2, 2);
            }
          }

          @keyframes swapping-squares-animation-child-3 {
            50% {
              transform: translate(-150%, -150%) scale(2, 2);
            }
          }

          @keyframes swapping-squares-animation-child-4 {
            50% {
              transform: translate(150%, -150%) scale(2, 2);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SwappingSquares;
