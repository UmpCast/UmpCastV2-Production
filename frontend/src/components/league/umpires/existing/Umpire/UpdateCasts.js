import React from 'react'

import { Form } from "react-bootstrap"
export default function UpdateCasts(props) {

    const { title, max, onMaxChange } = props

    const onChange = e => {
        const new_max = e.target.value
        onMaxChange( new_max )
    }

    return (
        <div className="my-0 text-center">
            <small className="text-muted">
                max {title}: {max}
            </small><br/>
            <Form.Control
                type="range"
                min="0"
                max="100"
                value={max}
                onChange={onChange}
                custom />
        </div>
    )
}