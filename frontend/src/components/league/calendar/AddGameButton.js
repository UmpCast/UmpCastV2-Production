import React, { useState, Fragment } from "react"

import { useApi, useMountEffect } from "common/hooks"

import { Modal, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AddGameForm from "./AddGameForm"
import AddLocationForm from "./AddLocationForm"

export default function AddGameButton({
    handleNewGame,
    locations,
    handleNewLocation,
    handleDeleteLocation,
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

    const onLocationAdded = (location) => {
        setState({
            ...state,
            form: "game"
        })

        handleNewLocation(location)
    }

    const onLocationDelete = (location_pk, values) => {
        values.location = ""
        Api.Submit(() => Api.deleteLocation(location_pk)).then(() => {
            handleDeleteLocation(location_pk)
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
                        handleNewGame={handleNewGame}
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
