const Footer = () => {
  return (
    <footer className="container">
      © 2021 ᖴᗩᑕIᖴY
      <style jsx>
        {`
          .container {
            padding: 25px 0;
            margin-top: 40px;
            text-align: left;
            color: #fff;
          }

          .container::selection {
            color: #00f;
            background: #fff;
          }
          .container::-moz-selection {
            color: #00f;
            background: #fff;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
