import { TSortValueType } from "../../containers/FaceDetectionResult/ImageResult/demographicsSlice";

type TSortingIcon = {
  action: "ASC" | "DESC" | "Initial";
  show: TSortValueType;
};
const Sorting = ({ action, show }: TSortingIcon) => {
  const iconClassName = (name: string) => {
    return `${name} ${name === show ? "active" : ""}`;
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.019 4.37">
      <g className={`arrow ${action.toLowerCase()}`}>
        <path
          d="M.942 2.836V.283"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.265}
        />
        <path
          d="M1.885 2.672L.943 4.086 0 2.672z"
          fill="currentColor"
          paintOrder="markers fill stroke"
        />
      </g>
      <g className={iconClassName("numerical")} fill={"currentColor"}>
        <path d="M4.1 0l-.544.1v.318l.508-.09v1.358h-.466v.3h1.3v-.3h-.466V0zM4.168 2.315c-.221 0-.404.061-.54.187a.652.652 0 00-.206.5c0 .208.066.38.197.504.132.123.31.183.53.183.107 0 .207-.02.296-.062.044-.02.073-.059.11-.088-.026.149-.052.296-.122.375-.09.104-.22.156-.4.156a.965.965 0 01-.207-.023 1.186 1.186 0 01-.21-.068l-.06-.024v.328l.03.008c.08.026.159.046.235.059.075.013.152.02.226.02.276 0 .503-.095.668-.282.166-.188.248-.439.248-.746 0-.327-.066-.58-.203-.758-.136-.18-.338-.27-.592-.27zm0 .287a.35.35 0 01.274.105c.067.07.101.166.101.295 0 .13-.034.226-.101.297a.354.354 0 01-.274.106.357.357 0 01-.275-.106c-.066-.07-.1-.167-.1-.297 0-.13.034-.225.1-.295a.354.354 0 01.275-.105z" />
      </g>
      <g className={iconClassName("alphabetical")} fill={"currentColor"}>
        <path d="M4.003.019l-.01.025-.832 1.96h.393l.193-.49h.895l.193.49h.389L4.382.018zm.19.406l.326.793h-.652zM3.324 2.366v.299h1.252L3.29 4.097v.254h1.808V4.05H3.783l1.283-1.43v-.254z" />
      </g>
      <g className={iconClassName("percentage")} fill={"currentColor"}>
        <path d="M5.248 2.383a.351.351 0 00-.306.166c-.074.11-.11.264-.11.46 0 .195.036.348.11.46.074.11.176.166.306.166a.342.342 0 00.3-.166c.075-.112.112-.265.112-.46s-.037-.348-.112-.458a.341.341 0 00-.3-.168zm0-.284c.236 0 .424.082.562.246.14.164.209.386.209.665 0 .28-.07.5-.21.665a.698.698 0 01-.56.244.706.706 0 01-.567-.244c-.139-.164-.208-.386-.208-.665 0-.28.069-.502.208-.665a.707.707 0 01.566-.246zM3.137.735a.348.348 0 00-.305.168c-.073.11-.11.263-.11.457 0 .197.037.35.11.46.073.111.175.167.305.167s.231-.056.304-.166c.075-.11.112-.264.112-.461 0-.193-.037-.345-.112-.457a.348.348 0 00-.304-.168zM4.724.45h.358l-1.42 3.47h-.359zm-1.587 0c.236 0 .424.083.564.247.14.162.21.383.21.663 0 .282-.07.504-.21.667a.703.703 0 01-.564.244.703.703 0 01-.564-.244c-.138-.164-.206-.387-.206-.667 0-.278.069-.499.208-.663A.698.698 0 013.137.45z" />
      </g>
      <style jsx>
        {`
          .percentage,
          .alphabetical,
          .numerical {
            transform: scale(0);
            opacity: 0;
            transition: transform 400ms, opacity 400ms;
            transform-origin: center;
            transform-box: view-box;
          }

          .percentage.active,
          .alphabetical.active,
          .numerical.active {
            transform: scale(1);
            opacity: 1;
          }

          .arrow {
            transition: transform 400ms;
            transform-origin: center;
            transform-box: view-box;
          }

          .arrow.desc {
            transform: scaleY(-1);
          }
        `}
      </style>
    </svg>
  );
};

export default Sorting;
