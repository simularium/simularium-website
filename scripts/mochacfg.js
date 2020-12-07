['.png', '.gif'].forEach(extension => {
    require.extensions[extension] = () => null;
});