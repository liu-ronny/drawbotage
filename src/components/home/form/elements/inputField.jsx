import React from "react";
import FormError from "./formError";
import classNames from "classnames";
import { useField } from "formik";
import "./inputField.css";

function InputField({ className, ...props }) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;
  const divClassName = classNames({
    [className]: className,
  });
  const inputClassName = classNames(
    "form-control",
    "shadow-none",
    "text-center",
    {
      "home-form-input-field--error": hasError,
    }
  );

  const formError = hasError ? (
    <FormError alignText="left" text={meta.error} />
  ) : null;

  return (
    <div className={divClassName}>
      {formError}
      <input className={inputClassName} {...field} {...props} />
    </div>
  );
}

export default InputField;
