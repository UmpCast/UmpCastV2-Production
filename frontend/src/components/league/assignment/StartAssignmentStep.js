import React from "react"

import { Card, Button } from "react-bootstrap"

const StartAssignmentStep = ({onStart}) => {
    return (
        <>
            <Card.Subtitle className="mb-2 text-muted">
                <strong>Auto-Assign aborted</strong>
            </Card.Subtitle>
            <Card.Text>
                You may have no assignments available or 
                need to shorten the game date range.
            </Card.Text>
            <Button
                variant="primary"
                className="rounded"
                onClick={onStart}
                block
            >
                Restart Auto-Assign
            </Button>
        </>
    )
}

export default StartAssignmentStep
