import React from "react";
import {
    PauseOutlined,
    CaretRightOutlined,
    ImportOutlined,
    LoadingOutlined,
    DownOutlined,
    ArrowLeftOutlined,
    PlusOutlined,
    MinusOutlined,
    HomeOutlined,
    ShareAltOutlined,
    WarningOutlined,
    LinkOutlined,
    DownloadOutlined,
    RetweetOutlined,
    ExclamationCircleFilled,
} from "@ant-design/icons";

import PurpleArrowPointingRight from "../../assets/open-arrow.svg";
import AicsLogoWhite from "../../assets/AICS-logo-full.png";
import ClockwiseArrow from "../../assets/step-forward.svg";
import CounterClockwiseArrow from "../../assets/step-back.svg";
import Beta from "../../assets/beta.svg";
import Orthographic from "../../assets/orthographic.svg";
import Perspective from "../../assets/perspective.svg";

export const Loading = <LoadingOutlined style={{ fontSize: 40 }} spin />;
export const Play = <CaretRightOutlined />;
export const Pause = <PauseOutlined />;
export const UploadFile = <ImportOutlined />;
export const DownArrow = <DownOutlined />;
export const CaretRight = <CaretRightOutlined />;
export const LeftArrow = <ArrowLeftOutlined />;
export const Reset = <HomeOutlined />;
export const ZoomIn = <PlusOutlined />;
export const ZoomOut = <MinusOutlined />;
export const Share = <ShareAltOutlined />;
export const Warn = <WarningOutlined />;
export const Link = <LinkOutlined />;
export const Download = <DownloadOutlined size={32} />;
export const LoopOutlined = <RetweetOutlined />;
export const Exclamation = <ExclamationCircleFilled />;

export const PurpleArrow = <img src={PurpleArrowPointingRight} />;
export const AicsLogo = <img src={AicsLogoWhite} style={{ width: "140px" }} />;
export const StepForward = <img src={ClockwiseArrow} />;
export const StepBack = <img src={CounterClockwiseArrow} />;
export const BetaTag = <img src={Beta} style={{ width: "42px" }} />;
export const OrthographicCamera = <img src={Orthographic} />;
export const PerspectiveCamera = <img src={Perspective} />;
export const UpRightArrow = <ArrowLeftOutlined rotate={135} />;

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
    LeftArrow,
    PurpleArrow,
    AicsLogo,
    Reset,
    ZoomIn,
    ZoomOut,
    Share,
    Warn,
    BetaTag,
    Link,
    Download,
    LoopOutlined,
    OrthographicCamera,
    PerspectiveCamera,
    UpRightArrow,
    Exclamation,
};
