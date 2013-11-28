Q.LEFT = 'left';
Q.RIGHT= 'right';
Q.LEFT_DIR = 1;
Q.RIGHT_DIR= -1;
Q.PLR = SPRITE_DATA.player;
Q.NME = SPRITE_DATA.enemy;
Q.DIES_IN_VOID = 'diesInVoid';
Q.frames = function (str) {
	var arr = [],
		words = str.split(','),
		word,
		range;
	//Add individual number strings, and break down number ranges
	for (var w = 0; w < words.length; w++) {
		word = words[w];
		range = word.split('-');
		if (range.length == 2) {
			if (range[0] <= range[1]) {
				for (var r = parseInt(range[0]); r <= parseInt(range[1]); r++) arr.push(r);
			} else {
				for (var r = parseInt(range[0]); r >= parseInt(range[1]); r--) arr.push(r);
			}
		} else {
			arr.push(parseInt(word));
		}
	}
	return arr;
}