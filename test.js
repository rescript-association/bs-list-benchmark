const a = [1, [2, null]];
function f1(a) {
  if (a === null) return;
  return f1(a[1]);
}

const b = [1, [2, 0]];
function f2(b) {
  if (b === 0) return;
  return f2(b[1]);
}

console.log("OPTIMIZED FUNCTION: ");
%PrepareFunctionForOptimization(f1);
f1(a);
f1(a);
%OptimizeFunctionOnNextCall(f1);
f1(a);
%DebugPrint(f1);

console.log("---------------------------------");
console.log("ORIGINAL FUNCTION: ");
%PrepareFunctionForOptimization(f2);
f2(b);
f2(b);
%OptimizeFunctionOnNextCall(f2);
f2(b);
%DebugPrint(f2);
