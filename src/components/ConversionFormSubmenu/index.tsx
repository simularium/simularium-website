import React, { useState } from "react";
import { Upload, Select, Divider, Button, Input, Form, Row, Col } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import styles from "./style.css";
// import theme from "../../styles/light-theme.css";
import theme from "../CustomModal/light-theme.css";
import classNames from "classnames";
import { CaretDown, CaretRight, Delete } from "../Icons";

/**
 * TODO for this component
 * when user clicks next: next button becomes import, submenus render in collapsed state
 * component should be fixed "provide display info heading" followed by the four collapsable ones
 * use props to set
 * arrow/collapsability, title, subtitle, menus
 * needed submenus:
 * Provide display information
 * Particle display specifications
 * Viewport settiongs
 * Time units
 * Spatial units
 */

interface ConversionFormSubmenuProps {
    option: string;
}
interface SubMenuData {
    input1: string;
    input2: string;
}

interface MenuOption {
    title: string;
    subtitle: string;
    menu: JSX.Element;
}

interface MenuOptions {
    [key: string]: MenuOption;
}

const selectOptions = [{ value: "sphere", label: "sphere" }];

interface ElementMap {
    [key: string]: JSX.Element;
}

interface ParticleMenuProps {
    index: number;
    setParticleState: React.Dispatch<React.SetStateAction<number>>;
    particleMenus: number;
}

const ParticleMenu = ({
    index,
    setParticleState,
    particleMenus,
}: ParticleMenuProps): JSX.Element | null => {
    const [subMenuData, setSubMenuData] = useState<SubMenuData>({
        input1: "",
        input2: "",
    });

    const handleSubMenuInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        setSubMenuData({ ...subMenuData, [name]: value });
        console.log(subMenuData);
    };

    const particleMenu = (
        <div className={styles.formDiv}>
            <Form
                labelCol={{ offset: 4 }}
                className={styles.form}
                layout="vertical"
                key={index}
                style={{
                    backgroundColor: "#F6F4FF",
                    padding: 12,
                    maxHeight: 200,
                    maxWidth: 1000,
                }}
            >
                <Row gutter={100}>
                    <Col span={5}>
                        <div> Particle name</div>
                        <Form.Item>
                            <Input
                                placeholder="Start typing..."
                                type="text"
                                name="input1"
                                value={subMenuData.input1}
                                onChange={handleSubMenuInputChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <div> Display name</div>
                        <Form.Item>
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <div> Display type</div>
                        <Form.Item>
                            <Select
                                style={{ width: 200 }}
                                className={styles.particleSelector}
                                bordered={true}
                                defaultValue="Sphere"
                                options={selectOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <div> Radius</div>
                        <Form.Item>
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={100}>
                    <Col span={5}></Col>
                    <Col span={5}>
                        <div> Geometry URL</div>
                        <Form.Item>
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <div> Color</div>
                        <Form.Item>
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <div> Color</div>
                        <Form.Item>
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div
                className={styles.icon}
                onClick={() => {
                    // TODO retrieve menu id from props and have it deleted from the menus object
                    setParticleState(particleMenus - 1);
                }}
            >
                {Delete}
            </div>
        </div>
    );

    return particleMenu;
};

const ConversionFormSubmenu = ({
    option,
}: ConversionFormSubmenuProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isFileLoaded, setFileLoaded] = useState<boolean>(false);
    const [particleMenus, setParticleMenus] = useState(1);
    const [subMenuData, setSubMenuData] = useState<SubMenuData>({
        input1: "",
        input2: "",
    });

    let keyIndex = 0;

    const handleSubMenuInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        setSubMenuData({ ...subMenuData, [name]: value });
        console.log(subMenuData);
    };

    const menuOptions: MenuOptions = {
        viewport: {
            title: "Viewport settings",
            subtitle: "",
            menu: <div> viewport menu</div>,
        },
        time: {
            title: "Time units",
            subtitle: "",
            menu: <div>time menu</div>,
        },
        spatial: {
            title: "Spatial units",
            subtitle: "",
            menu: <div>spatial menu</div>,
        },
        particle: {
            title: "Particle display specification (recommended)",
            subtitle: "",
            menu: (
                <ParticleMenu
                    index={keyIndex}
                    setParticleState={setParticleMenus}
                    particleMenus={particleMenus}
                />
            ),
        },
    };

    interface menus {
        [key: number]: JSX.Element;
    }
    const menus: menus = {};
    menus[keyIndex] = menuOptions[option].menu;
    const menusArray: any[] = Array.from(Object.values(menus));

    for (let i = 0; i < Object.keys(menus).length; i++) {
        // keyIndex++
        // menusArray.push(menuOptions[option].menu);
        // console.log("keyIndex: " + keyIndex)
        console.log(menus);
    }

    const conversionFormSubmenu = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            <h3
                className={styles.title}
                onClick={() => {
                    showTarget === false
                        ? setVisibility(true)
                        : setVisibility(false);
                }}
            >
                {showTarget == true ? (
                    <div>
                        {CaretDown} {menuOptions[option].title}
                    </div>
                ) : (
                    <div>
                        {CaretRight} {menuOptions[option].title}
                    </div>
                )}
            </h3>
            {showTarget === true ? (
                <div>
                    <h3> {menuOptions[option].subtitle} </h3>
                    {menusArray}
                    {/* {menuOptions[option].menu} */}
                    {option === "particle" ? (
                        <Button
                            type="default"
                            onClick={() => {
                                keyIndex++;
                                // console.log(menuOptions[option].menu)
                                menus[keyIndex] = menuOptions[option].menu;
                                // console.log(JSON.stringify(menus[1]))
                                // console.log(keyIndex)
                                // console.log(Object.values(menus))
                                // console.log(menus[keyIndex])
                                // setParticleMenus(particleMenus + 1);
                                // console.log(particleMenus);
                            }}
                        >
                            Add new +
                        </Button>
                    ) : null}
                </div>
            ) : null}
            <Divider orientation="right" orientationMargin={400}>
                {" "}
            </Divider>
        </div>
    );

    return conversionFormSubmenu;
};

export default ConversionFormSubmenu;
