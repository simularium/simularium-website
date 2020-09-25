import * as React from "react";
import { Layout } from "antd";

import arrowImage from "../../assets/open-arrow.svg";

const { Sider } = Layout;

const styles = require("./style.css");

interface SiderProps {
    type: string;
    onCollapse: (open: boolean) => void;
}

interface SiderState {
    collapsed: boolean;
}

export default class SideBar extends React.Component<SiderProps, SiderState> {
    /* 
    This local state and the following method connect the custom trigger
    button to the sidebar so that it collapses on click. This would be
    automatically handled by the antd Sider component if we were not using
    a custom trigger. 
    
    The local state is also used for styling the trigger button based on
    whether the associated sidebar is collapsed or not (i.e., flipping the arrow).
    */

    state = {
        collapsed: false,
    };

    toggleCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    public render(): JSX.Element {
        const { type, children, onCollapse } = this.props;
        let triggerClassName: string = styles.trigger + " " + styles[type];
        triggerClassName = this.state.collapsed
            ? triggerClassName + " " + styles.collapsed
            : triggerClassName + " " + styles.notCollapsed;
        const handleTriggerClick = () => {
            this.toggleCollapse();
            onCollapse(this.state.collapsed);
        };

        return (
            <Sider
                collapsed={this.state.collapsed}
                collapsible={true}
                collapsedWidth={0}
                trigger={null}
                width={280}
            >
                <div className={triggerClassName} onClick={handleTriggerClick}>
                    <img src={arrowImage} />
                </div>
                {children}
            </Sider>
        );
    }
}
