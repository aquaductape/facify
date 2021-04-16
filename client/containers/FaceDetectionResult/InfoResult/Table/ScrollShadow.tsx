const ScrollShadow = ({ id }: { id: string }) => {
  return (
    <div data-id-scroll-shadow={id} className="scroll-shadow">
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
              #00000017,
              transparent 24px
            );
            z-index: 10;
            pointer-events: none;
            transition: opacity 250ms;
          }
          .scroll-inner-shadow {
            height: 100%;
            background: linear-gradient(-90deg, #00000042, transparent);
            width: 20px;
            margin-left: auto;
          }
        `}
      </style>
    </div>
  );
};

export default ScrollShadow;
