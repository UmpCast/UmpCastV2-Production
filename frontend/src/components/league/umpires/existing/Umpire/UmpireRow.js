import React from "react"

import { ProfilePicture } from "common/components"

import UmpireVisibility from "../Visibility/UmpireVisibility"

import { Form } from "react-bootstrap"
import DarkBaseball from "assets/dark_baseball.png"

export default function UmpireRow(props) {
    const {
        league,
        onStatusSelected,
        onStatusDeselected,
        isSelected,
        status
    } = props

    const { user } = status
    const { first_name, last_name, profile_picture } = user
    const umpire_name = `${first_name} ${last_name}`

    const onToggleChange = () => {
        if (isSelected) onStatusDeselected(status)
        else onStatusSelected(status)
    }

    return (
        <tr className="border-top">
            <td className="align-middle">
                <div className="d-flex justify-content-center w-100">
                    <Form.Check
                        checked={isSelected}
                        onChange={onToggleChange}
                    />
                </div>
            </td>
            <td className="align-middle">
                <div className="d-flex">
                    <ProfilePicture
                        src={profile_picture}
                        alt={DarkBaseball}
                        size={30}
                        className={`rounded border mt-1 mr-2`}
                    />
                    {/* <Badge
                        className="text-white bg-info mr-auto ml-2 my-auto"
                        style={{ backgroundColor: "#B793CF", position: "absolute", left: 0 }}>
                        <small>
                            <strong>
                                L3
                            </strong>
                        </small>
                    </Badge> */}
                    <div className="my-auto flex-shrink-0">
                        <h5 className="mb-0">
                            <strong>{umpire_name}</strong>
                        </h5>
                    </div>
                </div>
            </td>
            <td className="align-middle">
                <h6 className="mb-0">
                    <strong>{status.num_casts} / {status.max_casts}</strong>
                </h6>
            </td>
            <td className="align-middle">
                <h6 className="mb-0">
                    <strong>{status.num_backups} / {status.max_backups}</strong>
                </h6>
            </td>
            <td className="align-middle">
                <UmpireVisibility
                    className="d-flex justify-content-center"
                    status={{ ...status, endpoint: "user-league-status" }}
                    divisions={league.divisions}
                />
            </td>
        </tr>
    )
}
