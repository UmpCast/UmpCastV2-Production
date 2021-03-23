import React, { useMemo } from "react"
import { useTable, useRowSelect, usePagination } from "react-table"
import { GridLoader } from "react-spinners"
import { Row, Col, Table, Pagination, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { COLUMNS } from "./columns"

const AssignmentTable = ({ assignments, onAssign }) => {
    const columns = useMemo(() => COLUMNS, [])

    const data = useMemo(
        () => assignments,
        [assignments]
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        gotoPage,
        pageCount,
        selectedFlatRows,
        state
    } = useTable(
        {
            columns,
            data,
            initialState: {
                selectedRowIds: [...Array(data.length).keys()].map(String),
                pageSize: 100
            }
        },
        usePagination,
        useRowSelect
    )

    return (
        <Col>
            <Row>
                <Pagination className=" my-auto">
                    <Pagination.Prev
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                    />
                    {[...Array(pageCount).keys()].map((n) => (
                        <Pagination.Item
                            onClick={() => gotoPage(n)}
                            active={n === state.pageIndex}
                            key={n}
                        >
                            {n + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={nextPage}
                        disabled={!canNextPage}
                    />
                </Pagination>
                <Button
                    variant="primary"
                    className="rounded ml-auto my-auto"
                    onClick={() =>
                        onAssign(selectedFlatRows.map((r) => r.original))
                    }
                >
                    Assign
                </Button>
            </Row>
            <Row className="mt-3">
                <Table {...getTableProps()} striped bordered hover>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps()}
                                        className="text-center"
                                    >
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps({
                                                    className:
                                                        cell.column.className
                                                })}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Row>
        </Col>
    )
}

const DateRangeMissing = () => {
    return (
        <div className="text-muted text-center align-self-center mx-auto">
            <h4>
                Select a{" "}
                <FontAwesomeIcon icon="calendar-week" className="mx-1" /> to
                continue
            </h4>
        </div>
    )
}

const AssignmentsLoading = () => {
    return (
        <div
            className="text-muted text-center align-self-center mx-auto d-inline-flex"
            style={{ width: "250px" }}
        >
            <GridLoader color="#3D80DC" />
            <h4 style={{ width: "175px" }}>Finding Matching Umpires</h4>
        </div>
    )
}

const AssignmentsComplete = () => {
    return (
        <div className="text-primary text-center align-self-center mx-auto">
            <FontAwesomeIcon icon={["far", "calendar-check"]} size="4x" />
            <h4 className="mt-2">Auto-Assign Complete</h4>
        </div>
    )
}

export {
    AssignmentTable as default,
    DateRangeMissing,
    AssignmentsLoading,
    AssignmentsComplete
}
