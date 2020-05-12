declare interface HTMLElement {
    fadeInOut: () => Animation;
    setAttributes: (attrs: any) => void;
    appendChildren: (children: HTMLElement[]) =>  void;
}