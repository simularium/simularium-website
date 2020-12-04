export interface TrajectoryDisplayData {
    modelName: string;
    id: string;
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
    gifFile: string;
}
