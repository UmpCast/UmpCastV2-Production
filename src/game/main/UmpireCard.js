import React from "react";

import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

const UmpireCard = (props) => (
    <div className={props.border}>
        <Card className="text-center border-0">
            <Card.Body className="pt-0">
                {props.cancel_button}
                <Card.Title className="mt-4">
                    {props.title}
                </Card.Title>
                <div
                    className="d-inline-flex flex-wrap bg-secondary p-4 my-4 rounded-circle text-white fa-4x">
                    <FontAwesomeIcon className="text-white"
                        icon={faUserAlt} />
                </div>
                <Card.Text><a href="/#/game/1">{props.name}</a></Card.Text>
            </Card.Body>
        </Card>
    </div>
)

export default UmpireCard