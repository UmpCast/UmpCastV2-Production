import React, { useState, useEffect } from "react"

import { useApi } from "common/hooks.js"

import UpdateCasts from "./Umpire/UpdateCasts.js"
import { Dropdown, Button } from "react-bootstrap"

export default function AdjustCastsButton(props) {
    const { selected, onSeveralStatusChange } = props
    const Api = useApi(requests)

    const [state, setState] = useState({
        max_casts: 5,
        max_backups: 5
    })

    useEffect(() => {
        if (selected.length === 1)
            setState({
                max_casts: selected[0].max_casts,
                max_backups: selected[0].max_backups
            })
        else
            setState({
                max_casts: 5,
                max_backups: 5
            })
    }, [selected, setState])

    const onSubmit = async () => {
        const res = await Promise.all(
            selected.map((status) => Api.adjustMaxScheduling(status.pk, state))
        )

        onSeveralStatusChange(res.map(({data}) => data))
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="outline-primary rounded mx-1">
                Adjust Cast Limit
            </Dropdown.Toggle>
            <Dropdown.Menu className="px-2">
                <UpdateCasts
                    max={state.max_casts}
                    title="casts"
                    onMaxChange={(max_casts) => setState({ ...state, max_casts })}
                />
                <UpdateCasts
                    max={state.max_backups}
                    title="backups"
                    onMaxChange={(max_backups) => setState({ ...state, max_backups })}
                />
                <Button
                    className="rounded"
                    variant="primary"
                    onClick={onSubmit}
                    block
                >
                    Confirm
                </Button>
            </Dropdown.Menu>
        </Dropdown>
    )
}

const requests = {
    adjustMaxScheduling: (status_pk, values) => [
        "api/user-league-status/",
        {
            pk: status_pk,
            data: values
        },
        "PATCH"
    ]
}
