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

const selectOptions = [
    { value: "cytosim", label: "cytosim" },
    { value: "cellPACK", label: "cellPACK" },
    { value: "Smoldyn", label: "Smoldyn" },
    { value: "SpringSaLaD", label: "SpringSaLaD" },
];

interface ElementMap {
    [key: string]: JSX.Element;
}

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

    const handleSubMenuInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        setSubMenuData({ ...subMenuData, [name]: value });
    };

    const menuOptions: MenuOptions = {
        viewport: {
            title: "Viewport settings",
            subtitle: "",
            menu: <div> viewport menu</div>,
        },
        time: {
            title: "Viewport settings",
            subtitle: "",
            menu: <div>time menu</div>,
        },
        spatial: {
            title: "Viewport settings",
            subtitle: "",
            menu: <div>spatial menu</div>,
        },
        particle: {
            title: "Viewport settings",
            subtitle: "",
            menu: (
                <div className={styles.formDiv}>
                    <Form
                        //   {...formItemLayout}
                        labelCol={{ offset: 4 }}
                        className={styles.form}
                        // wrapperCol={ {span: 14 }}
                        layout="vertical"
                        //   form={form}
                        //   initialValues={{ layout: formLayout }}
                        //   onValuesChange={onFormLayoutChange}
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
                                        defaultValue="Select"
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
                            setParticleMenus(particleMenus - 1);
                        }}
                    >
                        {Delete}
                    </div>
                </div>
            ),
        },
    };

    const handleImport = () => {
        //TODO
        // this function will take the file type, file, and user specifications and make a fetch request
        // do we need to do a POST or store the uploaded file on the server before sending it to simulariumio?
        // define interface for request object
        // diff interfaces for diff file types or is one possible...
        // get file type
        // each file type will have different requirements in simulariumio....
        // get file
        // get user options via menus
        // build instace of interface
        // make POST request with request data
        // where to make request to
        // toggle state to Loading/Importing
        // render loading overlay screen
        // render modals for cancellations or failure to import
    };

    const menus = [];
    for (let i = 0; i < particleMenus; i++) {
        menus.push(menuOptions[option].menu);
    }

    const conversionFormSubmenu = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            <h3
                className={styles.title}
                // this needs to change caret from sideways to down, and toggle state
                // setVisibility(true)
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
                    {menus}
                    {option === "particle" ? (
                        <Button
                            type="default"
                            onClick={() => {
                                setParticleMenus(particleMenus + 1);
                                console.log(particleMenus);
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
