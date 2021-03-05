import React from "react"

import { Row, Form } from "react-bootstrap"

export default function LocationToggle({location, enabled, onToggled}) {
    return (
        <Row>
            <Form.Check
                type="checkbox"
                checked={enabled}
                onChange={() => onToggled(location.pk)}
            />
            <div className="mx-2"/>
            {location.title}
        </Row>
    )
}
