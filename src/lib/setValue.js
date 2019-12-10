export default function setValue(element, value) {
    const tagName = element.tagName.toLowerCase();
    const type = element.getAttribute('type');

    if (tagName === 'input' && ['checkbox', 'radio'].indexOf(type) >= 0) {
        element.checked = (value) ? 'checked' : false;
    } else if (tagName === 'input' || tagName === 'select') {
        element.value = value;
    }

    element.innerHTML = value;
}
