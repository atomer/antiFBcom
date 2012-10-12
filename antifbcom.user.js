// Generated by CoffeeScript 1.3.3
/*
// ==UserScript==
// @name        anti FB com
// @namespace   http://www.atomer.sakura.ne.jp
// @description 特定ユーザーのfacebookコメントを非表示にする
// @include     https://www.facebook.com/plugins/comments.php*
// @version     0.1
// ==/UserScript==
*/

(function() {
  var ANTI_USER_DATA, addAntiUser, aliveUser, createAntiUserButton, isAntiUser, item, items, list, noneDisp, save, _i, _len;
  list = document.querySelector(".uiList");
  if (!list) {
    return;
  }
  try {
    ANTI_USER_DATA = JSON.parse((typeof localStorage !== "undefined" && localStorage !== null ? localStorage.antifbcom : void 0) || "{}");
  } catch (e) {
    ANTI_USER_DATA = {};
  }
  save = function(o) {
    localStorage["antifbcom"] = JSON.stringify(o || {});
  };
  addAntiUser = function(id) {
    ANTI_USER_DATA[id] = true;
    save(ANTI_USER_DATA);
  };
  aliveUser = function(id) {
    delete ANTI_USER_DATA[id];
    return save(ANTI_USER_DATA);
  };
  isAntiUser = function(id) {
    return !!ANTI_USER_DATA[id];
  };
  noneDisp = function(elm, id) {
    var aliveButton, div;
    elm.firstChild.style.display = "none";
    div = document.createElement("div");
    div.style.marginBottom = "8px";
    aliveButton = document.createElement("a");
    aliveButton.innerHTML = "[復活]";
    aliveButton.title = id;
    aliveButton.addEventListener("click", function() {
      aliveUser(id);
      elm.removeChild(div);
      elm.firstChild.style.display = "block";
      return false;
    }, false);
    div.appendChild(aliveButton);
    return elm.appendChild(div);
  };
  createAntiUserButton = function(elm) {
    var anchor, btn, fsm, href, matches, name;
    anchor = elm.querySelector(".postActor");
    if (anchor) {
      href = anchor.href;
      matches = href.match(/\/([^\/]+)$/);
      name = matches && matches[1] ? matches[1] : null;
      if (name) {
        if (isAntiUser(name)) {
          noneDisp(elm, name);
        }
        fsm = elm.querySelector(".fsm");
        btn = document.createElement("a");
        btn.setAttribute("data-id", name);
        btn.href = "#";
        btn.innerHTML = "[消]";
        btn.style.margin = "0 1em";
        return fsm.appendChild(btn);
      }
    }
  };
  list.addEventListener("click", function(e) {
    var elm, id;
    id = e.target.getAttribute("data-id");
    if (id) {
      addAntiUser(id);
      elm = e.target;
      while (elm.tagName !== "LI") {
        elm = elm.parentNode;
      }
      noneDisp(elm);
      return false;
    }
  }, false);
  items = list.querySelectorAll(".uiListItem") || [];
  for (_i = 0, _len = items.length; _i < _len; _i++) {
    item = items[_i];
    createAntiUserButton(item);
  }
  list.addEventListener("DOMNodeInserted", function(e) {
    var target, _j, _len1;
    target = e.target;
    if (target.className.indexOf("fbFeedbackPost") !== -1) {
      createAntiUserButton(target);
      items = target.querySelectorAll(".uiListItem") || [];
      for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
        item = items[_j];
        createAntiUserButton(item);
      }
    }
  }, false);
})();