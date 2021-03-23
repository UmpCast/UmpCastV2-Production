import React from "react"
import dayjs from "dayjs"
import { Calendar } from "react-date-range"
import { Dropdown, Form } from "react-bootstrap"

const FilterToggle = ({ children }) => (
    <Dropdown.Toggle
        variant="light"
        className="rounded-pill bg-light text-muted py-1 mx-1"
        style={{ border: "1px solid #E2E4E8", lineHeight: 1.7 }}
    >
        {children}
    </Dropdown.Toggle>
)

const LeagueFilter = ({ allLeagues, selectedLeague, onLeagueSelect }) => {
    const renderedLeagues = allLeagues.map((league) => (
        <Dropdown.Item onClick={() => onLeagueSelect(league)} key={league.pk}>
            {league.title}
        </Dropdown.Item>
    ))

    return (
        <Dropdown className="mr-auto">
            <Dropdown.Toggle variant="primary rounded">
                {selectedLeague.title}
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-2 ump-centered-dropdown-menu">
                {renderedLeagues}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const DivisionFilter = ({ allDivisions, onDivisionToggled }) => {
    const { enabled, disabled } = allDivisions.reduce(
        (obj, division) => {
            const { pk, title, toggle } = division
            const divisionCheck = React.forwardRef(({ onClick }, ref) => (
                <Form.Check
                    type="checkbox"
                    className="ml-3 mb-1 mt-1"
                    label={title}
                    checked={toggle}
                    disabled={toggle === undefined}
                    onChange={(e) => {
                        onDivisionToggled(division)
                        onClick(e)
                    }}
                    ref={ref}
                />
            ))

            const divisionItem = <Dropdown.Toggle as={divisionCheck} key={pk} />

            return {
                ...obj,
                ...(toggle !== undefined
                    ? { enabled: obj.enabled.concat(divisionItem) }
                    : { disabled: obj.disabled.concat(divisionItem) })
            }
        },
        { enabled: [], disabled: [] }
    )

    const renderDivisions = enabled.concat(disabled)

    return (
        <Dropdown>
            <FilterToggle>All Divisions</FilterToggle>
            <Dropdown.Menu className="mt-1 ump-centered-dropdown-menu">
                {renderDivisions}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const DateFilter = ({ selectedDate, onDateSelect }) => {
    const onDateChange = (new_date) => {
        onDateSelect(dayjs(new_date))
    }

    return (
        <Dropdown alignRight>
            <FilterToggle>
                <span>
                    After
                    <span className="text-primary ml-1">
                        {selectedDate.format("MMM D")}
                    </span>
                </span>
            </FilterToggle>
            <Dropdown.Menu className="mt-1">
                <Calendar
                    minDate={dayjs().toDate()}
                    date={selectedDate.toDate()}
                    onChange={onDateChange}
                />
            </Dropdown.Menu>
        </Dropdown>
    )
}

export { LeagueFilter, DivisionFilter, DateFilter }
