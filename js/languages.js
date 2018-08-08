network_name = "Rospten";

var translator;
var dict = {
  "Ultimo Precio": {
    es: "Ultimo Precio",
    en: "Last Price"
  },
  "24h precio": {
    es: "24h precio",
    en: "24h price"
  },
  "24h volumen":{
  	es:"24h volumen",
  	en:"24h volume"
  },
  "24h alto precio": {
    es: "24h alto precio",
    en: "24h high price"
  },
  "24h bajo precio": {
    es: "24h bajo precio",
    en: "24h low price"
  },
  "Limit": {
    es: "Límite",
    en: "Limit"
  },
  "Market": {
    es: "Mercado",
    en: "Market"
  },
  "ETH volume": {
    es: "ETH volumen",
    en: "ETH volume"
  },
  "AYUDA": {
    es: "AYUDA",
    en: "HELP"
  },
  "Language": {
    es: "Idioma",
    en: "Language"
  },
  "English": {
    es: "Ingles",
    en: "English"
  },
  "Spanish": {
    es: "Español",
    en: "Spanish"
  },
  "TICKERS": {
    es: "TICKERS",
    en: "TICKERS"
  },
  "Simbolo": {
    es: "Simbolo",
    en: "Symbol"
  },
  "INTERCAMBIO": {
    es: "INTERCAMBIO",
    en: "EXCHANGE"
  },
  "COMPRAR": {
    es: "COMPRAR",
    en: "BUY"
  },
  "VENDER": {
    es: "VENDER",
    en: "SELL"
  },
  "Precio": {
    es: "Precio",
    en: "Price"
  },
  "Cantidad": {
    es: "Cantidad",
    en: "Quantity"
  },
    "fee": {
    es: "Cuota",
    en: "Fee"
  },
    "BALANCES": {
    es: "SALDOS",
    en: "BALANCES"
  },
    "Balance": {
    es: "Saldo",
    en: "Balance"
  },
    "COMPRARSimbolos": {
    es: "Simbolos",
    en: "Symbols"
  },
    "Depositar": {
    es: "Depositar",
    en: "Deposit"
  },
    "Retirar": {
    es: "Retirar",
    en: "Withdraw"
  },
    "HISTORIAL DE PRECIOS": {
    es: "HISTORIAL DE PRECIOS",
    en: "Price History"
  },
    "PEDIDOS": {
    es: "PEDIDOS",
    en: "ORDERS"
  },
    "Mi Historial": {
    es: "Mi Historial",
    en: "My History"
  },
    "PAR": {
    es: "PAR",
    en: "PAIR"
  },
    "TIPO": {
    es: "TIPO",
    en: "TYPE"
  },
    "CANTIDAD": {
    es: "CANTIDAD",
    en: "QUANTITY"
  },
    "PRECIO": {
    es: "PRECIO",
    en: "PRICE"
  },
    "Cantidad": {
    es: "Cantidad",
    en: "Amount"
  },
    "Fecha": {
    es: "Fecha",
    en: "Date"
  },
    "Cerrar": {
    es: "Cerrar",
    en: "Close"
  },
    "LIBRO DE ORDENES": {
    es: "LIBRO DE ORDENES",
    en: "ORDER BOOK"
  },
    "Ordenes de Compra": {
    es: "Ordenes de Compra",
    en: "Buy Orders"
  },
    "Ordenes de Venta": {
    es: "Ordenes de Venta",
    en: "Sell Orders"
  },
    "Permitido": {
    es: "Permitido",
    en: "Allowed"
  },
    "Cargando": {
    es: "Cargando",
    en: "Loading"
  },
    "Esperando....": {
    es: "Esperando....",
    en: "Waiting...."
  },
    "Importante!": {
    es: "Importante!",
    en: "Important!"
  },
    "Por favor, selecciona Rospten como tu red en metamask!": {
    es: "Por favor, selecciona Rospten como tu red en metamask!",
    en: "Please select Ropsten as your network in metamask!"
  }
}
$(document).ready(function(){
	translator = $('body').translate({lang: "en", t: dict}); 
	$("#link_ayuda").attr('href','help_english.html');
	$("#net_modal").modal('show');
})
// initialize the plugin and translate the entire page body
//use English
function setLanguage(lang){
	if (lang == 'en') {
		$("#link_ayuda").attr('href','help_english.html');
	}else{
		$("#link_ayuda").attr('href','help.html');
	}
	translator.lang(lang);
}


