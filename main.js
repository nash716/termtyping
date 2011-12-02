var commands = [
	'alias',
	'cd',
	'exit',
	'jobs',
	'kill',
	'unalias',
	'chmod',
	'chown',
	'cp',
	'dd',
	'find',
	'history',
	'ln',
	'ls',
	'merge',
	'mkdir',
	'mv',
	'pwd',
	'rm',
	'rmdir',
	'sort',
	'split',
	'touch',
	'cat',
	'comm',
	'diff',
	'echo',
	'grep',
	'less',
	'more',
	'uniq',
	'wc',
	'chsh',
	'date',
	'env',
	'finger',
	'groups',
	'id',
	'login',
	'passwd',
	'shutdown',
	'su',
	'who',
	'ftp',
	'hostname',
	'hostid',
	'ifconfig',
	'ping',
	'rlogin',
	'tcpdump',
	'telnet',
	'at',
	'atq',
	'atrm',
	'batch',
	'ps',
	'gzip',
	'lha',
	'tar',
	'unzip',
	'zip',
	'lpc',
	'lpq',
	'lpr',
	'lprm',
	'lpstat'
];

const promptElement = '<span class="prompt">$&gt; </span>';

var	start		=	null;
var	end		=	null;
var	_input	=	0;
var	count	=	0;
var	wrong	=	0;
var	score	= 	0;
var	tweetText	=	'';
var	now		=	'';
var	isTyping	=	false;
var 	isInsert	=	true;

$(document).ready(function() {
// input output block
	$('<result>').css('display', 'block')
			.appendTo($(document.body));
	$('<in>').appendTo($(document.body));
	
// output block
	$('result').html('Welcome to Terminal Typing!<br />' +
				new Date() + '<br />' + 
				'Type \'typing\' to start!<br />' +
				'other commands: tweet, about, clear');
				
//input block
	$('<span>').text('$> ')
			.attr('id', 'nowline')
			.appendTo($('in'));
	$('<input>').attr('autofocus', 'true')
			.attr('id', 'input')
			.keydown(keyDownHandler)
			.appendTo($('in'));
});

function text(str) {
	str = str.split('&').join('&amp;'); //.replace('&', '&amp;');
	str = str.split('"').join('&quot;'); //.replace('"', '&quot;');
	str = str.split('<').join('&lt;'); //.replace('<', '&lt;');
	str = str.split('>').join('&gt;'); //.replace('>', '&gt;');
	str = str.split("'").join('&#039;'); //.replace("'", '&#039;');
	return str;
}

function appendString(str) {
	$('result').append(str);
}

function keyDownHandler(e) {
	if(e.ctrlKey && String.fromCharCode(e.keyCode).toUpperCase() == 'C' && isTyping) { // Ctrl + C
		_input	=	0;
		count	=	0;
		wrong	=	0;
		start		=	null;
		end		=	null;
		now		=	'';
		isTyping	=	false;
		
		appendString('<br />&gt; ' + text($('#input').val()));
		$('#input').val('');
		$('#nowline').text('$> ');
	}
	if(e.keyCode == 13) { // Enter key pressed
		if (isTyping) {
			typing();
		} else {
			notTyping();
		}
	}
	scrollToBottom();
}

function typing() {
	appendString('<br />&gt; ' + text($('#input').val()));
	if (_input == 0) {
		if ($('#input').val().match(/^[0-9]+$/)) { // num only
			if (parseInt($('#input').val()) < 100 && parseInt($('#input').val()) > 0) { // 
	//valid
				_input = parseInt($('#input').val());
				appendString('<br />ok<br />Press Enter to start the game!');
	// invalid
			} else {
				appendString('<br />Please input a valid number.');
			}
	// invalid
		} else {
			appendString('<br />Please input a number.');
		}
	} else {
		if ($('#input').val() == now) {
		
			if (start == null) {
				start = moment();
			}
			count++;
			if (count > _input) { // Game end
				end = moment();
				
				score = Math.floor((_input * 50 - wrong * _input) / end.diff(start, 'seconds'));
				tweetText = _input + ' 個のコマンドを ' + end.diff(start, 'seconds') + ' 秒で入力しました！スコアは ' + score + ' でした！ #termtyping';
				
				appendString('<br />result: ' + end.diff(start, 'seconds') + 's, score: ' + score);

				_input	=	0;
				count	=	0;
				wrong	=	0;
				start		=	null;
				end		=	null;
				now		=	'';
				isTyping	=	false;
				
				$('#input').val('');
				$('#nowline').text('$> ');
				
				scrollToBottom();
				
				return;
			}
			
			now = commands[Math.abs(Math.floor(Math.random() * commands.length) - 1)];
			appendString('<br />' + count + '/' + _input + ' : ' + now);
			
		} else if(now == '' && $('#input').val() != '') {

			appendString('<br />Press Enter to start the game!');

		} else {
		
			wrong++;
			appendString('<br /><b style="color:red">incorrect!</b><br />' + count + '/' + _input + ' : ' + now);
			
		}
	}
	$('#input').val('');
}

function notTyping() {
	appendString((isInsert ? '<br />' : '') + promptElement + text($('#input').val()));
	isInsert = true;
// game start
	if ($('#input').val().match(/^typing/)) {
	
		isTyping = true;
		$('#nowline').text('> ');
		appendString('<br />How many commands do you input? [1-99]');

	} else {
	
		if ($('#input').val().match(/^tweet/)) {
			if (tweetText != '') {
				appendString('<br />[1] ' + (Math.floor(Math.random() * 9000) + 1000));
				window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText), '', 'width=600px,height=300px');
			} else {
				appendString('<br />You can only tweet after the game!');
			}
		} else if ($('#input').val().match(/^about/)) {
			appendString('<br />作ったひと：<a href="http://twitter.com/nash_fs">@nash_fs</a><br />' + 
						'バグやフィードバッグ等は #termtyping をつけてつぶやいていただければ、（見逃さない限り）対応します。<br />' + 
						'また、英語が間違っている場合も、そーっと教えていただければと思います。');
		} else if ($('#input').val().match(/^clear/)) {
			$('result').html('');
			isInsert = false;
		} else if ($('#input').val() == '') {
			return;
		} else {
			appendString('<br />' + text($('#input').val().replace(/\s.+/, '')) + ' : command not found');
		}
	}
	$('#input').val('');

}

function scrollToBottom() {
	window.scrollBy(0, $(document).height());
}