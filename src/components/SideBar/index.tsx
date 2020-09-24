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

        return (
            <Sider
                collapsed={this.state.collapsed}
                collapsible={true}
                collapsedWidth={0}
                trigger={null}
                width={280}
                onCollapse={onCollapse}
            >
                <div className={triggerClassName} onClick={this.toggleCollapse}>
                    <img src={arrowImage} />
                </div>
                {children}
            </Sider>
        );
    }
}
