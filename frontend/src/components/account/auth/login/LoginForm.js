import React from "react"
import { Link } from "react-router-dom"
import { Form as FormikForm } from "formik"

import { TextInput } from "common/Input"

import { Button } from "react-bootstrap"

const LoginForm = ({ formik }) => (
    <FormikForm noValidate>
        <TextInput label="Username (email)" name="username" type="email" />
        <TextInput
            label={
                <div>
                    Password
                    <Link to="/reset-password" className="float-right">
                        Forgot your password?
                    </Link>
                </div>
            }
            name="password"
            type="password"
        />
        <Button disabled={formik.isSubmitting} type="submit">
            Login
        </Button>
    </FormikForm>
)

export default LoginForm
