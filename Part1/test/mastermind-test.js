const { expect, assert } = require("chai");
const buildPoseidon = require("circomlibjs").buildPoseidon;
const { groth16 } = require("snarkjs");
const { ethers } = require("ethers")

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
exports.p = require("ffjavascript").Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

describe("MasterMind", function () {
    this.timeout(100000000);

    const code = [1, 2, 3, 4, 5];
    const salt = [25];
    let input;
    let hash;
    beforeEach(async function () {

        const poseidonJs = await buildPoseidon();

        hash = ethers.BigNumber.from(poseidonJs.F.toObject(poseidonJs(salt.concat(code))))

        input = {
            "pubGuess": ["0", "0", "0", "0", "0"],
            "punNumberHits": "0",
            "pubNumberBlows": "0",
            "pubHash": hash,
            "solution": code,
            "salt": salt
        }
    });

    it("should validate hash of circuit", async function () {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        const witness = await circuit.calculateWitness(input, true);
        assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(hash)));
    });
});