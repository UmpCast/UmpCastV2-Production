import React from "react"

import { ListGroup } from "react-bootstrap"

export default function UmpireListing({ user, handleApply }) {
    return (
        <ListGroup.Item
            className="d-inline-flex justify-content-between align-items-center"
            onClick={() => handleApply(user.pk)}
            action
            key={user.pk}
        >
            <span>{user.first_name + " " + user.last_name}</span>
            {!canApply ? (
                <small className="float-right my-auto">Override</small>
            ) : null}
        </ListGroup.Item>
    )
}
