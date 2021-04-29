import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";

type TWebcamForm = {};
const WebcamForm = () => {
  const dispatch = useDispatch();
  const inputResult = useSelector((state: RootState) => state.form.inputResult);

  if (!inputResult.length) return null;
  return (
    <div className="container">
      <button className="submit-btn">Detect</button>
      <style jsx>
        {`
          .container {
            position: relative;
            height: 100%;
          }

          .submit-btn {
            position: absolute;
            bottom: 15px;
            right: 15px;
            padding: 10px 55px;
            height: 45px;
            color: #fff;
            background: #000066;
            font-size: 18px;
            transition: background-color 250ms;
          }

          @media not all and (pointer: coarse) {
            .submit-btn:hover {
              background: #000;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WebcamForm;
