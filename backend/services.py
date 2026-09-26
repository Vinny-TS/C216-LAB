def somar(a: float, b: float) -> float:
    return a + b

def dividir(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Divisão por zero não é permitida.")
    return a / b

def validar_usuario(dados: dict) -> bool:
    campos_obrigatorios = ["username", "email"]
    for campo in campos_obrigatorios:
        if campo not in dados or not dados[campo]:
            raise ValueError(f"O campo '{campo}' é obrigatório.")
    return True