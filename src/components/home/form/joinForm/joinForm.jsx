import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../elements/inputField";
import validateRoomId from "../../../../api/validateRoomId";

class JoinForm extends Component {
  handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    this.props.onSubmit(values, false);
  };

  render() {
    if (!this.props.isSelected) {
      return null;
    }

    return (
      <Formik
        initialValues={{
          name: "",
          roomId: this.props.roomId ? this.props.roomId : "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(50, "Must be 100 characters or less")
            .required("Required"),
          roomId: Yup.string()
            .required("Required")
            .test("room ID is valid", "Invalid room ID", validateRoomId),
        })}
        onSubmit={this.handleSubmit}
      >
        <Form autoComplete="off">
          <div className="form-group text-center mt-4">
            <InputField
              name="name"
              type="text"
              spellCheck="false"
              placeholder="Your name"
            />
            <InputField
              className="mt-2"
              name="roomId"
              type="text"
              spellCheck="false"
              placeholder="Room ID"
            />
            <button type="submit" className="btn btn-primary w-50 mt-3">
              Join
            </button>
          </div>
        </Form>
      </Formik>
    );
  }
}

export default withRouter(JoinForm);
