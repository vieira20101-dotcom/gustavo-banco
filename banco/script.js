let saldo = 1000;
let historico = ["Abertura da conta: R$ 1.000,00"];

let formulario = document.getElementById("form-operacao");
let operacao = document.getElementById("operacao");
let campoValor = document.getElementById("valor");
let resultado = document.getElementById("resultado");
let foto = document.getElementById("foto");

function dinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarSaldo() {
  document.getElementById("saldo").textContent = dinheiro(saldo);
}

function mudarOperacao() {
  let ajuda = document.getElementById("ajuda-valor");

  if (operacao.value === "depositar") {
    campoValor.disabled = false;
    ajuda.textContent = "Digite um valor inteiro maior que zero.";
  } else if (operacao.value === "sacar") {
    campoValor.disabled = false;
    ajuda.textContent = "Digite um valor múltiplo de 10.";
  } else {
    campoValor.disabled = true;
    campoValor.value = "";
    ajuda.textContent = "Não precisa preencher o valor nesta operação.";
  }
}

function valorValido(valor) {
  if (campoValor.value.trim() === "") {
    resultado.textContent = "Erro: digite um valor.";
    return false;
  } else if (!Number.isInteger(valor) || valor <= 0) {
    resultado.textContent = "Erro: o valor deve ser inteiro e maior que zero.";
    return false;
  } else if (!Number.isSafeInteger(valor * 3)) {
    resultado.textContent = "Erro: valor muito alto.";
    return false;
  } else {
    return true;
  }
}

function executarOperacao(evento) {
  evento.preventDefault();
  resultado.textContent = "";
  foto.hidden = true;

  let valor = Number(campoValor.value);
  let taxa = valor * 2; 
  let mensagem = "";

  switch (operacao.value) {
    case "consultar":
      mensagem = "Saldo disponível: " + dinheiro(saldo);
      break;

    case "depositar":
      if (!valorValido(valor)) {
        return;
      }

      if (saldo < taxa - valor) {
        mensagem = "Erro: saldo insuficiente para pagar a taxa após o depósito.";
      } else {
        saldo = saldo + valor - taxa;
        historico.push("Depósito: +" + dinheiro(valor));
        historico.push("Taxa de depósito (200%): -" + dinheiro(taxa));

        mensagem = "Depósito realizado: " + dinheiro(valor);
        mensagem += "\nTaxa de 200%: " + dinheiro(taxa);
        mensagem += "\nNovo saldo: " + dinheiro(saldo);
        campoValor.value = "";
        foto.hidden = false;
      }
      break;

    case "sacar":
      if (!valorValido(valor)) {
        return;
      }

      let total = valor + taxa;

      if (valor % 10 !== 0) {
        mensagem = "Erro: o saque deve ser múltiplo de 10.";
      } else if (total > saldo) {
        mensagem = "Erro: saldo insuficiente. O saque com a taxa custa " + dinheiro(total) + ".";
      } else {
        let notas = [100, 50, 20, 10];
        let restante = valor;
        let totalNotas = 0;
        mensagem = "Saque realizado: " + dinheiro(valor) + "\nNotas entregues:";

        for (let i = 0; i < notas.length; i++) {
          let quantidade = 0;

          while (restante >= notas[i]) {
            restante = restante - notas[i];
            quantidade++;
            totalNotas++;
          }

          if (quantidade > 0) {
            mensagem += "\n" + quantidade + " nota(s) de " + dinheiro(notas[i]);
          }
        }

        saldo = saldo - total;
        historico.push("Saque: -" + dinheiro(valor));
        historico.push("Taxa de saque (200%): -" + dinheiro(taxa));

        mensagem += "\nTotal de notas: " + totalNotas;
        mensagem += "\nTaxa de 200%: " + dinheiro(taxa);
        mensagem += "\nTotal descontado: " + dinheiro(total);
        mensagem += "\nSaldo restante: " + dinheiro(saldo);
        campoValor.value = "";
        foto.hidden = false;
      }
      break;

    case "extrato":
      mensagem = "EXTRATO\n";
      for (let i = 0; i < historico.length; i++) {
        mensagem += (i + 1) + ". " + historico[i] + "\n";
      }
      mensagem += "\nSaldo atual: " + dinheiro(saldo);
      break;

    default:
      mensagem = "Erro: escolha uma operação válida.";
  }

  resultado.textContent = mensagem;
  atualizarSaldo();
}

formulario.addEventListener("submit", executarOperacao);
operacao.addEventListener("change", mudarOperacao);

atualizarSaldo();
mudarOperacao();
