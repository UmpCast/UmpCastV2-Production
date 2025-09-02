import AppPicture from "common/component/AppPicture.js"
import CustomToggle from "common/component/CustomToggle.js"
import FocusContainer from "common/component/FocusContainer.js"
import NewPfpButton from "common/component/NewPfpButton.js"
import NotifsPage from "common/component/NotifsPage.js"
import PageNav from "common/component/PageNav.js"
import ProfilePicture from "common/component/ProfilePicture.js"
import SettingsHeader from "common/component/SettingsHeader.js"
import SettingsNav from "common/component/SettingsNav.js"
import TimerAlert from "common/component/TimerAlert.js"
import ToolTip from "common/component/ToolTip.js"

export {
    AppPicture,
    CustomToggle,
    FocusContainer,
    NewPfpButton,
    NotifsPage,
    PageNav,
    ProfilePicture,
    SettingsHeader,
    SettingsNav,
    TimerAlert,
    ToolTip
}

export default function Loader({ dep, children }) {
    if (Array.isArray(dep)) {
        for (const cond of dep) {
            if (!cond) return null
        }
    } else {
        if (!dep) return null
    }
    return children
}