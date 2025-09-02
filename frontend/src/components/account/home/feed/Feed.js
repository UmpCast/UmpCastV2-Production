import React from "react"

import useUser from "common/hooks.js"

import { NotifsPage } from "common/components.js"
import Message from "./Message.js"

export default function Feed() {
    const { pk } = useUser().user

    const fetchNotifs = {
        fetchNotifs: (page) => [
            "api/notifications/",
            {
                pk: pk,
                params: {
                    page,
                    page_size: 10
                }
            }
        ]
}

    return (
        <div className="mt-3">
            <NotifsPage fetchNotifs={fetchNotifs} msgTemplate={Message} />
        </div>
    )
}
