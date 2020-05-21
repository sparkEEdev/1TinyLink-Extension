HTMLElement.prototype.setAttributes = function (attrs: any): void {

    for(var key in attrs) {
        this.setAttribute(key, attrs[key]);
    }

}

HTMLElement.prototype.appendChildren = function (children: HTMLElement[]): void {

    for (var key in children) {
        this.appendChild(children[key]);
    }

}