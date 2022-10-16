// @ts-ignore
export const isSafari = /constructor/i.test(window.HTMLElement.toString()) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

// Internet Explorer 6-11
// @ts-ignore
export const isIE = /*@cc_on!@*/false || !!document.documentMode;