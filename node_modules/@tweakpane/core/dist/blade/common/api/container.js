export function addButtonAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: 'button' }));
}
export function addFolderAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: 'folder' }));
}
export function addTabAsBlade(api, params) {
    return api.addBlade(Object.assign(Object.assign({}, params), { view: 'tab' }));
}
