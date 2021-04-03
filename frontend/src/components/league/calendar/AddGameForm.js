import React from "react"
import { Formik, Form as FormikForm } from "formik"
import * as Yup from "yup"

import { useApi } from "common/hooks"

import { Modal, Button, InputGroup } from "react-bootstrap"
import { TextInput, SelectionInput, DateTimeInput } from "common/Input"

export default function AddGameForm({
    cached = {},
    locations,
    onLocationDelete,
    onCancle,
    onNewLocation,
    onNewGame,
    league
}) {
    const Api = useApi(requests)

    const onSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
        values.location = parseInt(values.location)
        values.division = parseInt(values.division)
        Api.Submit(() => Api.createGame(values))
            .then((res) => {
                onNewGame(res.data)
                resetForm()
            })
            .catch((err) => {
                setErrors(err.response.data)
            })
            .finally(() => {
                setSubmitting(false)
            })
    }

    const divisionOptions = league.divisions.map((div) => (
        <option value={div.pk} key={div.pk}>
            {div.title}
        </option>
    ))

    const locationOptions = locations.map((location) => (
        <option value={location.pk} key={location.pk}>
            {location.title}
        </option>
    ))

    return (
        <Formik
            initialValues={initialValues(cached)}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {(formik) => (
                <FormikForm noValidate>
                    <Modal.Header closeButton className="no-border py-3">
                        <Modal.Title>Create Game</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="no-border py-0">
                        <TextInput
                            label="Game title"
                            name="title"
                            type="text"
                            className="rounded"
                        />
                        <DateTimeInput label="Start Time" name="date_time" />
                        <SelectionInput
                            label="Division"
                            name="division"
                            className="rounded"
                        >
                            <option value="">Select Division</option>
                            {divisionOptions}
                        </SelectionInput>
                        <SelectionInput
                            label="Location"
                            name="location"
                            wrapper={(formControl) => (
                                <InputGroup className="rounded">
                                    <InputGroup.Prepend>
                                        <Button
                                            variant="outline-success"
                                            className="rounded-left"
                                            onClick={() =>
                                                onNewLocation(formik.values)
                                            }
                                        >
                                            Add New
                                        </Button>
                                    </InputGroup.Prepend>
                                    {formControl}
                                </InputGroup>
                            )}
                            className={
                                formik.values.location === ""
                                    ? "rounded-right"
                                    : ""
                            }
                        >
                            <option value="">Select Location</option>
                            {locationOptions}
                        </SelectionInput>
                        <TextInput
                            label="Description (optional)"
                            name="description"
                            type="text"
                            className="rounded"
                        />
                    </Modal.Body>
                    <Modal.Footer className="no-border pt-0">
                        {onCancle ? (
                            <Button
                                type="button"
                                variant="secondary rounded py-1"
                                onClick={onCancle}
                            >
                                Cancel
                            </Button>
                        ) : null}
                        <Button
                            disabled={formik.isSubmitting}
                            type="submit"
                            variant="primary"
                            className="rounded py-1"
                        >
                            Create
                        </Button>
                    </Modal.Footer>
                </FormikForm>
            )}
        </Formik>
    )
}

const initialValues = (cached) => ({
    title: "",
    division: "",
    date_time: new Date(),
    location: "",
    description: "",
    ...cached
})

const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    division: Yup.number().required("Required"),
    date_time: Yup.string().required("Required"),
    location: Yup.string().required("Required")
})

const requests = {
    createGame: (values) => [
        "api/games/",
        {
            data: values
        },
        "POST"
    ]
}
