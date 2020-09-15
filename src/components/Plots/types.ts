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
    xaxis: { title: string };
    yaxis: { title: string };
}

export interface PlotInterface {
    data: (ScatterTrace | HistogramTrace)[];
    layout: Layout;
}

export type PlotData = PlotInterface[];
