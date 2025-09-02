import React, { useState, Fragment } from "react"
import { Button, Modal } from "react-bootstrap"
import AddUmpireForm from './AddUmpireForm.js'

export default function AddUmpireButton({ league_pk }) {
    const [show, setShow] = useState(false)

    return (
        <Fragment>
            <Button variant="light border border-muted rounded float-right ml-auto" onClick={() => setShow(true)}>
                Create Umpire Account
            </Button>
            <Modal show={show} size="sm">
                <Modal.Header className="py-3 no-border">
                    <h5 className="my-auto mx-auto">
                        <strong>Provide Umpire Details</strong>
                    </h5>
                </Modal.Header>
                <Modal.Body className="text-center no-border py-0">
                    <AddUmpireForm />
                </Modal.Body>
            </Modal>
        </Fragment>
    )
}
