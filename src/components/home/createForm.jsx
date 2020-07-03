import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "./inputField";

class CreateForm extends Component {
  handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
    this.props.onSubmit(values, true);
  };

  render() {
    return (
      <React.Fragment>
        {this.props.selected ? (
          <Formik
            initialValues={{
              name: "",
              roomName: "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .max(100, "Must be 100 characters or less")
                .required("Required"),
              roomName: Yup.string()
                .max(100, "Must be 100 characters or less")
                .required("Required"),
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
                  name="roomName"
                  type="text"
                  className="mt-2"
                  spellCheck="false"
                  placeholder="Room name"
                />
                <button
                  type="submit"
                  className="btn btn-dark-primary w-50 mt-3"
                >
                  Create
                </button>
              </div>
            </Form>
          </Formik>
        ) : null}
      </React.Fragment>
    );
  }
}

export default withRouter(CreateForm);
