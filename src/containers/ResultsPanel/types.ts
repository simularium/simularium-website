import { PlotParams } from "react-plotly.js";

// TODO: import from observable manager
export interface ScatterTrace {
    x: number[];
    y: number[];
    mode: "markers" | "lines" | "lines+markers";
    type: "scatter";
    name?: string;
}
export interface HistogramTrace {
    x: number[];
    y: number[];
    type: "histogram";
    name?: string;
}

/*
TODO: Layout.title is deprecated in Plotly -- change data format to use Layout.title.text
https://plotly.com/javascript/reference/layout/#layout-title-text

Same with Layout.xaxis.title and Layout.yaxis.title:
https://plotly.com/javascript/reference/layout/xaxis/#layout-xaxis-title-text

Once input data files are updated we can have the input data use the
PlotParams interface instead of RawPlotParams.
*/

export interface Layout {
    title: string;
    /* cSpell:disable */
    xaxis: { title: string };
    yaxis: { title: string };
    /* cSpell:enable */
}

// Input data that haven't been configured for layout and style yet
export interface RawPlotParams {
    data: (ScatterTrace | HistogramTrace)[];
    layout: Layout;
}

export interface PlotParamsWithKey extends PlotParams {
    key: string;
}
