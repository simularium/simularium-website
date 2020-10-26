import { PlotParams } from "react-plotly.js";

// TODO: import from observable manager
interface ScatterTrace {
    x: number[];
    y: number[];
    mode: "markers" | "lines" | "lines+markers";
    type: "scatter";
    name?: string;
}
interface HistogramTrace {
    x: number[];
    y: number[];
    type: "histogram";
    name?: string;
}

interface Layout {
    title: string;
    /* cSpell:disable */
    xaxis: { title: string };
    yaxis: { title: string };
    /* cSpell:enable */
}

export interface RawPlotParams {
    data: (ScatterTrace | HistogramTrace)[];
    layout: Layout;
}

export interface PlotParamsWithKey extends PlotParams {
    key: string;
}
