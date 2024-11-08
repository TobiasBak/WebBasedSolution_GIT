function loadData(path) {
    const request = new XMLHttpRequest();
    const cacheBuster = `?t=${new Date().getTime()}`;
    request.open('GET', path + cacheBuster, false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error(`Failed to load data from ${path}`);
    }
}