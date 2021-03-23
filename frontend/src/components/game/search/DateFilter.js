import React from "react"
import { Calendar } from "react-date-range"
import dayjs from "dayjs"

import FilterToggle from "../FilterToggle"

import { Dropdown } from "react-bootstrap"

const DateFilter = ({ start_date, onDateSelect }) => {
    const onDateChange = (new_date) => {
        onDateSelect(dayjs(new_date))
    }

    return (
        <Dropdown alignRight>
            <FilterToggle>
                <span>
                    After
                    <span className="text-primary ml-1">
                        {start_date.format("MMM D")}
                    </span>
                </span>
            </FilterToggle>
            <Dropdown.Menu className="mt-1">
                <Calendar
                    minDate={dayjs().toDate()}
                    date={start_date.toDate()}
                    onChange={onDateChange}
                />
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default DateFilter