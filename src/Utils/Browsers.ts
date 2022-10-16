const thisWindow: any = window
export const isSafari = /constructor/i.test(thisWindow.HTMLElement.toString()) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!thisWindow['safari'] || (typeof thisWindow.safari !== 'undefined' && thisWindow['safari'].pushNotification));

// Internet Explorer 6-11
const thisDocument: any = window
export const isIE = /*@cc_on!@*/false || !!thisDocument.documentMode;