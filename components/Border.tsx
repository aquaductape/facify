import { CSSProperties } from "react";

type TBorderProps = {
  placement: "top" | "left" | "bottom" | "right";
  direction?: "default" | "reverse";
  top?: string;
  right?: string;
  left?: string;
  corner?: boolean;
  height?: string;
  size: number;
  color: string;
};
const Border = ({
  color,
  placement,
  size: _size,
  direction,
  height,
  corner = true,
  top,
  right,
  left,
}: TBorderProps) => {
  const size = `${_size}px`;

  const style: CSSProperties = {
    display: "flex",
  };

  if (placement === "left" || placement === "right") {
    if (direction === "reverse") {
      style.transform = "scaleY(-1)";
    }

    style.flexDirection = "column";
    style.width = size;
    style.height = height ? height : `calc(100% + ${size})`;
  }

  if (placement === "top" || placement === "bottom") {
    if (direction === "reverse") {
      style.transform = "scaleX(-1)";
    }

    style.flexDirection = "row";
    style.left = 0;
    style.width = "100%";
    style.height = height ? height : size;
  }

  style[placement] = `-${_size}px`;

  if (top) style.top = top;
  if (right) style.right = right;
  if (left) style.right = right;

  const triangleClass = () => {
    let name = "";
    switch (placement) {
      case "top":
        name = "bottom-right";
        break;
      case "left":
        name = "bottom-right";
        break;
      case "right":
        name = "bottom-left";
        break;
      case "bottom":
        name = "top-right";
        break;
    }
    return `triangle-${name}`;
  };

  return (
    <div className="container" style={style}>
      {corner ? <div className={`triangle ${triangleClass()}`}></div> : null}
      <div className="bar"></div>
      <style jsx>
        {`
          .container {
            position: absolute;
            backface-visibility: hidden;
          }

          .bar {
            background: ${color};
            height: 100%;
            width: 100%;
          }

          .triangle-bottom-right {
            width: 0;
            height: 0;
            border-bottom: ${size} solid ${color};
            border-left: ${size} solid transparent;
          }

          .triangle-bottom-left {
            width: 0;
            height: 0;
            border-bottom: ${size} solid ${color};
            border-right: ${size} solid transparent;
          }

          .triangle-top-right {
            width: 0;
            height: 0;
            border-top: ${size} solid ${color};
            border-left: ${size} solid transparent;
          }
        `}
      </style>
    </div>
  );
};

export default Border;
