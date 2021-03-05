import React, { useState, Fragment } from "react"

import { Modal, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AddGameForm from "./AddGameForm"
import AddLocationForm from "./AddLocationForm"

const fakeLocations = [
    {
        pk: 1,
        title: "Middlefield Ballpark"
    },
    {
        pk: 2,
        title: "Hoover Park"
    },
    {
        pk: 3,
        title: "Palo Alto High School"
    }
]

export default function AddGameButton({ handleNewGame, league }) {
    const [state, setState] = useState({
        show: true,
        form: "game",
        locations: fakeLocations,
        cached: {}
    })

    const setShow = (show) => setState({ ...state, show })
    const setForm = (form) => setState({ ...state, form })

    const onLocationCancel = () => {
        setForm("game")
    }

    const onLocationAdded = (location) => {
        setState({
            ...state,
            form: "game",
            locations: [...state.locations, location]
        })
    }

    const onNewLocation = (values) => {
        setState({ ...state, form: "location", cached: { game: values } })
    }

    const RenderForm = ({ type }) => {
        switch (type) {
            case "game":
                return (
                    <AddGameForm
                        league={league}
                        locations={state.locations}
                        cached={state.cached.game}
                        onCancle={() => setShow(false)}
                        handleNewGame={handleNewGame}
                        onNewLocation={onNewLocation}
                    />
                )
            case "location":
                return (
                    <AddLocationForm
                        league_pk={league.pk}
                        onLocationCancel={onLocationCancel}
                        onLocationAdded={onLocationAdded}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Fragment>
            <Button
                variant="success rounded"
                className="mx-2 px-2 py-1"
                onClick={() => setShow(true)}
            >
                <FontAwesomeIcon icon="plus" className="mr-1 fa-sm" />
                Add Games
            </Button>
            <Modal show={state.show} onHide={() => setShow(false)} size="md">
                <RenderForm type={state.form} />
            </Modal>
        </Fragment>
    )
}
