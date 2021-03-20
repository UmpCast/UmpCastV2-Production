import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Row, Col, Card } from "react-bootstrap"

import Loader from "common/components"
import { useApi, useFetchLeague } from "common/hooks"
import LeagueContainer from "components/league/LeagueContainer"
import StartAssignmentStep from "./StartAssignmentStep"
import SelectDateRangeStep from "./SelectDateRangeStep"
import ResolveAssignmentsStep from "./ResolveAssignmentsStep"
import AssignmentsCompleteStep from "./AssignmentsCompleteStep"

import AssignmentTable, {
    DateRangeMissing,
    AssignmentsLoading,
    AssignmentsComplete
} from "./AssignmentTable"

const steps = {
    ABORT: 0,
    SELECT_DATE_RANGE: 1,
    RESOLVE_ASSIGNMENTS: 2,
    ASSIGNMENTS_COMPLETE: 3
}

const initialState = {
    step: steps.SELECT_DATE_RANGE,
    assignments: [],
    rejected: [],
    loading: false
}

const requests = {
    gameSignup: (user_pk, post_pk) => [
        "api/applications/",
        {
            data: {
                user: user_pk,
                post: post_pk
            }
        },
        "POST"
    ]
}

const Assignment = () => {
    const Api = useApi(requests)

    const { pk } = useParams()
    const [league] = useFetchLeague(pk)

    const [state, setState] = useState(initialState)

    const resetSteps = () => {
        setState({ initialState, step: steps.SELECT_DATE_RANGE })
    }

    const renderStep = (step) => {
        switch (step) {
            case steps.ABORT:
                return <StartAssignmentStep onStart={resetSteps} />
            case steps.SELECT_DATE_RANGE:
                const onAssignmentBegin = () => {
                    setState({
                        ...state,
                        loading: true
                    })
                }

                const onAssignmentComplete = (data) => {
                    setState({
                        step: steps.RESOLVE_ASSIGNMENTS,
                        assignments: data,
                        loading: false
                    })
                }

                return (
                    <SelectDateRangeStep
                        resetSteps={() => setState({...initialState, step: steps.ABORT})}
                        league={league}
                        onAssignmentBegin={onAssignmentBegin}
                        onAssignmentComplete={onAssignmentComplete}
                    />
                )
            case steps.RESOLVE_ASSIGNMENTS:
                return <ResolveAssignmentsStep resetSteps={resetSteps} />
            case steps.ASSIGNMENTS_COMPLETE:
                return <AssignmentsCompleteStep />
            default:
                return null
        }
    }

    const renderTable = (step) => {
        switch (step) {
            case steps.SELECT_DATE_RANGE:
                if (state.loading) return <AssignmentsLoading />
                else return <DateRangeMissing />
            case steps.RESOLVE_ASSIGNMENTS:
                const onAssign = async (assignments) => {
                    await Promise.all(
                        assignments.map(({ user, post }) =>
                            Api.gameSignup(user.pk, post.pk)
                        )
                    )

                    setState({ ...state, step: steps.ASSIGNMENTS_COMPLETE })
                }

                return (
                    <AssignmentTable
                        assignments={state.assignments}
                        league={league}
                        onAssign={onAssign}
                    />
                )
            case steps.ASSIGNMENTS_COMPLETE:
                return <AssignmentsComplete />
            default:
                return null
        }
    }

    return (
        <Loader dep={league}>
            <LeagueContainer league={league} active="assignment">
                <Row>
                    <Col xs={8} className="d-flex">
                        {renderTable(state.step)}
                    </Col>
                    <Col xs={4}>
                        <Card style={{ width: "18rem" }}>
                            <Card.Body>
                                <Card.Title>Game Auto-Assign</Card.Title>
                                {renderStep(state.step)}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </LeagueContainer>
        </Loader>
    )
}

export default Assignment
