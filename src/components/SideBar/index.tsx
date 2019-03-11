import * as React from "react";
import { Icon, Layout } from "antd";

const { Sider } = Layout;

const styles = require("./style.css");

interface SiderProps {
    type: string;
}
export default class App extends React.Component<SiderProps, {}> {
    public render(): JSX.Element {
        const { type } = this.props;
        return (
            <Sider
                className={[styles.sider, styles[type]].join(" ")}
                collapsible={true}
                collapsedWidth={0}
                trigger={<Icon type="pause" />}
                reverseArrow={type === "right"}
                width={400}
            >
                Sider
            </Sider>
        );
    }
}
