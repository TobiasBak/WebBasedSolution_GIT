var whylineData = [
	{ type: "node", value: "Why did that not happen" },
	{ type: "connector", value: "true" },
	{ type: "node", value: "Hejsa med dig" },
	{ type: "connector", value: "false" },
	{ type: "node", value: "Ooooogooanb" },
	{ type: "connector", value: "true" },
	{ type: "node", value: "Hejsa med dig" },
	{ type: "connector", value: "false" },
	{ type: "node", value: "Ooooogooanb" },
	{ type: "connector", value: "true" },
	{ type: "node", value: "Hejsa med dig" },
	{ type: "connector", value: "false" },
	{ type: "node", value: "Ooooogooanb" },
];

function renderWhyLine() {
	const $whyline = $('#whyline');
	$whyline.empty();
	whylineData.forEach(item => {
		if (item.type === "node") {
			const $node = $('<div>').addClass('whyline-node').text(item.value);
			$whyline.append($node);
		} else if (item.type === "connector") {
			const $connector = $('<div>').addClass('whyline-connector');
			const $text = $('<span>').text(item.value);
			$connector.append($text);
			$whyline.append($connector);
		}
	});
}
