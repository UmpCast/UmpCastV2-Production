import React from "react"
import { Formik, Form as FormikForm } from "formik"
import * as Yup from "yup"

import { useApi } from "common/hooks"

import { TextInput, MyPhoneInput } from "common/Input"
import { OauthUserValidate } from "common/Api"

import { Row, Col } from "react-bootstrap"

export default function RegisterDetails({ setShow }) {
    const Api = useApi(requests)

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        const new_values = {
            password: "testing123",
            password2: "testing123",
            ...handlePhone(values)
        }

        Api.register(new_values)
            .then((res) => {
                const ump_pk = res.data.pk;

            })
            .catch((err) => {
                setErrors(err.response.data)
                setSubmitting(false)
            })
    }

    return (
        <div className="mt-2">
            <Formik
                initialValues={initialValues(migrated)}
                {...{
                    validationSchema,
                    validate,
                    onSubmit
                }}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {(formik) => <DetailsForm formik={formik} />}
            </Formik>
        </div>
    )
}

const DetailsForm = ({ formik }) => {
    return (
        <FormikForm>
            <TextInput label="Email" name="email" type="email" />
            <Row>
                <Col sm={12} md={6}>
                    <TextInput
                        label="First name"
                        name="first_name"
                        type="text"
                    />
                </Col>
                <Col sm={12} md={6}>
                    <TextInput label="Last name" name="last_name" type="text" />
                </Col>
            </Row>
            <MyPhoneInput
                label="Phone Number"
                name="phone_number"
                type="text"
                className="rounded"
            />
            <SubmitButtons
                formik={formik}
                setShow={setShow}
                className="ml-auto debug"
            />
        </FormikForm>
    )
}

const initialValues = {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    phone_number: ""
}

const validationSchema = Yup.object({
    email: Yup.string().required("required"),
    first_name: Yup.string()
        .max(32, "first name has max of 32 characters")
        .required("required"),
    last_name: Yup.string()
        .max(32, "last name has max of 32 characters")
        .required("required"),
    password: Yup.string().required("required"),
    password2: Yup.string().required("required"),
    phone_number: Yup.string()
        .min(12, "Ensure this is a 10-digit number")
        .max(12, "Ensure this is a 10-digit number")
})

const validate = (values) => {
    const match =
        values.password === values.password2 || values.password2 === ""

    return match ? {} : { password2: "passwords don't match" }
}

const handlePhone = (values) => {
    let new_values = values

    const { phone_number } = new_values

    if (phone_number === "") {
        delete new_values.phone_number
    } else {
        new_values.phone_number = phone_number.replace(/\D/g, "")
    }

    return new_values
}

const requests = {
    register: (values) => [
        "api/users/",
        {
            data: values
        },
        "POST"
    ],
    decideUls: (pk) => [
        "api/user-league-status/",
        {
            pk: league_pk,
            data: {
                request_status: status
            }
        },
        "PATCH"
    ]
}
