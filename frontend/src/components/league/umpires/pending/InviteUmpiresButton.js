import React, { useState, Fragment } from "react"
import { Button, Modal } from "react-bootstrap"

export default function InvitUmpiresButton({ inviteLink }) {
    const [show, setShow] = useState(false)

    return (
        <Fragment>
            <Button variant="light border border-muted rounded float-right ml-auto" onClick={() => setShow(true)}>
                Invite Umpires
            </Button>
            <Modal show={show} size="sm">
                <Modal.Header className="py-3 no-border">
                    <h5 className="my-auto mx-auto">
                        <strong>Shared Invite Link</strong>
                    </h5>
                </Modal.Header>
                <Modal.Body className="text-center no-border py-0">
                    {inviteLink}
                </Modal.Body>
                <Modal.Footer className="no-border">
                    <Button
                        type="button"
                        onClick={() => setShow(false)}
                        variant="primary rounded py-1 mx-auto"
                    >
                        Great!
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}
