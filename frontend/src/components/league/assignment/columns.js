import React from "react"
import { Form } from "react-bootstrap"
import dayjs from "dayjs"

export const COLUMNS = [
    {
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        id: "selection",
        Header: "Accept",
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        className: "text-center",
        Cell: ({ row }) => {
            const {
                onChange,
                checked
            } = row.getToggleRowSelectedProps()

            return (
                <Form.Check
                    onChange={onChange}
                    checked={checked}
                    type="checkbox"
                />
            )
        }
    },
    {
        Header: "Assigment",
        columns: [
            {
                Header: "Umpire",
                accessor: "name"
            },
            {
                Header: "Game",
                accessor: "game_title"
            }
        ]
    },
    {
        Header: "Game Info",
        columns: [
            {
                Header: "Division",
                accessor: "game_division_title"
            },
            {
                Header: "Location",
                accessor: "game_location_title"
            },
            {
                Header: "Role",
                accessor: "role_title"
            },
            {
                Header: "Date",
                accessor: "game_date_time",
                Cell: ({ value }) => dayjs(value).format("MM/DD hh:mm A")
            }
        ]
    }
]
