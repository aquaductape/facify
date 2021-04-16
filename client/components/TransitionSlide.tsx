import { CSSTransition } from "react-transition-group";

type TTransitionSlideProps = {
  in: boolean;
  slideTo: "up" | "down";
  positionAbsolute: boolean;
  children: React.ReactNode;
};

const TransitionSlide = ({
  in: _in,
  slideTo,
  positionAbsolute,
  children,
}: TTransitionSlideProps) => {
  return (
    <CSSTransition in={_in} classNames="slide" timeout={200} unmountOnExit>
      <div className="container">
        <div className="container-inner">{children}</div>
        <style jsx>
          {`
            .container {
              position: ${positionAbsolute ? "absolute" : ""};
            }

            .container.slide-enter,
            .container.slide-exit {
              overflow: hidden;
            }

            .slide-enter .container-inner {
              transform: ${slideTo === "up"
                ? "translateY(101%)"
                : "translateY(-101%)"};
            }

            .slide-enter-active .container-inner {
              transform: translateY(0);
              transition: transform 200ms;
            }

            .slide-exit .container-inner {
              transform: translateY(0);
            }

            .slide-exit-active .container-inner {
              transform: ${slideTo === "up"
                ? "translateY(101%)"
                : "translateY(-101%)"};
              transition: transform 200ms;
            }
          `}
        </style>
      </div>
    </CSSTransition>
  );
};

export default TransitionSlide;
