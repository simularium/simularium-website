import * as React from "react";
import { Layout } from "antd";

import Icons from "../Icons";
const { Sider } = Layout;

const styles = require("./style.css");

interface SiderProps {
    type: string;
    onCollapse: (open: boolean) => void;
}

export default class SideBar extends React.Component<SiderProps, {}> {
    public render(): JSX.Element {
        const { type, children, onCollapse } = this.props;
        return (
            <Sider
                className={[styles.sider, styles[type]].join(" ")}
                collapsible={true}
                collapsedWidth={0}
                trigger={Icons.Pause}
                reverseArrow={type === "right"}
                width={280}
                onCollapse={onCollapse}
            >
                {children}
            </Sider>
        );
    }
}
