import React from "react";
import {
    PauseOutlined,
    CaretRightOutlined,
    StepBackwardOutlined,
    StepForwardOutlined,
    UploadOutlined,
    LoadingOutlined,
    DownOutlined,
    ArrowLeftOutlined,
    SyncOutlined,
} from "@ant-design/icons";

import PurpleArrowPointingRight from "../../assets/open-arrow.svg";
import AicsLogoWhite from "../../assets/AICS-logo-white.svg";

const styles = require("./style.css");

export const Loading = <LoadingOutlined style={{ fontSize: 40 }} spin />;
export const StepBack = <StepBackwardOutlined />;
export const Play = <CaretRightOutlined />;
export const Pause = <PauseOutlined />;
export const StepForward = <StepForwardOutlined />;
export const UploadFile = <UploadOutlined />;
export const DownArrow = <DownOutlined />;
export const CaretRight = <CaretRightOutlined />;
export const GoBack = <ArrowLeftOutlined />;
export const Reset = <SyncOutlined className={styles.flipH} />;

export const PurpleArrow = <img src={PurpleArrowPointingRight} />;
export const AicsLogo = <img src={AicsLogoWhite} />;
export default {
    StepBack,
    Play,
    Pause,
    StepForward,
    UploadFile,
    Loading,
    DownArrow,
    CaretRight,
    ArrowLeftOutlined,
    GoBack,
    PurpleArrow,
    AicsLogo,
    Reset,
};
