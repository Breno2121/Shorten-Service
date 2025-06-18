import { Divisao, Sum } from "../Services/SumService";

describe("Sum Service Test", () => {
    test("Deve verificar se a soma e feita corretamente", () => {
        const resultado = Sum(1, 2);

        expect(resultado).toBe(3);
    })
    test("Deve verificar se a divisao e correta", () => {
        const resultado = Divisao(10, 5);

        expect(resultado).toBe(2)
    })

    test("Deve gerar um erro caso o divisor seja 0", () => {
        const resultado = Divisao( 10, 0);

        expect(resultado).toStrictEqual(new Error('Divisao por zero nao e permitida'))
    })
})