###
// ==UserScript==
// @name        anti FB com
// @namespace   http://www.atomer.sakura.ne.jp
// @description 特定ユーザーのfacebookコメントを非表示にする
// @include     https://www.facebook.com/plugins/comments.php*
// @version     0.1.1
// ==/UserScript==
###

(->
	list = document.querySelector ".uiList"
	if not list
		return

	try
		ANTI_USER_DATA = JSON.parse(localStorage?.antifbcom or "{}")
	catch e
		ANTI_USER_DATA = {}

	save = (o)->
		localStorage["antifbcom"] = JSON.stringify o or {}
		return

	# 非表示ユーザーの追加
	addAntiUser = (id)->
		ANTI_USER_DATA[id] = true
		save(ANTI_USER_DATA)
		return

	aliveUser = (id)->
		delete ANTI_USER_DATA[id]
		save(ANTI_USER_DATA)


	# 非表示ユーザーチェック
	isAntiUser = (id)->
		return !!ANTI_USER_DATA[id]

	# エレメント非表示
	noneDisp = (elm, id)->
		elm.firstChild.style.display = "none"
		# 復帰用のボタン生成
		div = document.createElement "div"
		div.style.marginBottom = "8px"
		aliveButton = document.createElement "a"
		aliveButton.innerHTML = "[復活]"
		aliveButton.title = id
		aliveButton.addEventListener "click", ->
			aliveUser id
			elm.removeChild div
			elm.firstChild.style.display = "block"
			return false
		, false
		div.appendChild aliveButton
		elm.appendChild div

	# 非表示ボタン追加
	createAntiUserButton = (elm)->
		anchor = elm.querySelector ".postActor"
		if anchor
			href = anchor.href
			matches = href.match /\/([^\/]+)$/
			name = if matches and matches[1] then matches[1] else null
			if name
				if isAntiUser name
					noneDisp elm, name
				fsm = elm.querySelector ".fsm"
				btn = document.createElement "a"
				btn.setAttribute "data-id", name
				btn.href = "#"
				btn.innerHTML = "[消]"
				btn.style.margin = "0 1em"
				fsm.appendChild btn

	list.addEventListener "click", (e)->
		id = e.target.getAttribute "data-id"
		if id
			addAntiUser id
			# アイテムベースのエレメント（LI)を取得
			elm = e.target
			elm = elm.parentNode while elm.tagName isnt "LI"
			noneDisp elm
			return false;
		return
	, false

	# 初期アイテム
	items = list.querySelectorAll(".fbFeedbackPost") or []
	createAntiUserButton(item) for item in items

	# 追加アイテム
	list.addEventListener "DOMNodeInserted", (e)->
		target = e.target
		if target.className.indexOf("fbFeedbackPost") isnt -1
			createAntiUserButton target
			items = target.querySelectorAll(".uiListItem") or []
			createAntiUserButton(item) for item in items
		return
	, false

	return
)()