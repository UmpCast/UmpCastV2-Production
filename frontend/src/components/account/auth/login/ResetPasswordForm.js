import React from "react"
import { Form as FormikForm } from "formik"

import { TextInput, SelectionInput } from "common/Input"

import { Button } from "react-bootstrap"

const LoginForm = ({ formik }) => (
    <FormikForm noValidate>
        <TextInput
            label="Email"
            name="email"
            type="email"
            className="rounded"
        />
        <SelectionInput
            label="Reset with"
            name="reset_type"
            className="rounded"
        >
            <option value="email">Email</option>
            <option value="sms">Phone Number</option>
        </SelectionInput>
        <Button
            disabled={formik.isSubmitting}
            type="submit"
            className="rounded"
        >
            Reset
        </Button>
    </FormikForm>
)

export default LoginForm
