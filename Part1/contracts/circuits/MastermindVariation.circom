pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit

template MastermindVariation(n, m) {
    signal input pubGuess[n];
    signal input punNumberHits;
    signal input pubNumberBlows;
    signal input pubHash;

    // private
    signal input solution[n];
    signal input salt;

    // Output
    signal output solutionHash;

    component lessThan[2*n];

    for (var i = 0; i < n; i++) {
        lessThan[i] = LessThan(5);
        lessThan[i].in[0] <== pubGuess[i];
        lessThan[i].in[1] <== m;
        lessThan[i].out === 1;

        lessThan[i+n] = LessThan(5);
        lessThan[i+n].in[0] <== solution[i];
        lessThan[i+n].in[1] <== m;
        lessThan[i+n].out === 1;
    }

    component poseidon = Poseidon(n + 1);
    poseidon.inputs[0] <== salt;
    for (var i = 0; i < n; i++) {
        poseidon.inputs[i + 1] <== solution[i];
    }

    solutionHash <== poseidon.out;
    pubHash === solutionHash;
}

component main { public [pubGuess, punNumberHits, pubNumberBlows, pubHash] } = MastermindVariation(5, 10);
