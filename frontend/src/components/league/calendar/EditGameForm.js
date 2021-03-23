import React from "react"
import { Formik, Form as FormikForm } from "formik"
import * as Yup from "yup"

import { useApi } from "common/hooks"

import { Modal, Button, Row, Col } from "react-bootstrap"
import { TextInput, SelectionInput, DateTimeInput } from "common/Input"

export default function EditGameForm({
    initialValues,
    locations,
    handleGameDelete,
    handleGameUpdate,
    league
}) {
    const Api = useApi(requests)

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        const new_values = {
            title: values.title,
            location: parseInt(values.location),
            date_time: values.date_time,
            description: values.description
        }
        
        Api.Submit(() => Api.editGame(initialValues.pk, new_values))
            .then((res) => {
                handleGameUpdate(res.data)
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
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {(formik) => (
                <FormikForm noValidate>
                    <Modal.Header closeButton className="no-border py-3">
                        <Modal.Title>Edit Game</Modal.Title>
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
                            label="Division (Cannot Edit)"
                            name="division"
                            className="rounded"
                            disabled
                        >
                            {divisionOptions}
                        </SelectionInput>
                        <SelectionInput
                            label="Location"
                            name="location"
                            className="rounded"
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
                        <Row className="w-100">
                            <Col className="px-1">
                                <Button
                                    disabled={formik.isSubmitting}
                                    variant="danger"
                                    className="rounded py-1"
                                    onClick={handleGameDelete}
                                    block
                                >
                                    Delete
                                </Button>
                            </Col>
                            <Col className="px-1">
                                <Button
                                    disabled={formik.isSubmitting}
                                    type="submit"
                                    variant="success"
                                    className="rounded py-1"
                                    block
                                >
                                    Update
                                </Button>
                                </Col>
                        </Row>
                    </Modal.Footer>
                </FormikForm>
            )}
        </Formik>
    )
}

const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    division: Yup.number().required("Required"),
    date_time: Yup.string().required("Required"),
    location: Yup.string().required("Required")
})

const requests = {
    editGame: (game_pk, values) => [
        "api/games/",
        {
            pk: game_pk,
            data: values
        },
        "PATCH"
    ]
}
