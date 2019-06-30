# BuckleScript List Benchmark

This benchmark demonstrates how to optimize list iteration speed in all major
JS engines by tweaking the internal runtime representation.

As for right now, the expression `let myList = ["a", "b", "c"]` is compiled to
following JavaScript:

```
var myList = /* :: */[
  "a",
  /* :: */[
    "b",
    /* :: */[
      "c",
      /* [] */0
    ]
  ]
];
```

Note how the last element in the array is terminated with a `0` value. This
will cause V8 to do a [kind
transition](https://v8.dev/blog/elements-kinds#avoid-elements-kind-transitions)
to a polymorphic kind [which ideally should be
avoided](https://v8.dev/blog/elements-kinds#avoid-polymorphism).

To prevent this, the internal list representation must be terminated with a non-SMI value, such as
`false`, `null`, etc:

```
var myList = /* :: */[
  "a",
  /* :: */[
    "b",
    /* :: */[
      "c",
      /* [] */null
    ]
  ]
];
```

## Setup

```
npm install jsvu -g

# Make sure to tick chakra, javascriptcore, spidermonkey, v8 and v8-debug
jsvu
```

## Run full Benchmark

```
# Will run the performance test for each JS engine
./benchmark.sh
```

**Test Results:**

Macbook Pro 13" 2016, 3,3 GHz Intel Core i7, 16GB ram

The benchmark does 3 runs per `original` / `optimized` group to make sure that
there are no warm-up side-effects. Each function is called `1e7` times to
ensure an obversable time diff.

The optimized function uses `null` as list terminator, the original function uses
a `0` (current behavior in BuckleScript). The test source code can be found in [`./perf.js`](./perf.js).

```
./benchmark.sh

Run V8:
optimized: 1242 ms.
original: 1722 ms.
optimized: 1263 ms.
original: 1734 ms.
optimized: 1233 ms.
original: 1760 ms.

Run JavaSciptCore:
optimized: 430 ms.
original: 835 ms.
optimized: 881 ms.
original: 936 ms.
optimized: 859 ms.
original: 938 ms.

Run SpiderMonkey:
optimized: 542 ms.
original: 492 ms.
optimized: 567 ms.
original: 482 ms.
optimized: 546 ms.
original: 518 ms.

Run Chakra:
optimized: 1112 ms.
original: 3575 ms.
optimized: 908 ms.
original: 3479 ms.
optimized: 894 ms.
original: 3513 ms.
```

There are some interesting observations:

- ~30% better V8 / Chakra performance
- +9% worse performance in SpiderMonkey, but the performance there is already 3 times as fast as V8
- Not sure why, but in JSC, the first call has a huge gap with +51% performance boost, while every other call is only around +6%

## Credits

Thanks to @bmeurer for explaining element kinds mechanic in V8, how to
interpret the bytecode debugging output and writing the performance tests.

**Links:**

- [V8 Element Kinds | V8 Dev Blog](https://v8.dev/blog/elements-kinds#the-elements-kind-lattice)
