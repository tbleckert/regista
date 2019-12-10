export default function getValue(element) {
    const tagName = element.tagName.toLowerCase();
    const type = element.getAttribute('type');

    if (tagName === 'input' && ['checkbox', 'radio'].indexOf(type) >= 0) {
        return (element.checked) ? element.value || true : false;
    }

    if (tagName === 'input' || tagName === 'select') {
        return element.value;
    }

    return element.innerHTML;
}
