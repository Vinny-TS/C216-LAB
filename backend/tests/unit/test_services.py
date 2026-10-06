import pytest
from services import somar, dividir, validar_usuario

@pytest.fixture
def usuario_valido():
    return {"username": "aluno_inatel", "email": "aluno@inatel.br"}

def test_somar_sucesso():
    resultado = somar(10, 5)
    assert resultado == 15

@pytest.mark.parametrize("a, b, esperado", [
    (1, 2, 3),
    (-5, 5, 0),
    (2.5, 2.5, 5.0)
])
def test_somar_parametrizado(a, b, esperado):
    assert somar(a, b) == esperado

def test_dividir_por_zero_lanca_excecao():
    with pytest.raises(ValueError, match="Divisão por zero não é permitida."):
        dividir(10, 0)

def test_validar_usuario_com_fixture(usuario_valido):
    assert validar_usuario(usuario_valido) is True