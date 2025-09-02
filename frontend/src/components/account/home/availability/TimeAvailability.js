import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import useUser, { useApi } from "common/hooks.js"

// Custom schedule selector component that works with React 16
const ScheduleSelector = ({ selection, onChange, startDate, numDays, minTime, maxTime }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const hours = Array.from({ length: maxTime - minTime }, (_, i) => minTime + i)
    
    const isSelected = (dayIndex, hour) => {
        return selection.some(date => {
            const dateObj = new Date(date)
            const dayOfWeek = dateObj.getDay()
            const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert Sunday=0 to Sunday=6
            const hourOfDay = dateObj.getHours()
            return adjustedDay === dayIndex && hourOfDay === hour
        })
    }
    
    const toggleSlot = (dayIndex, hour) => {
        const newDate = new Date(startDate)
        newDate.setDate(newDate.getDate() + dayIndex)
        newDate.setHours(hour, 0, 0, 0)
        
        const newSelection = isSelected(dayIndex, hour)
            ? selection.filter(date => {
                const dateObj = new Date(date)
                const dayOfWeek = dateObj.getDay()
                const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
                const hourOfDay = dateObj.getHours()
                return !(adjustedDay === dayIndex && hourOfDay === hour)
            })
            : [...selection, newDate]
        
        // Convert the selection to the format expected by handleChange
        // handleChange expects an array of Date objects that can be JSON.stringify'd
        const formattedSelection = newSelection.map(date => {
            // Ensure we're passing Date objects that can be properly serialized
            return new Date(date.getTime())
        })
        
        onChange(formattedSelection)
    }
    
    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '60px repeat(7, 1fr)', 
                gap: '1px',
                backgroundColor: '#f5f5f5'
            }}>
                {/* Header row */}
                <div style={{ padding: '10px', backgroundColor: '#fff', fontWeight: 'bold' }}>
                    Time
                </div>
                {days.map(day => (
                    <div key={day} style={{ 
                        padding: '10px', 
                        backgroundColor: '#fff', 
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {day}
                    </div>
                ))}
                
                {/* Time slots */}
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        <div style={{ 
                            padding: '8px', 
                            backgroundColor: '#fff',
                            borderRight: '1px solid #eee',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            {hour}:00
                        </div>
                        {days.map((day, dayIndex) => (
                            <div 
                                key={`${day}-${hour}`} 
                                style={{ 
                                    height: '30px', 
                                    backgroundColor: isSelected(dayIndex, hour) ? '#4CAF50' : '#fff',
                                    cursor: 'pointer',
                                    border: '1px solid #eee',
                                    transition: 'background-color 0.2s'
                                }}
                                onClick={() => toggleSlot(dayIndex, hour)}
                                onMouseEnter={(e) => {
                                    if (!isSelected(dayIndex, hour)) {
                                        e.target.style.backgroundColor = '#e8f5e8'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected(dayIndex, hour)) {
                                        e.target.style.backgroundColor = '#fff'
                                    }
                                }}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

dayjs.extend(utc)

function getMonday(d) {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  
const start_date = dayjs(getMonday(new Date()))

const timeRangeToDate = (time_range) => {
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

    const date = dayjs
        .utc(start_date.format("YYYY-MM-DD"))
        .add(days, "d")
        .add(hours, "h")
        .add(minutes, "m")

    let w_delta = 0
    if (date.isBefore(start_date)) w_delta = 1
    else if (date.isAfter(start_date.add(1, "w"))) w_delta = -1

    return date.add(w_delta, "w").toDate()
}

const dateToTimeRange = (date) => {
    const jsDate = dayjs.utc(date)

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
        }).catch((err) => {
            console.warn('Error adding time ranges:', err)
            // Revert the UI change if the API call fails
            setSchedule({
                ...schedule,
                current: currentRanges,
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
            
            // Only try to delete ranges that have a pk (are saved in database)
            const rangesToDelete = removed.filter(range => range.pk)

            // Remove ALL removed ranges from UI immediately (both with and without pk)
            const newCurrentRanges = currentRanges.filter(
                (range) => !removed.some(r => 
                    r.start === range.start && r.end === range.end && r.day_type === range.day_type
                )
            )

            // Update UI immediately for all removals
            setSchedule({
                ...schedule,
                current: newCurrentRanges
            })

            // Only make API calls for ranges that exist in the database
            if (rangesToDelete.length > 0) {
                const removed_pks = rangesToDelete.map((range) => range.pk)
                
                Promise.all(removed_pks.map(Api.deleteTimeRange))
                    .then(() => {
                        // Successfully deleted time ranges from DB
                    })
                    .catch((err) => {
                        console.warn('Error deleting time ranges:', err)
                        // Revert UI change if deletion fails
                        setSchedule({
                            ...schedule,
                            current: currentRanges
                        })
                        if (err.response && err.response.status === 403) {
                            console.error('Permission denied - these time ranges may not belong to the current user')
                        }
                    })
            }
        }
    }

    // Safety check to ensure schedule is properly initialized
    if (!schedule || !schedule.current) {
        return <div className="mt-3">Loading...</div>
    }

    return (
        <div className="mt-3">
            <ScheduleSelector
                selectionScheme="square"
                startDate={start_date.toDate()}
                dateFormat="ddd"
                timeFormat="h:mm a"
                selection={schedule.current.map((range) =>
                    timeRangeToDate(range)
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
