import React from "react";
import { useField } from "formik";
import "./inputField.css";

const InputField = ({ className, ...props }) => {
  const [field, meta] = useField(props);
  const errorClassName = meta.touched && meta.error ? " input-field-error" : "";

  return (
    <div className={className}>
      {meta.touched && meta.error ? (
        <div className="text-left text-danger error-msg">
          <small data-testid="formError">{meta.error}</small>
        </div>
      ) : null}
      <input
        className={"form-control text-center shadow-none " + errorClassName}
        {...field}
        {...props}
      />
    </div>
  );
};

export default InputField;
