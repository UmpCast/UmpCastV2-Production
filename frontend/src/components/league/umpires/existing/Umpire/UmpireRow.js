import React from "react"

import { ProfilePicture } from "common/components"
import { Name } from "common/Utils"

import CastsBar from "./CastsBar"
import UmpireVisibility from "../Visibility/UmpireVisibility"

import { Form } from "react-bootstrap"
import DarkBaseball from "assets/dark_baseball.png"

export default function UmpireRow(props) {
    const { league, onStatusSelected, onStatusDeselected, isSelected, onStatusChange, status} = props

    const { user } = status
    const { first_name, last_name, profile_picture } = user
    const umpire_name = new Name(first_name, last_name).fullFirst
    
    const onToggleChange = () => {
        if (isSelected)
            onStatusDeselected(status)
        else
            onStatusSelected(status)
    }

    return (
        <tr className="border-top">
            <td className="align-middle">
                <div className="d-flex justify-content-center w-100">
                    <Form.Check checked={isSelected} onChange={onToggleChange}/>
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
                <CastsBar onChange={onStatusChange} status={status} type="casts" />
            </td>
            <td className="align-middle">
                <CastsBar onChange={onStatusChange} status={status} type="backups" />
            </td>
            <td className="align-middle">
                <UmpireVisibility
                    className="d-flex justify-content-center"
                    status={{ ...status, endpoint: "user-league-status" }}
                    divisions={league.divisions}
                    onChange={onStatusChange}
                />
            </td>
        </tr>
    )
}
