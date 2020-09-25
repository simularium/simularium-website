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
} from "@ant-design/icons";

import PurpleArrowPointingRight from "../../assets/open-arrow.svg";

export const Loading = <LoadingOutlined style={{ fontSize: 40 }} spin />;
export const StepBack = <StepBackwardOutlined />;
export const Play = <CaretRightOutlined />;
export const Pause = <PauseOutlined />;
export const StepForward = <StepForwardOutlined />;
export const UploadFile = <UploadOutlined />;
export const DownArrow = <DownOutlined />;
export const GoBack = <ArrowLeftOutlined />;
export const PurpleArrow = <img src={PurpleArrowPointingRight} />;
export default {
    StepBack,
    Play,
    Pause,
    StepForward,
    UploadFile,
    Loading,
    DownArrow,
    GoBack,
    PurpleArrow,
};
