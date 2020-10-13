export interface TrajectoryDisplayData {
    modelName: string;
    id: string;
    extension: string;
    title: string;
    totalSimulatedTime: string;
    authors: string;
    publication: {
        title: string;
        journal: string;
        year: number;
        url: string;
    };
    description: string;
    imageFile: string;
}
