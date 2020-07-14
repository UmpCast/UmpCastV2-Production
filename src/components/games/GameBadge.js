import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

import "./games.css"

const GameBadge = (props) => (
    <p
        className={
            `my-auto px-2 py-0 noselect
            badge badge-pill badge-${props.variant}`
        }
        style={{"lineHeight": "1.7"}}
        data-tip={props.data_tip}>
        <FontAwesomeIcon className="mr-2" icon={props.icon}/>{props.title}
    </p>
)

export default GameBadge