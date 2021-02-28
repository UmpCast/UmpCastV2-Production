import React from "react"

import { useApi } from "common/hooks"

import { Dropdown, Tooltip, OverlayTrigger } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function ApplyLevelDropdown(props) {
    const { selected, levels, onLevelApplied } = props
    const Api = useApi(requests)

    const onLevelClick = (level) => {
        const promises = selected.map((status_pk) =>
            Api.applyLevel(status_pk, level)
        )
        Api.Submit(() => Promise.all(promises).finally(onLevelApplied))
    }

    const renderedLevels = levels.map((level) => (
        <Dropdown.Item onClick={() => onLevelClick(level)} key={level.pk}>
            {level.title}
        </Dropdown.Item>
    ))

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {"Go to Settings -> Umpires and add a level!"}
        </Tooltip>
    )

    return (
        <Dropdown>
            <Dropdown.Toggle variant="outline-primary rounded mx-1">
                Apply Level
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {levels.length > 0 ? (
                    renderedLevels
                ) : (
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <Dropdown.Item>
                            League has no Levels
                            <FontAwesomeIcon icon="info-circle" className="ml-1" />
                        </Dropdown.Item>
                    </OverlayTrigger>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const requests = {
    applyLevel(status_pk, level) {
        return [
            `api/user-league-status/${status_pk}/apply_level/`,
            {
                data: { level: level.pk }
            },
            "POST"
        ]
    }
}
