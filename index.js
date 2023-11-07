const { readFileSync } = require('fs');

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

function calcularTotalApresentacao(pecas, apre) {

  let total = 0;
  switch (getPeca(pecas, apre).tipo) {
  case "tragedia":
    total = 40000;
    if (apre.audiencia > 30) {
      total += 1000 * (apre.audiencia - 30);
    }
    break;
  case "comedia":
    total = 30000;
    if (apre.audiencia > 20) {
      total += 10000 + 500 * (apre.audiencia - 20);
    }
    total += 300 * apre.audiencia;
    break;
  default:
      throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
  }
  return total;
}

function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") 
    creditos += Math.floor(apre.audiencia / 5);
  return creditos;   
}

function calcularTotalFatura(pecas, apresentacoes){
  let total = 0
  for (let apre of apresentacoes) {
    total += calcularTotalApresentacao(pecas, apre)
  }
  return total
}

function calcularTotalCreditos(pecas, apresentacoes){
  let total = 0
  for (let apre of apresentacoes) {
    total += calcularCredito(pecas, apre)
  }
  return total
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}


function gerarFaturaStr (fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
  let string = `<html>\n`
  string += `<p> Fatura UFMG </p>\n`
  string += `<ul>\n`
  for (let apre of fatura.apresentacoes) {
    string += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>\n`;
  } 
  string += `</ul>\n`
  string += `<p> Valor total: `+ formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes)) + ` </p>\n`
  string += `<p> Créditos acumulados: `+ calcularTotalCreditos(pecas, fatura.apresentacoes) + ` </p>\n`
  string += `</html>\n`
  return string
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaStr);
console.log(faturaHTML);
