import React from "react"
import { Formik } from "formik"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"

import { useApi } from "common/hooks"

import ResetPasswordForm from "./ResetPasswordForm"

import { FocusContainer } from "common/components"
import { Card } from "react-bootstrap"

const initialValues = {
    email: "",
    reset_type: "email"
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Provide a valid email address")
        .required("Required"),
    reset_type: Yup.string().required("Required")
})

const requests = {
    resetPasword(values) {
        return [
            "api/users/reset_password/",
            {
                data: { ...values }
            },
            "POST"
        ]
    }
}

export default function ResetPassword() {
    const Api = useApi(requests)

    let history = useHistory()

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        console.log(values)
        Api.Submit(() => Api.resetPasword(values))
            .then(() => {
                history.push(`/reset-password/success?reset_type=${values.reset_type}`)
            })
            .catch((err) => setErrors(err.response.data))
            .finally(() => setSubmitting(false))
    }

    return (
        <FocusContainer wrap={true}>
            <Card>
                <Card.Body>
                    <h2 className="text-center">Reset Password</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        {(formik) => <ResetPasswordForm formik={formik} />}
                    </Formik>
                </Card.Body>
            </Card>
        </FocusContainer>
    )
}
