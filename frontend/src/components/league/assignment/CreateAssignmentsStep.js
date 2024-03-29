import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, Button, Form, Alert, Dropdown } from "react-bootstrap"
import dayjs from "dayjs"

import { useApi, useMountEffect } from "common/hooks"
import DateRangeInput from "./DateRangeInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCountDown, useTimeout, useInterval } from "./useTask"

const page_size = 10
const requests = {
    makeAssignments(league_pk, data) {
        return [
            `api/leagues/${league_pk}/auto_assign/`,
            {
                data
            },
            "POST",
            false
        ]
    },
    checkAssignmentsComplete(assignment_pk) {
        return [
            "api/assignments/",
            {
                pk: assignment_pk
            },
            "GET",
            false
        ]
    },
    fetchAssignments(assignment_pk, page, page_size) {
        return [
            "api/assignment-items/",
            {
                params: {
                    assignment: assignment_pk,
                    page,
                    page_size
                }
            },
            "GET"
        ]
    },
    fetchPastAssignments(league_pk) {
        return [
            "api/assignments/",
            {
                params: { league: league_pk, page_size: 3 }
            },
            "GET",
            false
        ]
    }
}

const SelectDateRangeStep = ({
    resetSteps,
    onAssignmentBegin,
    onAssignmentComplete,
    league
}) => {
    const Api = useApi(requests)
    const [submitting, setSubmitting] = useState(false)
    const [pastAssignments, setPastAssignments] = useState([])

    const [countDownTimeout] = useTimeout()
    const [countDown, startCountDown] = useCountDown()
    const [assignmentInterval] = useInterval()

    useMountEffect(() => {
        Api.fetchPastAssignments(league.pk).then(({ data: { results } }) => {
            setPastAssignments(results)
        })
    })

    const toNextStep = async (assignment_pk) => {
        const {
            data: { count }
        } = await Api.fetchAssignments(assignment_pk, 1, 1)

        const pages = Math.ceil(count / page_size)
        const all_res = await Promise.all(
            [...Array(pages).keys()].map((i) =>
                Api.fetchAssignments(
                    assignment_pk,
                    i + 1,
                    page_size
                )
            )
        )

        onAssignmentComplete(
            assignment_pk,
            all_res.reduce(
                (arr, res) => arr.concat(res.data.results),
                []
            )
        )
    }

    const onSubmit = async (data) => {
        setSubmitting(true)
        onAssignmentBegin()

        const {
            data: { pk: assignment_pk }
        } = await Api.makeAssignments(league.pk, data)
        let checking = false

        countDownTimeout(() => startCountDown(resetSteps, 10), 600000)

        assignmentInterval(async () => {
            if (!checking) {
                checking = true

                const {
                    data: { is_completed }
                } = await Api.checkAssignmentsComplete(assignment_pk)

                if (is_completed) {
                    toNextStep(assignment_pk)
                } else {
                    checking = false
                }
            }
        }, 5000)
    }

    const hookForm = useForm({
        defaultValues: {
            start: new Date(),
            end: dayjs().add(1, "M").toDate()
        }
    })

    const { handleSubmit } = hookForm

    const renderFooter = () => {
        if (!submitting) {
            return (
                <Button
                    variant="primary"
                    className="rounded"
                    type="submit"
                    block
                >
                    Submit
                </Button>
            )
        } else if (countDown === undefined) {
            return (
                <Alert variant="secondary mt-2 px-3">
                    <span className="text-muted">
                        <FontAwesomeIcon
                            icon="exclamation-circle"
                            className="mr-1"
                        />
                    </span>
                    Matching may abort after 10 min
                </Alert>
            )
        } else {
            return (
                <Alert variant="danger mt-2 px-3">
                    Time limit exceed. Aborting in {countDown}s
                </Alert>
            )
        }
    }

    return (
        <>
            <Card.Subtitle className="mb-2 text-muted">
                <strong>Step 1: </strong>Make Assignments
            </Card.Subtitle>
            {pastAssignments.length > 0 ? (
                <Dropdown>
                    <Dropdown.Toggle variant="success" className="rounded my-3" id="dropdown-basic" block>
                        Continue saved assignment
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {pastAssignments.map(({ pk, start_date, end_date }) => (
                            <Dropdown.Item key={pk} onClick={(e) => {e.preventDefault(); toNextStep(pk)}}>
                                {dayjs(start_date).format("MMMM D")} -{" "}
                                {dayjs(end_date).format("MMMM D")}{" "}
                                Games
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            ) : null}
            <ol style={{ paddingLeft: "1em" }}>
                <li>
                    Games within the date range will be matched to available
                    umpires.
                </li>
                <li>
                    Umpires without availability settings set will not be
                    considered!
                </li>
                <li>
                    You will be able to review assignments before committing.
                </li>
            </ol>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <DateRangeInput hookForm={hookForm} />
                {renderFooter()}
            </Form>
        </>
    )
}

export default SelectDateRangeStep
