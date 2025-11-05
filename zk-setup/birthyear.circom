pragma circom 2.0.0;

include "comparators.circom";

template AgeCheck() {
    // Private input: actual age
    signal input age;

    // Public output: 1 if valid, 0 otherwise
    signal output isAdult;

    // We want to check if age >= 18
    component gte = GreaterEqThan(8); // comparator with 8-bit numbers (0–255)
    gte.in[0] <== age;
    gte.in[1] <== 18;

    isAdult <== gte.out;
}

component main = AgeCheck();
