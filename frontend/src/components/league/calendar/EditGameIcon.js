import React, { useState, Fragment } from "react"

import { Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EditGameForm from "./EditGameForm"
import dayjs from "dayjs"

export default function EditGameIcon({
    locations,
    dispatchGames,
    dispatchLocations,
    league,
    game
}) {
    const [show, setShow] = useState(false)
    return (
        <Fragment>
            <span className="text-warning" style={{ cursor: "pointer" }}>
                <FontAwesomeIcon
                    icon="edit"
                    className="ml-1 mb-1 fa-xs"
                    onClick={() => setShow(true)}
                />
            </span>
            <Modal show={show} onHide={() => setShow(false)} size="md">
                <EditGameForm
                    initialValues={{
                        ...game,
                        location: game.location.pk,
                        division: game.division.pk,
                        date_time: dayjs(game.date_time).toDate(),
                        description: game.description ?? ""
                    }}
                    dispatchGames={dispatchGames}
                    dispatchLocations={dispatchLocations}
                    locations={locations}
                    league={league}
                />
            </Modal>
        </Fragment>
    )
}
