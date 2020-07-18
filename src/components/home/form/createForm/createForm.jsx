import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../elements/inputField";

class CreateForm extends Component {
  handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    this.props.onSubmit(values, true);
  };

  render() {
    if (!this.props.isSelected) {
      return null;
    }

    return (
      <Formik
        initialValues={{
          name: "",
          roomName: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(100, "Must be 100 characters or less")
            .required("Required"),
          // .test("name is valid", "That name is already taken", validatePlayerName()),
          roomName: Yup.string()
            .max(100, "Must be 100 characters or less")
            .required("Required"),
        })}
        onSubmit={this.handleSubmit}
      >
        <Form autoComplete="off">
          <div className="home-form-create form-group text-center mt-4">
            <InputField
              name="name"
              type="text"
              spellCheck="false"
              placeholder="Your name"
            />
            <InputField
              name="roomName"
              type="text"
              className="mt-2"
              spellCheck="false"
              placeholder="Room name"
            />
            <button type="submit" className="btn btn-dark-primary w-50 mt-3">
              Create
            </button>
          </div>
        </Form>
      </Formik>
    );
  }
}

export default withRouter(CreateForm);
