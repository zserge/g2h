start
	= first:line rest:("\n" l:line { return l;})* "\n"? {
		var code = [first].concat(rest);
		var res = [];
		for (var i = 0; i < code.length; i++) {
			if (code[i][0]) res.push([code[i][0]]);
			if (code[i][1]) res.push(code[i][1]);
		}
		return res;
	}

line
	= " "* l:label " "+ s:statement " "* {return [l, s]}
	/ " "* s:statement " "* { return [null, s]}
	/ " "* l:label " "* {return [l, null]}
	/ ""

statement = if / call

if
  = "if" " "* cond:call " "* "then" " "* action:call { return [{tok:'B', val:'if'}, cond, action]}

call
	= id:id " "* "=" " "* c:call { return [{tok:'B', val:'set'}, id, c]}
	/ id:id args:(" "+ a:arg { return a; })* { return [id].concat(args)}
	/ arg

arg = id / string / number

//
// Tokens
//
label "label"
	= "." s1:[a-zA-Z_] s2:[0-9a-zA-Z_]+ { return {tok: "L", val: s1 + s2.join("")}}

id "id"
	= ! "if" ! "then" s1:[a-zA-Z_] s2:[0-9a-zA-Z_]* { return {tok: "I", val: s1 + s2.join("")}}

string
	= "\'" s:[^']* "\'" { return {tok: "S", val: s.join("")}}

number "number"
	= digits:[0-9]+ { return {tok: "N", val: parseInt(digits.join(""), 10)}}

