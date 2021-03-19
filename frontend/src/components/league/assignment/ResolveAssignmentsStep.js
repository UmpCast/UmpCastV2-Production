import React from "react"

import {Card, Button} from "react-bootstrap"

const ResolveAssignmentsStep = ({resetSteps}) => {
    return (
        <>
            <Card.Subtitle className="mb-2 text-muted">
                <strong>Step 2: </strong>Review Assignments
            </Card.Subtitle>
            <Card.Text>
                Uncheck any assignments you would like
                skipped.
            </Card.Text>
            <Button
                variant="primary"
                className="rounded"
                onClick={resetSteps}
                block
            >
                Abort Assignment
            </Button>
        </>
    )
}

export default ResolveAssignmentsStep
