export default function set(obj, path, value) {
    if (!obj) {
        return null;
    }

    const parts = path.split('.');
    const result = Object.assign({}, obj);
    const nextObj = {};
    let nextObjLevel = result;
    let prevObjLevel = obj;

    while (parts.length > 1) {
        const first = parts.shift();
        const second = parts[0];

        if (!Number.isNaN(parseInt(second, 10))) {
            nextObjLevel[first] = (prevObjLevel[first] && Array.isArray(prevObjLevel[first])) ? prevObjLevel[first] : [];
        } else {
            nextObjLevel[first] = {};
        }

        nextObjLevel = nextObjLevel[first];
        prevObjLevel = prevObjLevel[first];
    }

    nextObjLevel[parts[0]] = value;

    return Object.assign({}, result, nextObj);
}
