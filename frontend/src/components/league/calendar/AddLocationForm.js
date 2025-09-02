import React from "react"
import { Formik, Form as FormikForm } from "formik"
import * as Yup from "yup"

import { useApi } from "common/hooks.js"
import { TitleInput } from "common/forms.js"

export default function AddLocationForm({
    league_pk,
    onLocationAdded,
    onLocationCancel
}) {
    const Api = useApi(requests)

    const onSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
        Api.Submit(() => Api.createLocation({ ...values, league: league_pk }))
        // Api.Submit(() => Promise.resolve({data: {pk: 4, title: "New location"}}))
            .then((res) => {
                resetForm()
                setSubmitting(false)
                onLocationAdded(res.data)
            })
            .catch((err) => {
                setErrors(err.response.data)
                setSubmitting(false)
            })
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {(formik) => (
                <FormikForm noValidate>
                    <TitleInput
                        action="Create Location"
                        confirm="Create"
                        setShow={onLocationCancel}
                        formik={formik}
                    />
                </FormikForm>
            )}
        </Formik>
    )
}

const initialValues = {
    title: ""
}

const validationSchema = Yup.object({
    title: Yup.string()
        .max(32, "Max character length of 32")
        .required("Required")
})

const requests = {
    createLocation: (values) => [
        "api/locations/",
        {
            data: values
        },
        "POST"
    ]
}
