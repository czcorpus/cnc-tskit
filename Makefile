all : library
library : clean lib
.PHONY: lib library clean
lib :
	nodejs node_modules/rollup/dist/bin/rollup --c rollup.config.js
clean :
	rm -rf ./dist/* ./dist-es6/* ./dist-umd/*

