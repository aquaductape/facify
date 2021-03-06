import React from "react";

const FaceIcon = ({ title }: { title: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150.589"
      height="150.589"
      viewBox="0 0 39.843 39.843"
    >
      <title>{title}</title>
      <g paintOrder="markers fill stroke">
        <g stroke="currentColor">
          <path
            fill="none"
            strokeWidth="3.116"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M1.558 1.558h36.727v36.727H1.558z"
          />
          <path
            d="M15.405 26.918c.287 2.098 2.16 3.669 4.38 3.67 2.219 0 4.093-1.57 4.38-3.67"
            fill="none"
            strokeWidth="2.224"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g fill="currentColor">
          <circle cx="11.808" cy="19.066" r="3.297" />
          <circle cx="-28.035" cy="19.066" r="3.297" transform="scale(-1 1)" />
        </g>
      </g>
    </svg>
  );
};

export default FaceIcon;
