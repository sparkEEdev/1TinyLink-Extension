export const isValidURL = (value: string): boolean => {

    let regex: RegExp = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm);

    return regex.test(value);
}

export const copyToClipboard = (url: string): void => {

    let copyElement: HTMLTextAreaElement = document.createElement('textarea');

    copyElement.value = url;

    document.body.appendChild(copyElement);

    copyElement.select();

    document.execCommand('copy');

    document.body.removeChild(copyElement);
}