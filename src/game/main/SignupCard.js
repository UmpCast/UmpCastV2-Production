import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Card} from "react-bootstrap";

const SignupCard = ({onClick}) => (
    <div className="border-secondary-dashed">
        <Card className="text-center border-0 text-muted">
            <Card.Body className="p-0">
                <div className="list-group-item-action border-0 py-3" onClick={onClick}>
                    <Card.Title className="mb-0 mt-1">
                        <FontAwesomeIcon className="mr-2 fa-sm" icon={['fas', 'plus']}/>
                        <strong>Click to add</strong>
                    </Card.Title>
                    <div
                        className="d-inline-flex flex-wrap p-4 my-4 rounded-circle text-white fa-4x"
                        style={{"backgroundColor": "#E8EAED"}}>
                        <FontAwesomeIcon className="text-white"
                                         icon={['fas', 'user-alt']}/>
                    </div>
                    <Card.Text className="mb-1">You</Card.Text>
                </div>
            </Card.Body>
        </Card>
    </div>
)

export default SignupCard;