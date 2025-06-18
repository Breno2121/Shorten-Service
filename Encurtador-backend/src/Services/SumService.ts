export function Sum(a: number, b: number) {
    return a + b;
}

export function Divisao(a: number, b: number) {
    if (b === 0){
        return new Error("Divisao por zero nao e permitida")
    }
    return a / b;
}