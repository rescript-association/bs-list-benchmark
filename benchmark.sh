
echo "Run V8:"
~/.jsvu/v8 perf.js

printf "\nRun JavaSciptCore:\n"
~/.jsvu/jsc perf.js

printf "\nRun SpiderMonkey:\n"
~/.jsvu/spidermonkey perf.js

printf "\nRun Chakra:\n"
~/.jsvu/chakra perf.js
