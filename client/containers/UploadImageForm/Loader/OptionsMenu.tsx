// Close Current Notification
//
// Close All Notifications
//
// Disable Notification Countdown
const OptionsMenu = () => {
  return (
    <div className="container">
      <div className="container-inner">
        <div className="kebab-down-arrow"> </div>
        <ul className="group">
          {/* <li>
        <div className="btn red">Cancel Current Upload</div>
      </li>
      <li>
        <div className="btn red">Cancel All Uploads</div>
      </li> */}
          <li>
            <div className="btn">Close Current Notification</div>
          </li>
          <li>
            <div className="btn">Close Current Notification</div>
          </li>
          <li>
            <div className="btn">Close All Notifications</div>
          </li>
          <li>
            <input
              type="checkbox"
              name=""
              id="disable-notification-countdown"
            />
            <label htmlFor="disable-notification-countdown">
              Disable Notification Countdown
            </label>
          </li>
        </ul>
      </div>
      <style jsx>
        {`
          .container {
            overflow: hidden;
          }

          .container.inner {
          }
          .group {
            padding: 0;
            margin: 0;
          }

          li {
            list-style-type: none;
            margin: 0;
          }

          li {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 5px 0;
            border-bottom: 2px solid #ccc;
          }

          .btn {
            padding: 2px 10px;
            border-radius: 5px;
            background: #d9d9d9;
          }

          li:last-child {
            border: 0;
          }
        `}
      </style>
    </div>
  );
};

export default OptionsMenu;
