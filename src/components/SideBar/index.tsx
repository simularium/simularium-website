import * as React from "react";
import { Icon, Layout } from "antd";

const { Sider } = Layout;

const styles = require("./style.css");

interface SiderProps {
    type: string;
    onCollapse: () => void;
}

export default class SideBar extends React.Component<SiderProps, {}> {
    public render(): JSX.Element {
        const { type, children, onCollapse } = this.props;
        return (
            <Sider
                className={[styles.sider, styles[type]].join(" ")}
                collapsible={true}
                collapsedWidth={0}
                trigger={<Icon type="pause" />}
                reverseArrow={type === "right"}
                width={400}
                onCollapse={onCollapse}
            >
                {children}
            </Sider>
        );
    }
}
