import { useEffect } from "react";

type TClassifySectionProps = {
  type: "sort" | "filter" | null;
};
const ClassifySection = ({ type }: TClassifySectionProps) => {
  useEffect(() => {}, []);

  return (
    <div className="container">
      {type}
      <div>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam saepe
        eos, dignissimos porro placeat cumque quo in possimus dolorum,
        repellendus nihil maiores excepturi. Neque nam voluptates asperiores, ad
        eius quo.
      </div>
      <style jsx>{`
        .container {
          position: fixed;
          overflow-x: auto;
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default ClassifySection;
