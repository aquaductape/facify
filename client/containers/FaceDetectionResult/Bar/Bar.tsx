import React from "react";
import { useSelector } from "react-redux";
import CloseBtn from "../../../components/Logo/svg/CloseBtn";
import Stats from "../../Stats/Stats";
import { selectName } from "../../UploadImageForm/imageUrlSlice";

const Bar = ({ id, idx }: { id: string; idx: number }) => {
  const imageName = useSelector(selectName({ id }));
  return (
    <div className="bar">
      <div className="title">
        <div className="title-number">{idx + 1}</div>
        <div className="title-name">{imageName}</div>
      </div>
      <div className="stats">
        <Stats id={id}></Stats>
      </div>
      <button className="btn-remove">
        <CloseBtn></CloseBtn>
      </button>
      <style jsx>
        {`
          .bar {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
          }

          .title {
            display: flex;
            align-items: center;
          }

          .title-number {
            color: #888;
            font-size: 30px;
            margin: 0 20px;
            margin-right: 35px;
            font-weight: bold;
          }

          .title-name {
            font-size: 20px;
            max-width: 500px;
            text-overflow: ellipsis;
          }

          .stats {
            position: absolute;
            top: 0;
            left: 50%;
            height: 100%;
          }
          .btn-remove {
            height: 45px;
            width: 45px;
          }
        `}
      </style>
    </div>
  );
};

export default Bar;
