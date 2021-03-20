import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, Button, Form, Alert } from "react-bootstrap"
import dayjs from "dayjs"

import DateRangeInput from "./DateRangeInput"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCountDown, useTimeout, useInterval } from "./useTask"

import { useApi } from "common/hooks"

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
            "api/assignment-items/",
            {
                params: { assignment: assignment_pk, page_size: 1 }
            },
            "GET",
            false
        ]
    },
    fetchAssignments(assignment_pk, page) {
        return [
            "api/assignment-items/",
            {
                params: {
                    assignment: assignment_pk,
                    page,
                    page_size: 200
                }
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

    const [countDownTimeout] = useTimeout()
    const [countDown, startCountDown] = useCountDown()
    const [assignmentInterval] = useInterval()

    const onSubmit = async (data) => {
        setSubmitting(true)
        onAssignmentBegin()

        const {
            data: { pk }
        } = await Api.makeAssignments(league.pk, data)
        let checking = false

        countDownTimeout(() => startCountDown(resetSteps, 10), 600000)

        assignmentInterval(async () => {
            if (!checking) {
                checking = true

                const {
                    data: { results, count }
                } = await Api.checkAssignmentsComplete(pk)

                if (results.length && results[0].is_completed) {
                    const pages = Math.ceil(count / 200)
                    const all_res = await Promise.all(
                        [...Array(pages).keys()].map((i) =>
                            Api.fetchAssignments(pk, i + 1)
                        )
                    )

                    onAssignmentComplete(
                        all_res.reduce(
                            (arr, res) => arr.concat(res.data.results),
                            []
                        )
                    )
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
            <ol style={{paddingLeft: "1em"}}>
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
