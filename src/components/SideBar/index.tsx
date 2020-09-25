import * as React from "react";
import { Layout } from "antd";
import classNames from "classnames";

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

    state: SiderState = {
        collapsed: false,
    };

    handleTriggerClick = () => {
        const { onCollapse } = this.props;
        this.setState({
            collapsed: !this.state.collapsed,
        });
        onCollapse(this.state.collapsed);
    };

    public render(): JSX.Element {
        const { type, children } = this.props;
        let triggerClass: string = classNames({
            [styles.trigger]: true,
            [styles[type]]: true,
            [styles.collapsed]: this.state.collapsed,
            [styles.notCollapsed]: !this.state.collapsed,
        });

        return (
            <Sider
                collapsed={this.state.collapsed}
                collapsible={true}
                collapsedWidth={0}
                trigger={null}
                width={280}
            >
                <div className={triggerClass} onClick={this.handleTriggerClick}>
                    <img src={arrowImage} />
                </div>
                {children}
            </Sider>
        );
    }
}
