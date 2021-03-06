const Intruction = () => {
  return (
    <div className="main">
      <button>X</button>
      <div className="video">
        <video
          src="/dragndrop-content.mp4"
          autoPlay
          muted
          loop
          controls
          playsInline
        ></video>
      </div>
      <style jsx>
        {`
          .main {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 500;
          }

          button {
            position: absolute;
          }
          .video {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          video {
            display: block;
          }
        `}
      </style>
    </div>
  );
};

export default Intruction;
