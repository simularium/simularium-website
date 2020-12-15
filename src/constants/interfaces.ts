export interface TrajectoryDisplayData {
    modelName: string;
    id: string;
    title: string;
    subtitle?: string;
    totalSimulatedTime: string;
    authors: string;
    publication: {
        title: string;
        journal: string;
        year: number;
        url: string;
    };
    description: string;
    legalese?: string;
    imageFile: string;
    gifFile: string;
}
