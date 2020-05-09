HTMLElement.prototype.fadeInOut = function (): Animation {
    // TODO: refactor to keyframes, add params to the prototype method
    return this.animate([
        { opacity: '0', zIndex: '-99' },
        { opacity: '1', zIndex: '9999999' },
        { opacity: '1' },
        { opacity: '1' },
        { opacity: '1' },
        { opacity: '1' },
        { opacity: '0', zIndex: '-99' }
    ], {
        duration: 2000,
        iterations: 1,
        easing: 'ease-in-out',
    }) 
}