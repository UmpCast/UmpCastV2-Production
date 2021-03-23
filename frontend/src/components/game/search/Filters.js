import React from "react"
import dayjs from "dayjs"
import { Calendar } from "react-date-range"
import { Dropdown, Form } from "react-bootstrap"

const FilterToggle = ({ children, className }) => (
    <Dropdown.Toggle
        variant="light"
        className={`rounded-pill bg-light text-muted py-1 mx-1 ${className}`}
        style={{ border: "1px solid #E2E4E8", lineHeight: 1.7 }}
    >
        {children}
    </Dropdown.Toggle>
)

const LeagueFilter = ({ allLeagues, selectedLeague, onLeagueSelect, className }) => {
    const renderedLeagues = allLeagues.map((league) => (
        <Dropdown.Item onClick={() => onLeagueSelect(league)} key={league.pk}>
            {league.title}
        </Dropdown.Item>
    ))

    return (
        <Dropdown className="mr-auto">
            <Dropdown.Toggle variant="primary rounded" className={className}>
                {selectedLeague.title}
            </Dropdown.Toggle>
            <Dropdown.Menu className={`mt-2 ump-centered-dropdown-menu ${className}`}>
                {renderedLeagues}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const CheckBoxToggle = ({ title, toggle, onToggle }) => {
    const checkbox = React.forwardRef((_, ref) => (
        <Form.Check
            type="checkbox"
            className="ml-3 mb-1 mt-1"
            label={title}
            checked={toggle}
            disabled={toggle === undefined}
            onChange={onToggle}
            ref={ref}
        />
    ))

    return <Dropdown.Toggle as={checkbox} />
}

const DivisionFilter = ({ allDivisions, onDivisionToggled, className }) => {
    const { enabled, disabled } = allDivisions.reduce(
        (obj, division) => {
            const { pk, title, toggle } = division

            const divisionItem = (
                <CheckBoxToggle
                    title={title}
                    toggle={toggle}
                    onToggle={() => onDivisionToggled(pk)}
                    key={pk}
                />
            )

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
            <FilterToggle className={className}>Divisions</FilterToggle>
            <Dropdown.Menu className={`mt-1 ump-centered-dropdown-menu ${className}`}>
                {renderDivisions}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const LocationFilter = ({ allLocations, onLocationToggled, className }) => {
    const renderLocations = allLocations.map(({ pk, title, toggle }) => (
        <CheckBoxToggle
            title={title}
            toggle={toggle}
            onToggle={() => onLocationToggled(pk)}
            key={pk}
        />
    ))

    return (
        <Dropdown>
            <FilterToggle className={className}>Locations</FilterToggle>
            <Dropdown.Menu className="mt-1 ump-centered-dropdown-menu">
                {renderLocations}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const DateFilter = ({ text, selectedDate, onDateSelect, className }) => {
    const onDateChange = (new_date) => {
        onDateSelect(dayjs(new_date))
    }

    return (
        <Dropdown alignRight>
            <FilterToggle className={className}>
                <span>
                    {text}
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

export { LeagueFilter, DivisionFilter, LocationFilter, DateFilter }
