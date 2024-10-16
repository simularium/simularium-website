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
    CaretDownFilled,
} from "@ant-design/icons";

import PurpleArrowPointingRight from "../../assets/open-arrow.svg";
import AicsLogoWhite from "../../assets/AICS-logo-full.png";
import Beta from "../../assets/beta.svg";
import CaretAICS from "../../assets/icon-caret.svg";

export const Loading = <LoadingOutlined style={{ fontSize: 40 }} spin />;
export const Play = <CaretRightOutlined />;
export const Pause = <PauseOutlined />;
export const UploadFile = <ImportOutlined />;
export const DownArrow = <DownOutlined />;
export const UpArrow = <DownOutlined style={{ transform: "rotate(180deg)" }} />;
export const CaretRight = <CaretRightOutlined />;
export const GoBack = <ArrowLeftOutlined />;
export const Reset = <HomeOutlined />;
export const ZoomIn = <PlusOutlined />;
export const Cancel = <PlusOutlined style={{ transform: "rotate(45deg)" }} />;
export const ZoomOut = <MinusOutlined />;
export const Share = <ShareAltOutlined />;
export const Warn = <WarningOutlined />;
export const Link = <LinkOutlined />;
export const Download = <DownloadOutlined size={32} />;
export const LoopOutlined = <RetweetOutlined />;
export const Exclamation = <ExclamationCircleFilled />;

export const PurpleArrow = <img src={PurpleArrowPointingRight} />;
export const AicsLogo = <img src={AicsLogoWhite} style={{ width: "140px" }} />;
export const BetaTag = <img src={Beta} style={{ width: "42px" }} />;
export const UpRightArrow = <ArrowLeftOutlined rotate={135} />;
export const DownCaret = (
    <img
        src={CaretAICS}
        style={{ width: "16px", transform: "rotate(180deg)" }}
    />
);
export const FilledCaret = <CaretDownFilled />;

export default {
    Play,
    Pause,
    UploadFile,
    Loading,
    DownArrow,
    CaretRight,
    ArrowLeftOutlined,
    GoBack,
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
    UpRightArrow,
    Exclamation,
    Cancel,
    FilledCaret,
};
