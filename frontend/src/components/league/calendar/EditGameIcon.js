import React, { useState, Fragment } from "react"

import { Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EditGameForm from "./EditGameForm"
import dayjs from "dayjs"

export default function EditGameIcon({
    locations,
    dispatchGames,
    league,
    game
}) {
    
    const handleGameUpdate = (game) => {
        setShow(false)
        dispatchGames({type: "edit", payload: game})
    }

    const handleGameDelete = (pk) => {
        setShow(false)
        dispatchGames({type: "delete", payload: pk})
    }

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
                    handleGameUpdate={handleGameUpdate}
                    handleGameDelete={handleGameDelete}
                    locations={locations}
                    league={league}
                />
            </Modal>
        </Fragment>
    )
}
