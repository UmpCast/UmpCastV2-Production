import React from 'react'

import { CustomToggle } from "tools/Display"

import UpdateCasts from "./UpdateCasts"

import { Dropdown, Badge } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function CastsBar(props) {

    const {onChange, status, type} = props
    const max = status[`max_${type}`]
    const casted = 0

    const bar = []

    for (let i = 0; i < casted; i++) {
        bar.push(<FontAwesomeIcon className="text-success mr-1" icon={['fas', 'square']} key={i} />)
    }

    for (let i = casted; i < max; i++) {
        bar.push(<FontAwesomeIcon className="text-muted mr-1" icon={['fas', 'square']} key={i} />)
    }

    return (
        <Dropdown className="text-center">
            <Dropdown.Toggle as={CustomToggle}>
                {bar.length === 0 ?
                    <Badge variant="light text-muted border border-muted">zero</Badge> :
                    bar}
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-1 py-0 px-2 ump-centered-dropdown-menu" style={{ "width": "250px" }}>
                <UpdateCasts onChange={onChange} status={status} type={type}/>
            </Dropdown.Menu>
        </Dropdown>
    )
}
