import React from "react"

import { Row, Form } from "react-bootstrap"

export default function LocationToggle({location, onLocationToggled}) {
    return (
        <Row>
            <Form.Check
                type="checkbox"
                className="ml-3 mb-2"
                checked={location.available}
                onChange={() => onLocationToggled(location.pk)}
            />
            <div className="mx-2"/>
            {location.title}
        </Row>
    )
}
