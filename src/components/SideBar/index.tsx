import * as React from "react";
import { Layout } from "antd";

import arrowImage from "../../assets/open-arrow.svg";

const { Sider } = Layout;

const styles = require("./style.css");

interface SiderProps {
    type: string;
    onCollapse: (open: boolean) => void;
}

export default class SideBar extends React.Component<SiderProps, {}> {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    public render(): JSX.Element {
        const { type, children, onCollapse } = this.props;
        return (
            <Sider
                // className={[styles.sider, styles[type]].join(" ")}
                collapsed={this.state.collapsed}
                collapsible={true}
                collapsedWidth={0}
                // zeroWidthTriggerStyle={ {width: "50px"} }
                trigger={null}
                // reverseArrow={type === "right"}
                width={280}
                onCollapse={onCollapse}
            >
                <div className={styles.trigger} onClick={this.toggle}>
                    <img src={arrowImage} />
                </div>
                {children}
            </Sider>
        );
    }
}
