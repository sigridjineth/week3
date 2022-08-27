const { expect, assert } = require("chai");
const buildPoseidon = require("circomlibjs").buildPoseidon;
const { groth16 } = require("snarkjs");
const { ethers } = require("ethers")

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
exports.p = require("ffjavascript").Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const poseidonHash = async (items) => {
    let poseidon = await buildPoseidon();
    return poseidon.F.toObject(poseidon(items));
};

describe("MasterMind", function () {
    this.timeout(100000000);

    const code = [1, 2, 3];
    const salt = 25;
    let input;
    let hash;

    beforeEach(async function () {
        hash = await poseidonHash([salt, ...code]);

        input = {
            privSolnA: code[0],
            privSolnB: code[1],
            privSolnC: code[2],
            privSalt: salt,
            pubGuessA: code[0],
            pubGuessB: code[1],
            pubGuessC: code[2],
            pubNumHit: 3,
            pubNumBlow: 0,
            pubSolnHash: hash,
        }
    });

    it("should validate hash of circuit", async function () {
        // given
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");

        // when
        const witness = await circuit.calculateWitness(input, true);
        console.log("witness", witness)

        // then
        assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(hash)));
    });

    it("should not have larger number than integer 10 for both pubGuess and Solution", async() => {
        // given
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");

        // when
        input.pubGuess = ["11", "11", "11", "11", "11"];

        // then
        try {
            await circuit.calculateWitness(input, true);
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    })
});