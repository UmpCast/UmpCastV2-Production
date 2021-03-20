import React from "react"

import { Card } from "react-bootstrap"

const AssignmentsCompleteStep = () => {
    return (
        <>
            <Card.Subtitle className="mb-2 text-muted">
                <strong>Auto-Assign Success!</strong>
            </Card.Subtitle>
            <Card.Text>
                All accepted assignments have been registered. Please navigate
                to the calendar to confirm.
            </Card.Text>
        </>
    )
}

export default AssignmentsCompleteStep
