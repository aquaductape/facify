// Finding Faces
// Compressing
// bg #30117d

import SwappingSquares from "../../components/Spinners/SwappingSquares";

// cancel btn color #cbc3de
const Loader = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <div className="container">
      <SwappingSquares></SwappingSquares>
      <div className="btn-container">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <style jsx>
        {`
          .container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            background: #30117d;
          }

          .btn-container {
            position: absolute;
            top: 0;
            right: 10px;
            height: 100%;
            width: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .cancel-btn {
            font-size: 18px;
            padding: 5px;
            width: 100%;
            background: transparent;
            border: 2px solid #cbc3de;
            color: #cbc3de;
            transition: background-color 250ms, color 250ms;
          }

          .cancel-btn:hover {
            color: #30117d;
            background: #cbc3de;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
