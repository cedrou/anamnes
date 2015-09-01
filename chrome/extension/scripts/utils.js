"use strict";


String.prototype.padLeft = function (length, character) { 
    return new Array(length - this.length + 1).join(character || ' ') + this; 
};


Date.prototype.toFormattedString = function () {
    return [String(this.getMonth()+1).padLeft(2, '0'),
            String(this.getDate()).padLeft(2, '0'),
            String(this.getFullYear()).substr(2, 2)].join("/") + " " +
           [String(this.getHours()).padLeft(2, '0'),
            String(this.getMinutes()).padLeft(2, '0')].join(":");
};

