# g2h
GoToHell - a very minimal programming language I used for my talk about compilers and interpreters.

It uses PEG.js as a parser generator.

## G2H app example

```
  count = 0
.loop if eq count 10 then goto end
  print 'Count =' count
  count = plus count 1
  goto loop
.end
```

## Grammar

(It's not a real BNF form, it's just for better understanding)

	line   = label statement
	       | statement
				 | label
	stmt   = if | call
	if     = "if" call "then" call
	call   = id "=" call 
		     | id arg arg...
		     | arg
	arg    = id | string | number
	// Token types:
	label  = "." id
	id     = [a-zA-Z_][0-9a-zA-Z_]*
	string = "'" [^']* "'"
	number = [0-9]+

## Features

The language is very simple, it's interpeted, it's sources is about 100 LOC, so it's easy to read and to learn.

## License

Code is distributed under MIT license.
