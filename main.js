var fs = require('fs');
var g2h = require('./g2h.js');

function call(f, env, funcs) {
	if (f.tok == 'S' || f.tok == 'N') {
		return f.val;
	}

	if (f.tok == 'I') {
		return env[f.val] || 0;
	}

	if (f[0].tok == 'B' && f[0].val == 'set') {
		return env[f[1].val] = call(f[2], env, funcs);
	}

	if (funcs[f[0].val]) {
		return funcs[f[0].val](f.slice(1))
	} else {
		throw('Unknown function: ' + f[0].val);
	}
}
function g2hEval(code) {
	var env = {};
	var labels = {};
	var funcs = {
		'print': function(args) {
			console.log(args.map(function(i) {
				if (i.tok == 'I') return env[i.val] || 0;
				if (i.tok == 'N' || i.tok == 'S') return i.val;
			}).join('\t'));
			return 0;
		},
		'eq': function(args) { return call(args[0], env, funcs) == call(args[1], env, funcs) ? 1 : 0},
		'neq': function(args) { return call(args[0], env, funcs) != call(args[1], env, funcs) ? 1 : 0},
		'less': function(args) { return call(args[0], env, funcs) < call(args[1], env, funcs) ? 1 : 0},
		'lesseq': function(args) { return call(args[0], env, funcs) <= call(args[1], env, funcs) ? 1 : 0},
		'minus': function(args) { return call(args[0], env, funcs) - call(args[1], env, funcs)},
		'plus': function(args) { return call(args[0], env, funcs) + call(args[1], env, funcs)},
		'goto': function(args) { pc = labels[args[0].val] - 1; },
	}
	try {
		var ast = g2h.parse(code);
		pc = 0; // global
		while (pc < ast.length) {
			var node = ast[pc++];
			var n = node[0];
			if (n && n.tok == 'L') {
				labels[n.val] = pc;
			} else if (n.tok == 'B' && n.val == 'if') {
				var ok = call(node[1], env, funcs);
				if (ok) {
					call(node[2], env, funcs);
				}
			} else {
				call(node, env, funcs);
			}
	}	} catch (e) {
		console.log(e);
	}
}

// argv[0] is node, argv[1] is main.js, argv[2] is script to run
fs.readFile(process.argv[2], 'utf8', function(err, data) {
	g2hEval(data);
});

