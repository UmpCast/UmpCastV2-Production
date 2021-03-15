import React, { useState, useEffect, useCallback } from "react"
import useFocus from "../hooks/useFocus"

import { Form } from "react-bootstrap"

export default function SearchBar({
    onShortSearch,
    onLongSearch,
    delay = 250
}) {
    const [timeoutID, setTimeoutID] = useState(undefined)
    const [state, setState] = useState({ query: "", updated: true })
    const [ref] = useFocus()

    const onInputChange = (e) => {
        clearTimeout(timeoutID)
        setState({ query: e.target.value, updated: false })
    }

    const onQueryChange = useCallback(
        (q) => {
            if (q.length < 3) {
                onShortSearch(q)
            } else {
                setTimeoutID(setTimeout(onLongSearch, delay, q))
            }
        },
        [setTimeoutID, onShortSearch, onLongSearch, delay]
    )

    useEffect(() => {
        if (state.updated) return

        setState((state) => ({ ...state, updated: true }))
        onQueryChange(state.query)

        return () => clearTimeout(timeoutID)
    }, [state.query, state.updated, onQueryChange, timeoutID])

    return (
        <div>
            <Form.Control
                className="rounded"
                value={state.query}
                onChange={onInputChange}
                type="text"
                placeholder="Umpire Name"
                ref={ref}
            />
        </div>
    )
}
