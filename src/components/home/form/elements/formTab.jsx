import React from "react";
import classNames from "classnames";
import "./formTab.css";

function FormButton(props) {
  const tabClassName = classNames("home-form-tab", "font-weight-bold", "mr-3", {
    "home-form-tab--active": props.isSelected,
    [`border-${props.colorClass}`]: props.colorClass,
  });

  const sliderClassName = classNames("slider", {
    [`bg-${props.colorClass}`]: props.colorClass,
  });

  return (
    <React.Fragment>
      <span className={tabClassName} onClick={() => props.onClick(props.name)}>
        {props.text}
        <span className={sliderClassName}></span>
      </span>
    </React.Fragment>
  );
}

export default FormButton;
