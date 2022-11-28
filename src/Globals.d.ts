declare module "*.css" {
    // this type is from react-scripts https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/lib/react-app.d.ts
    // it is better since the data is immutable
    const classes: { readonly [key: string]: string };
    export default classes;
}
