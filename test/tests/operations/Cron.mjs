/**
 * Cron tests
 *
 * @author ransty [keano.porcaro@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */
import TestRegister from "../../TestRegister";

TestRegister.addTests([
    {
        name: "Wednesday first of month",
        input: "At 00:00 on day-of-month 1 and 15 and on Wednesday",
        expectedOutput: "0 0 1,15 * 3",
        recipeConfig: [
            { "op": "From Binary",
                "args": ["Space"] },
            { "op": "Bit shift left",
                "args": [1] },
            { "op": "To Binary",
                "args": ["Space"] }
        ]
    },
    {
        name: "Bit shift right: Logical shift",
        input: "01010101 10101010 11111111 00000000 11110000 00001111 00110011 11001100",
        expectedOutput: "00101010 01010101 01111111 00000000 01111000 00000111 00011001 01100110",
        recipeConfig: [
            { "op": "From Binary",
                "args": ["Space"] },
            { "op": "Bit shift right",
                "args": [1, "Logical shift"] },
            { "op": "To Binary",
                "args": ["Space"] }
        ]
    },
    {
        name: "Bit shift right: Arithmetic shift",
        input: "01010101 10101010 11111111 00000000 11110000 00001111 00110011 11001100",
        expectedOutput: "00101010 11010101 11111111 00000000 11111000 00000111 00011001 11100110",
        recipeConfig: [
            { "op": "From Binary",
                "args": ["Space"] },
            { "op": "Bit shift right",
                "args": [1, "Arithmetic shift"] },
            { "op": "To Binary",
                "args": ["Space"] }
        ]
    },
]);
