import React, { Fragment, useState } from "react"
import { InputConfirm } from "common/forms"

import {Button} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function RemoveUmpiresButton({onDeleteUsers, umpiresCount}) {
    const useShow = useState(false)
    const [, setShow] = useShow

    const onDeleteConfirm = () => {
        setShow(false)
        onDeleteUsers()
    }

    return (
        <Fragment>
            <Button
                variant="outline-danger rounded"
                className="mx-1 py-1 px-2"
                onClick={() => setShow(true)}
            >
                <FontAwesomeIcon
                    icon={["fa", "minus-square"]}
                    className="mr-1 fa-xs"
                />
                Remove {umpiresCount}
                <FontAwesomeIcon icon="user" className="fa-xs ml-1" />
            </Button>
            <InputConfirm
                action="Removing Umpires"
                consequences="Removing umpires will also unschedule them 
                from any games they are currently casted for"
                action_text="I understand, please remove these umpires."
                confirm_text={`Delete`}
                useShow={useShow}
                onConfirm={onDeleteConfirm}
            />
        </Fragment>
    )
}
