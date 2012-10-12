// ==UserScript==
// @name        name
// @namespace   http://www.atomer.sakura.ne.jp
// @description desc
// @include     https://www.facebook.com/plugins/comments.php*
// @version     0.1
// ==/UserScript==

var s = document.createElement("script");
s.src = "http://localhost:8080/greasemonkey/antiFBcom/antifbcom.user.js";
document.getElementsByTagName("head")[0].appendChild(s);