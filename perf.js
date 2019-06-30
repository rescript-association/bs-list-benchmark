/* This function / value represents the current
 * List implementation in BuckleScript.
 * The Last element is always terminated with
 * a value of 0. */
const b = [1, [2, 0]];
function original(b) {
  if (b === 0) return;
  return original(b[1]);
}

/*
 * This function / value shows the performance
 * boost when Lists would be terminated with a
 * less complex value type, such as false, null, etc.
 * SMI values like 0 cause e.g the V8 engine to treat
 * the array as POLYMORPHIC instead of MONOMORPHIC.
 */
const a = [1, [2, null]];
function optimized(a) {
  if (a === null) return;
  return optimized(a[1]);
}

function test(fn, n, a) {
  let result;
  for (let i = 0; i < n; ++i) {
    result = fn(a);
  }
  return result;
}

test(optimized, 1e7, a);
test(original, 1e7, b);

let groups = [
  [optimized, a], [original, b],
  [optimized, a], [original, b],
  [optimized, a], [original, b]
]


groups.forEach(([fn, a], i) => {
  const start = Date.now ();
  test(fn, 1e8, a);
  const time = Date.now () - start;
  print(`${fn.name }: ${time} ms.`);
});
