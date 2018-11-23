/*

jQuery.paysumfield()

Allows only sum (floating number) input to a field with 2 decimals
Auto dot to comma converting for RU
If you need opposite feature to autoconvert comma to dot - you need to tweak a bit ^_^
@xunter
2018-11-23

*/

(function ($) {
	$.fn.paysumfield = function () {
		var DOT_CHAR_RESULT = ",";

		var $field = this;

		$field.keydown(function (e) {
			var $sum = $(this);
			var $input = $sum;
			var sumvalraw = $sum.val();

			//. -> 190
			//, -> 188
			//0 -> 48

			var chr = e.key.length == 1 ? e.key : "";
			if (chr.length && (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)) {
				chr = "";
			}
			console.log({ char: e.char, key: e.key });
			console.log("paymentsum editor: raw -> %s chr -> %s charCode -> %s keyCode -> %s", sumvalraw, chr, e.charCode, e.keyCode);

			var isColon = e.keyCode == 188;
			var isYu = e.keyCode == 190 && e.key == "ю";
			if (e.keyCode == 188 || e.keyCode == 190) {
				chr = ".";
			}

			var isDigitKeyCode = e.keyCode >= 48 && e.keyCode <= 56;

			if (isDigitKeyCode) {
				chr = ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9][e.keyCode - 48]).toString();
			}

			if (chr == "," || chr == "ю") {
				chr = DOT_CHAR_RESULT;
			}

			var isDigit = "1234567890".indexOf(chr) !== -1;
			var isDot = chr == ".";

			if (isDot) chr = DOT_CHAR_RESULT;

			var cursorPos = -1;
			var cursorLen = -1;
			e.selectionStart = this.selectionStart;
			e.selectionEnd = this.selectionEnd;
			e.selectionDirection = this.selectionDirection;
			if (e.selectionDirection == "forward" || e.selectionEnd >= e.selectionStart) {
				cursorPos = e.selectionStart;
				cursorLen = e.selectionEnd - e.selectionStart;
			} else {
				cursorPos = e.selectionEnd;
				cursorLen = e.selectionStart - e.selectionEnd;
			}

			var sumvaltrans = sumvalraw.substr(0, cursorPos) + sumvalraw.substr(cursorPos + cursorLen);
			var sumvalnew = sumvalraw.substr(0, cursorPos) + chr + sumvalraw.substr(cursorPos + cursorLen);

			console.log({ selstart: e.selectionStart, selend: e.selectionEnd, seldir: e.selectionDirection, old: sumvalraw, trans: sumvaltrans, new: sumvalnew });


			if ((e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 39) || (sumvalnew == sumvalraw)) {
				console.log("omit for ops chars");
				return;
			}


			var dotAlreadyInVal = sumvaltrans.indexOf(DOT_CHAR_RESULT) !== -1;

			if (isDot && dotAlreadyInVal) {
				e.preventDefault();
				return false;
			}
			if (isDot || (isColon || isYu)) {
				$input.val(sumvalnew);
				e.preventDefault();
				return false;
			}

			if (!isDigit && !isDot || (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) && chr) {
				e.preventDefault();
				return false;
			}
			console.log({ isDigit: isDigit, isDot: isDot, shiftKey: e.shiftKey });


			if (dotAlreadyInVal) {

				var valAfterDot = sumvalraw.substr(sumvalnew.indexOf(DOT_CHAR_RESULT) + 1);

				if (valAfterDot.length >= 2) {
					e.preventDefault();
					return false;
				}
			}

		});

		function updateField(tb) {
			var $tb = $(tb);
			var sumvalraw = $tb.val();
			if (sumvalraw.length == 0) {
				sumvalraw = "0";
			}
			var sumval = sumvalraw.replaceAll(" ", "").trim().replaceAll(",", ".");
			var num = parseFloat(sumval);
			if (!isNaN(num)) {
				$tb.val(num.toFixed(2).replace(".", ","));
			} else {
				$tb.val("");
			}
		};

		$field.change(function (e) {
			updateField(this);
		});

		this.each(function () { updateField(this); });

		return this;
	};
})(jQuery)