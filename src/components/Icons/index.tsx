import React from "react";
import {
    PauseOutlined,
    CaretRightOutlined,
    UploadOutlined,
    LoadingOutlined,
    DownOutlined,
    ArrowLeftOutlined,
    SyncOutlined,
} from "@ant-design/icons";

import PurpleArrowPointingRight from "../../assets/open-arrow.svg";
import AicsLogoWhite from "../../assets/AICS-logo-white.svg";
import ClockwiseArrow from "../../assets/step-forward.svg";
import CounterClockwiseArrow from "../../assets/step-back.svg";

const styles = require("./style.css");

export const Loading = <LoadingOutlined style={{ fontSize: 40 }} spin />;
export const Play = <CaretRightOutlined />;
export const Pause = <PauseOutlined />;
export const UploadFile = <UploadOutlined />;
export const DownArrow = <DownOutlined />;
export const CaretRight = <CaretRightOutlined />;
export const GoBack = <ArrowLeftOutlined />;
export const Reset = <SyncOutlined className={styles.flipH} />;

export const PurpleArrow = <img src={PurpleArrowPointingRight} />;
export const AicsLogo = <img src={AicsLogoWhite} />;
export const StepForward = <img src={ClockwiseArrow} />;
export const StepBack = <img src={CounterClockwiseArrow} />;
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
