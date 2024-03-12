import * as React from "react";
import { Layout } from "antd";
import classNames from "classnames";

import { MOBILE_CUTOFF } from "../../constants";
import { PurpleArrow } from "../Icons";

const { Sider } = Layout;

import styles from "./style.css";

interface SiderProps {
    type: string;
    onCollapse: (open: boolean) => void;
    children?: React.ReactNode;
    isEmbedded?: boolean;
}

interface SiderState {
    collapsed: boolean;
}

export default class SideBar extends React.Component<SiderProps, SiderState> {
    state: SiderState = {
        collapsed: window.matchMedia(MOBILE_CUTOFF).matches,
    };

    handleTriggerClick = () => {
        const { onCollapse } = this.props;
        this.setState({
            collapsed: !this.state.collapsed,
        });

        // Trigger redux action to adjust the viewer width, depending on the
        // number of sidebars that are now collapsed
        onCollapse(this.state.collapsed);
    };

    public render(): JSX.Element {
        const { type, children, isEmbedded } = this.props;
        // Ex) class="style__sider--30dA5 style__left--1KLfS"
        const siderClass: string = classNames({
            [styles.sider]: true,
            [styles[type]]: true,
            [styles.embed]: isEmbedded,
        });

        // Ex) class="style__trigger--30dA5 style__left--1KLfS style__collapsed--ncLRy"
        const triggerClass: string = classNames({
            [styles.trigger]: true,
            [styles[type]]: true,
            [styles.collapsed]: this.state.collapsed,
        });

        return (
            <Sider
                className={siderClass}
                width={280}
                collapsible={true}
                collapsed={this.state.collapsed}
                collapsedWidth={0}
                trigger={null}
            >
                <div className={triggerClass} onClick={this.handleTriggerClick}>
                    {PurpleArrow}
                </div>
                {children}
            </Sider>
        );
    }
}
