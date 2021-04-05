import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { default as _InputCheckBox } from "../../../components/InputCheckBox";
import { RootState } from "../../../store/rootReducer";
import { setMenu } from "../../Menu/menuSlice";

type TInputCheckBoxProps = {
  onChange: ChangeEventHandler;
};
const InputCheckBox = ({ onChange: _onChange }: TInputCheckBoxProps) => {
  const dispatch = useDispatch();
  const label = "Disable Notification Countdown";
  const id = label.toLowerCase().replace(" ", "-");
  const countDownChecked = useSelector(
    (state: RootState) => state.menu.disableNotificationCountDown
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    _onChange(e);
    dispatch(setMenu({ disableNotificationCountDown: e.target.checked }));
  };

  return (
    <_InputCheckBox
      id={id}
      label={label}
      onChange={onChange}
      checked={countDownChecked}
    ></_InputCheckBox>
  );
};

export default InputCheckBox;
