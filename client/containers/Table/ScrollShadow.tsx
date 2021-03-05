import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

const ScrollShadow = ({ id }: { id: string }) => {
  const scrollShadow = useSelector(
    (state: RootState) =>
      state.table.tables.find((item) => item.id === id)!.scrollShadow
  );

  return (
    <div className="scroll-shadow">
      <div className="scroll-inner-shadow"></div>
      <style jsx>
        {`
          .scroll-shadow {
            position: absolute;
            top: 0;
            right: 0;
            width: 25px;
            height: 100%;
            border-radius: 100%;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            background: radial-gradient(
              ellipse at 100%,
              #0000002e,
              transparent 24px
            );
            z-index: 10;
            pointer-events: none;
            transition: opacity 250ms;
          }
          .scroll-inner-shadow {
            height: 100%;
            background: linear-gradient(-90deg, #0000001f, transparent);
            width: 20px;
            margin-left: auto;
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .scroll-shadow {
            opacity: ${scrollShadow ? "1" : "0"};
          }
        `}
      </style>
    </div>
  );
};

export default ScrollShadow;
