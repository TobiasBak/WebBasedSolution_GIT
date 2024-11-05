function loadData(path) {
    fetch(path, {
        mode: 'no-cors'
    })
        .then(response => response.json())
        .then(data => {
            out = data
        });
    return out;
}