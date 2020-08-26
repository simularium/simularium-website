import React from "react";
import { Menu } from "antd";
import routes from "../../routes";
import { NavLink } from "react-router-dom";

const { SubMenu } = Menu;

const style = require("./style.css");

class NavBar extends React.Component {
    render() {
        return (
            <div className={style.container}>
                <Menu mode="horizontal">
                    {routes.map((route) => (
                        <Menu.Item key={route.path}>
                            <NavLink to={route.path}>{route.name}</NavLink>
                        </Menu.Item>
                    ))}
                </Menu>
            </div>
        );
    }
}

export default NavBar;
