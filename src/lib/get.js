export default function get(obj, path) {
    const parts = path.split('.');
    let level = obj;

    while (level && parts.length) {
        const part = parts.shift();

        level = level[part];
    }

    return level;
}
