import React, { useState } from "react"
import { useParams } from "react-router-dom"

import { useApi, useMountEffect } from "common/hooks.js"
import { TsRedirect } from "common/Api.js"

import Loader from "common/components.js"
import SettingsContainer from "../SettingsContainer.js"

import TsDivisions from "./teamsnap/TsDivisions.js"
import DivisionsCol from "./divisions/SortDivisions.js"
import AddDivisionButton from "./divisions/AddDivisionButton.js"

import { Row, Col, Button } from "react-bootstrap"
import { LeagueSyncFeatures } from "components/league/settings/Text.js"

export default function DivisionsSettings() {
    const { pk } = useParams()
    const Api = useApi(requests)

    const useLeague = useState()

    const [league, setLeague] = useLeague

    useMountEffect(() => {
        Api.fetchLeague(pk).then((res) => setLeague(res.data))
    })

    const handleNewDivision = (division) => {
        setLeague({
            ...league,
            divisions: [...league.divisions, division]
        })
    }

    const handleDeleteDivision = ({ pk }) => {
        setLeague({
            ...league,
            divisions: league.divisions.filter((division) => division.pk !== pk)
        })
    }

    return (
        <Loader dep={league}>
            <SettingsContainer league={league} active="divisions">
                <h3>
                    <strong>League Divisions</strong>
                </h3>
                <hr className="my-3" />
                <Row>
                    <Col lg={6} className="mb-4">
                        <h5 className="font-weight-bold">
                            Sync Divisions & Games
                        </h5>
                        <Button
                            variant="warning rounded my-2 font-weight-bold"
                            href={TsRedirect(pk)}
                        >
                            Sync Teamsnap
                        </Button>
                        <small className="form-text text-muted mb-3 mb-md-4">
                            <LeagueSyncFeatures />
                        </small>
                        <TsDivisions useLeague={useLeague} />
                    </Col>
                    <Col>
                        <AddDivisionButton
                            league={league}
                            handleNewDivision={handleNewDivision}
                        />
                        <DivisionsCol
                            useLeague={useLeague}
                            handleDeleteDivision={handleDeleteDivision}
                        />
                    </Col>
                </Row>
            </SettingsContainer>
        </Loader>
    )
}

const requests = {
    fetchLeague: (league_pk) => [
        "api/leagues/",
        {
            pk: league_pk
        }
    ]
}
