import React, { useState, Fragment } from "react"

import { useApi } from "common/hooks.js"

import { Modal, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AddGameForm from "./AddGameForm.js"
import AddLocationForm from "./AddLocationForm.js"

export default function AddGameButton({
    locations,
    dispatchGames,
    dispatchLocations,
    league
}) {
    const Api = useApi(requests)

    const [state, setState] = useState({
        show: false,
        form: "game",
        cached: {}
    })

    const setShow = (show) => setState({ ...state, show })
    const setForm = (form) => setState({ ...state, form })

    const onLocationCancel = () => {
        setForm("game")
    }

    const onNewLocation = (values) => {
        setState({
            ...state,
            form: "location",
            cached: { ...state.cached, game: values }
        })
    }

    const onNewGame = (game) => {
        setState({...state, cached: {}})
        dispatchGames({type: "add", payload: game})
    }

    const onLocationAdded = (location) => {
        setState({
            ...state,
            form: "game"
        })

        dispatchLocations({type: "add", payload: location})
    }

    const onLocationDelete = (location_pk, values) => {
        values.location = ""
        Api.Submit(() => Api.deleteLocation(location_pk)).then(() => {
            dispatchLocations({type: "delete", payload: location_pk})
        })
    }

    const RenderForm = ({ type }) => {
        switch (type) {
            case "game":
                return (
                    <AddGameForm
                        league={league}
                        locations={locations}
                        cached={state.cached.game}
                        onCancle={() => setShow(false)}
                        onNewGame={onNewGame}
                        onNewLocation={onNewLocation}
                        onLocationDelete={onLocationDelete}
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

const requests = {
    deleteLocation: (location_pk) => [
        "api/locations/",
        {
            pk: location_pk
        },
        "DELETE"
    ]
}
