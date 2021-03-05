import React, { useState } from "react"
import ScheduleSelector from "react-schedule-selector"
import dayjs from "dayjs"

import useUser, { useApi } from "common/hooks"

const timeRangeToDate = (startDate, time_range) => {
    const { day_type, start } = time_range

    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ].indexOf(day_type)
    const hours = parseInt(start.slice(0, 2))
    const minutes = parseInt(start.slice(3, 5))

    return dayjs(startDate)
        .add(days, "days")
        .add(hours, "hours")
        .add(minutes, "minutes")
        .toDate()
}

const dateToTimeRange = (date) => {
    const jsDate = dayjs(date)

    return {
        start: jsDate.format("HH:mm:ss"),
        end: jsDate.add(1, "hours").format("HH:mm:ss"),
        day_type: jsDate.format("dddd").toLowerCase()
    }
}

const requests = {
    addTimeRange(user_pk, range) {
        return [
            "api/schedule-timeranges/",
            {
                data: {
                    user: user_pk,
                    ...range
                }
            },
            "POST",
            false
        ]
    },
    deleteTimeRange(pk) {
        return [
            "api/schedule-timeranges/",
            {
                pk
            },
            "DELETE",
            false
        ]
    }
}

export default function TimeAvailability({ schedule, setSchedule }) {
    const startDate = new Date("March 1, 2021")

    const Api = useApi(requests)
    const { user } = useUser()

    const rangesMatch = (r1, r2) =>
        ["start", "end", "day_type"].every((key) => r1[key] === r2[key])

    const rangeDifference = (arr1, arr2) =>
        arr1.filter((r1) => !arr2.find((r2) => rangesMatch(r1, r2)))

    const addRanges = (added) => {
        const currentRanges = schedule.current

        Promise.all(
            added.map((range) => Api.addTimeRange(user.pk, range))
        ).then((res) => {
            const newRanges = res.map(({ data }) => data)
            setSchedule({
                ...schedule,
                current: [...currentRanges, ...newRanges],
                adding: false
            })
        })
    }

    const handleChange = (selectorSchedule) => {
        const currentRanges = schedule.current

        const updatedRanges = [
            ...new Set(selectorSchedule.map(JSON.stringify))
        ].map((str) => dateToTimeRange(new Date(JSON.parse(str))))

        if (updatedRanges.length > currentRanges.length && !schedule.adding) {
            const added = rangeDifference(updatedRanges, currentRanges)
            setSchedule({
                ...schedule,
                current: [...currentRanges, ...added],
                adding: true
            })

            addRanges(added)
        } else if (updatedRanges.length < currentRanges.length) {
            const removed = rangeDifference(currentRanges, updatedRanges)
            const removed_pks = removed.map((range) => range.pk)

            setSchedule({
                ...schedule,
                current: currentRanges.filter(
                    ({ pk }) => !removed_pks.includes(pk)
                )
            })

            Promise.all(removed_pks.map(Api.deleteTimeRange))
        }
    }

    return (
        <div className="mt-3">
            <ScheduleSelector
                startDate={startDate}
                dateFormat="ddd"
                timeFormat="h:mm a"
                selection={schedule.current.map((range) =>
                    timeRangeToDate(startDate, range)
                )}
                numDays={7}
                minTime={6}
                maxTime={22}
                hourlyChunks={1}
                onChange={handleChange}
            />
        </div>
    )
}
