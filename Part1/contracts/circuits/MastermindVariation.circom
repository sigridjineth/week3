pragma circom 2.0.0;

// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit

template MastermindVariation(n, m) {
    signal input pubGuess[n];
    signal input punNumberHits;
    signal input pubNumberBlows;
    signal input pubHash;

    //private
    signal input solution[n];
    signal input salt;

    //Output
    signal output solutionHash;

}

component main { public [pubGuess, punNumberHits, pubNumberBlows, pubHash] } = MastermindVariation(5, 10);
