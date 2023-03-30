import React, { useState } from "react";
import { Upload, Select, Divider, Button, Input } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import styles from "./style.css";
// import theme from "../../styles/light-theme.css";
import theme from "../CustomModal/light-theme.css";
import classNames from "classnames";
import { CaretDown } from "../Icons";

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
    [key: string]: any;
    title: string;
    subtitle: string;
    menu: JSX.Element;
}

const fileList: UploadFile[] = [
    {
        uid: "0",
        name: "xxx.png",
    },
];

const selectOptions = [
    { value: "cytosim", label: "cytosim" },
    { value: "cellPACK", label: "cellPACK" },
    { value: "Smoldyn", label: "Smoldyn" },
    { value: "SpringSaLaD", label: "SpringSaLaD" },
];

const ConversionFormSubmenu = ({
    title,
    subtitle,
    menu,
}: ConversionFormSubmenuProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(true);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isFileLoaded, setFileLoaded] = useState<boolean>(false);

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

    const conversionFormSubmenu = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            <h3 className={styles.title}>
                {" "}
                {CaretDown} {title}{" "}
            </h3>
            <h3> {subtitle} </h3>
            {menu}
            <Divider orientation="right" orientationMargin={400}>
                {" "}
            </Divider>
        </div>
    );

    return conversionFormSubmenu;
};

export default ConversionFormSubmenu;
