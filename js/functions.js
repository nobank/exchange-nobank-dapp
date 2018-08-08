var cf = 10;/*to float javascript issue*/
var redTx;
var graficoJs;
	Highcharts.setOptions({
	    global: {
	        useUTC: false
	    }
	});	
// function isAuthenticated(){
// 	$.ajax({
// 		url:'/isAuthenticated',
// 		success:function(r){
// 			console.log(r);
// 		}
// 	})
// }
function crearInputs(){
	$("#buy_price,#buy_amount,#buy_total,#buy_fee,#sell_price,#sell_amount,#sell_total,#sell_fee").val(0);
}
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
// Create the chart
function createChart(){
		setTimeout(function(){
			window.CurrentTokenOne.symbol(function(er,symbolOne){
				window.CurrentTokenTwo.symbol(function(err,symbolTwo){
					graficoJs = Highcharts.stockChart('chartdiv2', {

					    chart: {
					    	backgroundColor:'white',
					        events: {
					            load: function () {

					                // set up the updating of the chart each second
					                var series = this.series[0];
					                // console.log('series',series)
					                setInterval(function () {
					                    var x = (new Date()).getTime(), // current time
					                        y = Math.round(Math.random() * 100);
					                    // series.addPoint([x, y], true, true);
					                }, 1000);
					            }
					        }
					    },

					    rangeSelector: {
					        buttons: [{ 
					            count: 1,
					            type: 'minute',
					            text: '1M'
					        }, {
					            count: 5,
					            type: 'minute',
					            text: '5M'
					        }, {
					            type: 'all',
					            text: 'All'
					        }],
					        inputEnabled: false,
					        selected: 0
					    },

					    title: {
					        text: '<span style="color:white">'+symbolOne+' Price in '+symbolTwo+'</span>',
					    },

					    exporting: {
					        enabled: false
					    },

					    series: [{
					        name: symbolOne+' price',
					        data: [0,0]
					    }]
					});	
					tradeEventArray.forEach(function(value,index,array){
						web3.eth.getBlock(value.blockNumber,function(e,r){
							if (value.args.tokenGet.toUpperCase() == window.CurrentTokenTwo.address.toUpperCase() && value.args.tokenGive.toUpperCase() == window.CurrentTokenOne.address.toUpperCase() ||
								 value.args.tokenGet.toUpperCase() == window.CurrentTokenOne.address.toUpperCase() && value.args.tokenGive.toUpperCase() == window.CurrentTokenTwo.address.toUpperCase()) {
								if (value.args.tokenGet.toUpperCase() == window.CurrentTokenTwo.address.toUpperCase()) {
									
									point = (value.args.amountGet.toNumber()/Math.pow(10,window.CurrentTokenTwo.decimals)) / (value.args.amountGive.toNumber()/Math.pow(10,window.CurrentTokenOne.decimals));
									point = Number(point).toFixed(8).replace(/\.?0+$/,"")
									graficoJs.series[0].addPoint([r.timestamp*1000, parseFloat(point)], true, graficoJs.series[0].data.length > 20)
									$(".last_price").text(point+" ETH");
								}
								if (value.args.tokenGet.toUpperCase() == window.CurrentTokenOne.address.toUpperCase()) {
									point = (value.args.amountGive.toNumber()/Math.pow(10,window.CurrentTokenTwo.decimals)) / (value.args.amountGet.toNumber()/Math.pow(10,window.CurrentTokenOne.decimals));
									graficoJs.series[0].addPoint([r.timestamp*1000, (value.args.amountGive.toNumber()/Math.pow(10,window.CurrentTokenTwo.decimals)) / (value.args.amountGet.toNumber()/Math.pow(10,window.CurrentTokenOne.decimals))], true, graficoJs.series[0].data.length > 20)
									$(".last_price").text(point+" ETH");
								}
							}
						})
					})	
				})
			})


			my_history();
			$(".highcharts-button").eq(2).click()
		},2000)		


}

var chartData = [];
var auxMyHistory = [];
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var networkArray = {
	1 :'Mainet',
	2 :'Ropsten',
	42 :'kovan',
	4 :'Rinkeby'
}
var array_to_sell = new Array();
var array_to_buy = new Array();
function getExchangeAddress(){
	return $.ajax({
		url:'./ExchAddress.json',
		async:false
	}).responseJSON
}

function getTokens(){

	return $.ajax({
		url:'./tokens.json',
		async:false,
		dataType:'json',
	}).responseJSON
}
function getTo2fa(){
	return $.ajax({
		url:'./2fa',
		async:false
	}).responseJSON	
}
var dateMyHistory;
function my_history(){
	// $("#my_history_body").html("");
	// // auxMyHistory = new Array();
	// // auxMyHistory.forEach(function(v){
	// var html = '';
	// async.each(auxMyHistory,function(v, callback){
	// 	// v = auxMyHistory[i];
	// 	if (v.args.get.toUpperCase() == web3.eth.accounts[0].toUpperCase() || web3.eth.accounts[0].toUpperCase() == v.args.give.toUpperCase()) {
	// 		//buying
	// 		if (v.args.give.toUpperCase() == web3.eth.accounts[0].toUpperCase()) {
	// 			clase=" style='color:green;text-align:center;' ";			
	// 		}else{
	// 		//selling
	// 			clase=" style='color:red;text-align:center;' ";
	// 		}
	// 		// web3.eth.getBlock(v.blockNumber,function(e,r){
	// 			// time = r.timestamp;
	// 			// var date1 = new Date(time*1000);
	// 			// dateMyHistory = date1.toUTCString();
	// 			// console.log('cantidad:',i);
	// 			html = ("<tr title='"+v.transactionHash+"'><td "+clase+">"+(v.args.amountGet.toNumber() / Math.pow(10, window.CurrentTokenTwo.decimals))+"</td><td style='color:white;text-align:center;'>"+(v.args.amountGive.toNumber() / Math.pow(10, window.CurrentTokenOne.decimals))+"</td><td style='text-align:center'><a href='"+redTx+v.transactionHash+"' target='_blank'>Tx</a></td></tr>");
	// 			$("#my_history_body").append(html);
	// 			callback();

	// 		// })
			
	// 	}		

	// },function(html){
		
	// })


}
function getBalance(){
	// console.log('web3.eth.accounts[0]',web3.eth.accounts[0])
	
	window.Exchange.balanceOf(window.CurrentTokenTwo.address,web3.eth.accounts[0],{ from:web3.eth.accounts[0]},function(err,result){
		// console.log('result',result)
	    if(!err) {
	    	window.balance = web3.fromWei(result);

	    	if (window.CurrentTokenTwo.address == 0) {
		    	window.CurrentTokenTwo.symbol(function(e,r){
			        $("#ethBalance").text(window.balance+" "+r);
			        $("#eth_bal_buy").text(window.balance+" "+r);	    		
		    	})	    		
	    	}else{
	    		console.log('Balance que viene',result)
	    		console.log('Balance que viene',window.balance)

		    	window.CurrentTokenTwo.symbol(function(e,r){
		    		
			        $("#ethBalance").text((result.toNumber()/Math.pow(10, window.CurrentTokenTwo.decimals))+" "+r);
			        // console.log(result.toNumber()+" "+r);
			        $("#eth_bal_buy").text((result.toNumber()/Math.pow(10, window.CurrentTokenTwo.decimals))+" "+r);	 

		    	})		    		
	    	}


	      }
	    else
	        showModal("ERROR:",err);
    });
	window.Exchange.balanceOf(window.CurrentTokenOne.address,web3.eth.defaultAccount,{ from:web3.eth.accounts[0]},function(err,result){
	    if(!err) {
	    	if (typeof window.CurrentTokenOne.decimals == 'function') {
		    	window.CurrentTokenOne.decimals(function(e,r){
		    		window.CurrentTokenOne.decimals = r.toNumber();
		    	})	    		
	    	}
			window.CurrentTokenOne.symbol(function(e,r){
				
		            $("#CurrentTokenOne_balance").text((result.toNumber()/Math.pow(10, window.CurrentTokenOne.decimals))+" "+r);
		            
		            $("#tokenOne_bal_sell").text((result.toNumber()/Math.pow(10, window.CurrentTokenOne.decimals))+" "+r);		    				

			
			})
	      }
	    else
	        showModal("ERROR:",err);
    });
}

///////////////////////////////////////////////////////////////////////////////
function init(){
	/*variables to take the control*/
	if (typeof web3 !== 'undefined') {
	  web3 = new Web3(web3.currentProvider);
		  	
	}
	
	window.exchange = getExchangeAddress();
	$("title").text(window.exchange.titlePage+ " v " +window.exchange.version)
	window.tokens = getTokens();

	$("#balance_symbols_body").append('	<tr class=\'active symbols\'>\
											<td >ETH</td>\
											<td id="ethBalance" style="text-align:right"></td>\
										</tr>');

	$.each(window.tokens.tokens,function(i,v){
		// console.log(i,v)
		html = '<tr style="background-color:white">\
		<th class="text-center" address="'+v.symbol+'"><span>'+v.symbol+'</span></th>\
		<th class="text-center" address="'+v.symbol+'"><span class=\'last_price_'+v.symbol+'\'>0</span></th>\
		<th class="text-center" address="'+v.symbol+'"><span class=\'last_price_24_'+v.symbol+'\'>0</span></th>\
		<th class="text-center" address="'+v.symbol+'"><span class=\'last_price_volumen_'+v.symbol+'\'>0</span></th>\
		</tr>';
		$("#tickers_list").append(html)

		symbol_to_balances = '<tr class=\'symbols\'>\
											<td >'+v.symbol+'</td>\
											<td id="'+v.symbol+'_symbol" style="text-align:right"></td>\
										</tr>'
		$("#balance_symbols_body").append(symbol_to_balances)
	})

	//dropdown in top
	$("#pairsAviable").html("");
	$.each(window.tokens.pairs,function(i,v){
		if (i==0) {
			dropdown_pair = '<li id="'+v.idtoken+'" value="'+v.value+'" class="selected"><a value="'+v.value+'" class="selectable_pair">'+v.text+'</a></li>';
			$("#selected").text(v.text)
		}else{
			dropdown_pair = '<li id="'+v.idtoken+'" value="'+v.value+'"><a value="'+v.value+'" class="selectable_pair">'+v.text+'</a></li>';
		}
		$("#pairsAviable").append(dropdown_pair);
	})
	$("#pair").html("");
	pair_quantity = window.tokens.pairs.length;
	cols = Math.ceil(12 / pair_quantity);
	window.tokens.pairs.forEach(function(value,index,array){
		tokenImg = "";
		window.tokens.tokens.forEach(function(v,i,ar){
			if (v.symbol == value.value.toUpperCase()) {
				if (v.img) {
					tokenImg = v.img;
				}
				
			}
		})
		if (tokenImg == "") {
			tokenImg = './images/token.webp';
		}
		// console.log('tokenImg',tokenImg)
		if (index == 0) {
			html = '<div class="col-md-'+cols+' token_div pair_selected" value="'+value.value+'">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
              '<div class="pair_img"><img width="50px" src="'+tokenImg+'" alt=""></div>'+
            '</div>'+
            '<div class="col-md-4">'+
              '<div class="pair_symbol">'+value.text+'</div>'+
              '<div class="pair_price">price:</div>'+
              '<div class="pair_volume">volume:</div>'+
              '<div class="pair_change">Change:</div>'+
            '</div>'+
            '<div class="col-md-4">'+
              '<div class="pair_symbol"><br></div>'+
              '<div class="pair_price">0.00048</div>'+
              '<div class="pair_volume">1.498</div>'+
              '<div class="pair_change">0.065156 %</div>'+
            '</div>'+
          '</div>'+
        '</div>';
		}else{
			html = '<div class="col-md-'+cols+' token_div" value="'+value.value+'">'+
          '<div class="row">'+
            '<div class="col-md-4">'+
              '<div class="pair_img"><img width="50px" src="'+tokenImg+'" alt=""></div>'+
            '</div>'+
            '<div class="col-md-4">'+
              '<div class="pair_symbol">'+value.text+'</div>'+
              '<div class="pair_price">price:</div>'+
              '<div class="pair_volume">volume:</div>'+
              '<div class="pair_change">Change:</div>'+
            '</div>'+
            '<div class="col-md-4">'+
              '<div class="pair_symbol"><br></div>'+
              '<div class="pair_price">0.00048</div>'+
              '<div class="pair_volume">1.498</div>'+
              '<div class="pair_change">0.065156 %</div>'+
            '</div>'+
          '</div>'+
        '</div>';			
		}

		$("#pair").append(html)
		
	});

	window.orders = []; //orders backup to reload when pair is changed

	window.CurrentTokenOne = web3.eth.contract(window.tokens.tokens[0].abi).at(window.tokens.tokens[0].address);
	window.CurrentTokenTwo = {};
	window.CurrentTokenTwo.address = "0x0000000000000000000000000000000000000000";
	window.CurrentTokenTwo.decimals = 18;
	window.CurrentTokenTwo.symbol = function(cb){
		cb(null,"ETH");
	}

	$(".currentTokenOne").text(window.tokens.tokens[0].symbol);
	$(".currentTokenTwo").text("ETH");


	window.Exchange = web3.eth.contract(exchange.exchangeAbi).at(exchange.exchangeAddress);
	// window.exchange2faContract = web3.eth.contract(window.exchange2fa.abi).at(window.exchange2fa.address);
	window.networkVersion = web3.version.network;

	
	web3.version.getNetwork(function(err, netId){
	  switch (netId) {
	    case "1":
	     redTx = "https://etherscan.io/tx/";
	      console.log('This is mainnet')
	      break
	    case "2":
	      console.log('This is the deprecated Morden test network.')
	      break
	    case "3":
	     redTx = "https://ropsten.etherscan.io/tx/";
	      console.log('This is the ropsten test network.')
	      break
	    case "4":
	     redTx = "https://rinkeby.etherscan.io/tx/";
	      console.log('This is the Rinkeby test network.')
	      break
	    case "42":
	    	 redTx = "https://kovan.etherscan.io/tx/";
	      console.log('This is the Kovan test network.')
	      break
	    default:
	      console.log('This is an unknown network.')
	  }
	})
	


	$("#buy_price,#buy_amount,#buy_fee,#buy_total,#sell_price, #sell_amount,#sell_fee,#sell_total,#deposit_eth,#deposit_tokenOne,#amount_tokenOne,#total_tokenOne").val(0)
	web3.eth.getAccounts(function(err, accounts){
		// console.log("getAccounts",err,accounts);
	    if (err != null) {
	    	console.error("An error occurred: "+err);
	    }
	    else if (accounts.length == 0) {
	    	// showModal('Warning',"User is not logged in to MetaMask, Please TURN MetaMask ON!")
	    }
	    else {
	    	web3.eth.defaultAccount = accounts[0];
	    	if (web3.version.network != 1 && window.verified) {
	    		console.log('Network:',web3.version.network);
	    		if (typeof networkArray[web3.version.network] != 'undefined') {
	    			// showModal("New Message","User is logged in to MetaMask with <span class='bg-warning'>"+networkArray[web3.version.network]+"</span> network");
	    			console.log("New Message","User is logged in to MetaMask with <span class='bg-warning'>"+networkArray[web3.version.network]+"</span> network");
	    		}else{
	    			showModal("New Message","User is logged in to MetaMask with <span >localhost:8585</span> network");
	    		}

	    	}
	    }
	});
	window.Exchange.accountLevelsAddr(function(err,result){
		// console.log('Account level address:',err,result);
	})
	window.CurrentTokenOne.decimals(function(error,result){
		if (!error) {
			window.CurrentTokenOne.decimals = result.toNumber();
		}else{
			console.log('tokenOne decimals:',error);
		}
		
	})
	window.coinbase = web3.eth.coinbase;
	
	initEvents();

	setTimeout(function(){
		createChart(); 
		getBalance();

	},5000)		


	$("#look_book_orders").click();
	
}
$(document).ready(function(){
	setTimeout(function(){
		$.each(window.tokens.tokens,function(iterate,value){
			$.each(window.depositEventArray,function(i,v){
				deposit = window.depositEventArray[i].args;
				if (deposit.token == '0x0000000000000000000000000000000000000000') {
					amount = deposit.amount / Math.pow(10,18);
					lastAmount = parseFloat($("#ether_volume").text());
					$("#ether_volume").text(Number(lastAmount+amount).toFixed(8).replace(/\.?0+$/,""))
				}
				if (value.address.toUpperCase() == deposit.token.toUpperCase()) {
					amount = deposit.amount / Math.pow(10,value.decimals);
					lastAmount = parseFloat($(".last_price_volumen_"+value.symbol).text());
					$(".last_price_volumen_"+value.symbol).text(Number(lastAmount+amount).toFixed(8).replace(/\.?0+$/,""))
				}
			})			
		})
		$.each(window.tokens.tokens,function(iterate,value){
			$.each(window.withdrawEventArray,function(i,v){
				withdraw = window.withdrawEventArray[i].args;
				if (withdraw.token == '0x0000000000000000000000000000000000000000') {
					amount = withdraw.amount / Math.pow(10,18);
					lastAmount = parseFloat($("#ether_volume").text());
					$("#ether_volume").text(Number(lastAmount-amount).toFixed(8).replace(/\.?0+$/,""))
				}
				if (value.address.toUpperCase() == withdraw.token.toUpperCase()) {
					amount = withdraw.amount / Math.pow(10,value.decimals);
					lastAmount = parseFloat($(".last_price_volumen_"+value.symbol).text());
					$(".last_price_volumen_"+value.symbol).text(Number(lastAmount-amount).toFixed(8).replace(/\.?0+$/,""))
				}
			})			
		})

		// sortByKey(myOrders,'date');
		// $.each(myOrders,function(iterator,value){
			
		// })
		// console.log('arranca')
	},4000)
})

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function getTimeTransaction(tx,cb){
	web3.eth.getTransaction(tx,function(e,r){
		// console.log()
		return web3.eth.getBlock(r.blockNumber,function(e,r){
			cb(e,r.timestamp);
		});
	})
	
}

function EventedArray(handler) {
	
   this.stack = [];
   this.mutationHandler = handler || function() {};
   this.setHandler = function(f) {
      this.mutationHandler = f;
   };
   this.callHandler = function() { 
      if(typeof this.mutationHandler === 'function') {
         this.mutationHandler();
      }
   };
   this.printAgain = function(){
   	$("#my_history_body").html("");
   	var este = this;
   	$.each(this.stack,function(iterator,value){
   		este.pushHandler(este.stack,value)
   	})
   };
   this.pushHandler = function(array,value){
   	var cf = Math.pow(10,window.CurrentTokenTwo.decimals);
   	// console.log('se inserto algo nuevo');
   	// htmlTrs = '';
   	// $("#my_history_body").html(htmlTrs);
   	// $.each(this.stack,function(iterator,value){

   		var order = value.order.args;
   		if (window.CurrentTokenOne.address.toUpperCase() != order.tokenGet.toUpperCase() && window.CurrentTokenOne.address.toUpperCase() != order.tokenGive.toUpperCase()) {
   			// console.log('---');
   			return;
   		}
   		


   		if (value.type == 'order') {

			window.Exchange.amountFilled(order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, order.expires, order.nonce, order.user,function(e,r){
			
	   			if(order.tokenGet.toUpperCase() == '0X0000000000000000000000000000000000000000'){
					//sell
					num = order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals);
					den = order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals);
					price = Math.round(num * cf) / Math.round(den * cf);
					price = Number(price).toFixed(8).replace(/\.?0+$/,"")
					
					amount = order.amountGive.toNumber()/1e18;
					amount = Number(amount).toFixed(8).replace(/\.?0+$/,"")
					t = $(".table-sortable").DataTable().row.add([price, amount, (moment(value.date).format('LLL')), "<a href='"+redTx+value.order.transactionHash+"' target='_blank' style='color:black'><b>Tx</b></a>"]).draw().node();
	   				// console.log(t)
	   				$( t ) .css( 'background', '#A53237' )
	   				// htmlTrs = "<tr class='history_orders' style='background-color:#E78484;color:black'><td>"+price+"</td><td>"+amount+"</td><td>"+(moment(value.date).format('LLL'))+"</td><td><a href='"+redTx+value.order.transactionHash+"' target='_blank'><b>Tx</b></a></td></tr>";
	   				// $("#my_history_body").prepend(htmlTrs);
	   				// orderTable("my_history_body");

	   				// console.log('htmlTrs',htmlTrs)
	   			}else{
					//buy
					num = order.amountGive/Math.pow(10,window.CurrentTokenTwo.decimals);
					den = order.amountGet/Math.pow(10,window.CurrentTokenOne.decimals);
					price = Math.round(num * cf) / Math.round(den * cf);
					price = Number(price).toFixed(8).replace(/\.?0+$/,"")

					amount = (order.amountGet.toNumber()-r.toNumber())/1e18;
					amount = Number(amount).toFixed(8).replace(/\.?0+$/,"")
					t = $(".table-sortable").DataTable().row.add([price,amount,(moment(value.date).format('LLL')),"<a href='"+redTx+value.order.transactionHash+"' target='_blank' style='color:black'><b>Tx</b></a>"]).draw().node();
					// console.log(t)
					$( t ) .css( 'background', '#4D862F' )
					// htmlTrs = "<tr class='history_orders' style='background-color:#487B30;color:black'><td>"+price+"</td><td>"+amount+"</td><td>"+(moment(value.date).format('LLL'))+"</td><td><a href='"+redTx+value.order.transactionHash+"' target='_blank'><b>Tx</b></a></td></tr>";
	   				// $("#my_history_body").prepend(htmlTrs);
	   				// orderTable();

	   				// console.log('htmlTrs',htmlTrs)
	   			}
	   			
	   		})
   		}
   		if (value.type == 'trade') {
   			
	   			if(order.tokenGet.toUpperCase() == '0X0000000000000000000000000000000000000000'){
					//sell
					num = order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals);
					den = order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals);
					price = Math.round(num * cf) / Math.round(den * cf);
					price = Number(price).toFixed(8).replace(/\.?0+$/,"")
					
					amount = order.amountGive.toNumber()/1e18;
					amount = Number(amount).toFixed(8).replace(/\.?0+$/,"")
					t = $(".table-sortable").DataTable().row.add([price, amount, (moment(value.date).format('LLL')), "<a href='"+redTx+value.order.transactionHash+"' target='_blank' style='color:black'><b>Tx</b></a>"]).draw().node();
	   				// console.log(t)
	   				$( t ) .css( 'background', '#4D862F' )
	   				// htmlTrs = "<tr class='history_orders' style='background-color:#E78484;color:black'><td>"+price+"</td><td>"+amount+"</td><td>"+(moment(value.date).format('LLL'))+"</td><td><a href='"+redTx+value.order.transactionHash+"' target='_blank'><b>Tx</b></a></td></tr>";
	   				// $("#my_history_body").prepend(htmlTrs);
	   				// orderTable("my_history_body");

	   				// console.log('htmlTrs',htmlTrs)
	   			}else{
					//buy
					num = order.amountGive/Math.pow(10,window.CurrentTokenTwo.decimals);
					den = order.amountGet/Math.pow(10,window.CurrentTokenOne.decimals);
					price = Math.round(num * cf) / Math.round(den * cf);
					price = Number(price).toFixed(8).replace(/\.?0+$/,"")

					amount = order.amountGet.toNumber()/1e18;
					amount = Number(amount).toFixed(8).replace(/\.?0+$/,"")
					t = $(".table-sortable").DataTable().row.add([price,amount,(moment(value.date).format('LLL')),"<a href='"+redTx+value.order.transactionHash+"' target='_blank' style='color:black'><b>Tx</b></a>"]).draw().node();
					// console.log(t)
					$( t ) .css( 'background', '#A53237' )
					// htmlTrs = "<tr class='history_orders' style='background-color:#487B30;color:black'><td>"+price+"</td><td>"+amount+"</td><td>"+(moment(value.date).format('LLL'))+"</td><td><a href='"+redTx+value.order.transactionHash+"' target='_blank'><b>Tx</b></a></td></tr>";
	   				// $("#my_history_body").prepend(htmlTrs);
	   				// orderTable();

	   				// console.log('htmlTrs',htmlTrs)
	   			}
   		}
   		
   	// })
   	
   	
   }
   this.popHandler = function(){
   	console.log('se borro algo');
   }
   this.push = function(obj) {
      this.stack.push(obj);
      this.sortByKey(this.stack,'date');
      this.pushHandler(this.stack,obj);
   };
	this.sortByKey = function(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
   this.pop = function() {
      this.popHandler();
      return this.stack.pop();
   };
   this.getArray = function() {
      return this.stack;
   }
}

var handler = function() {
   console.log('something changed');
};
var myOrders = new EventedArray(handler);
//or 
var myOrders = new EventedArray();

var table = $('.table-sortable').DataTable( {
    "order": [[ 2, "desc" ]],
    "searching": false,
    "paging":false,
    "info": false
} );

function initEvents(){
	var orderEvent = window.Exchange.Order({},{fromBlock: 0, toBlock: 'latest'});
	var cancelEvent = window.Exchange.Cancel({},{fromBlock: 0, toBlock: 'latest'});
	var depositEvent = window.Exchange.Deposit({},{fromBlock: 0, toBlock: 'latest'});
	var tradeEvent = window.Exchange.Trade({},{fromBlock: 0, toBlock: 'latest'});
	var withdrawEvent = window.Exchange.Withdraw({},{fromBlock: 0, toBlock: 'latest'});
	// var graficoEvent = window.Exchange.Grafico({},{fromBlock: 0, toBlock: 'latest'});
	window.ordersBuy = [];
	window.ordersSell = [];
	window.ordersCancel = [];
	window.depositEventArray = [];
	window.withdrawEventArray = [];
	window.tradeEventArray = [];
	window.amountBuyFilledArray = [];
	window.amountSellFilledArray = [];
	withdrawEvent.watch(function(error, result){
    	// console.log('Event '+result.event,result);
    	if (result) {
    		getBalance();
    		withdrawEventArray.push(result);
    	}
    })

	tradeEvent.watch(function(error, result){

	    	if (result) {
	    		// console.log('TRADE',result);
	    		var trade = result.args;

	    		getTimeTransaction(result.transactionHash,function(e,timeStamp){

	    			// console.log('TIME:',new Date(timeStamp*1000),timeStamp)
	    			today = new Date().getTime();
	    			tradeDate = new Date(timeStamp*1000).getTime();

	    			if (web3.eth.defaultAccount.toUpperCase() == trade.get.toUpperCase() || web3.eth.defaultAccount.toUpperCase() == trade.give.toUpperCase()) {
	    				myOrders.push({
	    					date:tradeDate,
	    					type:'trade',
	    					order:result
	    				})
	    			}

	    			var hours = Math.abs(today - tradeDate) / 36e5;
	    			// console.log('hours diference:',hours);
	    			$.each(window.tokens.tokens,function(i,v){

		    			if (v.address.toUpperCase() == trade.tokenGive.toUpperCase()) {
							point = (trade.amountGet.toNumber()/Math.pow(10,window.CurrentTokenTwo.decimals)) / (trade.amountGive.toNumber()/Math.pow(10,window.tokens.tokens[i].decimals));
							point = Number(point).toFixed(8).replace(/\.?0+$/,"")
							// console.log('point',point)
							if (window.tokens.tokens[i].last_price > parseFloat(point)) {
								$("#arrow_last_price").addClass('text-danger')
								$("#arrow_last_price").removeClass('text-success')
								$("#arrow_last_price").find("i").removeClass("fa-caret-up")
								$("#arrow_last_price").find("i").addClass("fa-caret-down")
							}
							if (window.tokens.tokens[i].last_price < parseFloat(point)) {
								$("#arrow_last_price").find("i").removeClass("fa-caret-down")
								$("#arrow_last_price").find("i").addClass("fa-caret-up")
								$("#arrow_last_price").addClass('text-success')
								$("#arrow_last_price").removeClass('text-danger')
							}
							if (window.tokens.tokens[i].last_price == parseFloat(point)) {
								$("#arrow_last_price").find("i").removeClass("fa-caret-down")
								$("#arrow_last_price").find("i").removeClass("fa-caret-up")
								$("#arrow_last_price").removeClass('text-danger')
								$("#arrow_last_price").removeClass('text-success')
							}
		    				window.tokens.tokens[i].last_price = parseFloat(point);
		    				$(".last_price_"+window.tokens.tokens[i].symbol).text(window.tokens.tokens[i].last_price)
		    				$(".last_price").text(window.tokens.tokens[i].last_price)
		    				if (hours <= 24) {
		    					// console.log('point ->',point)
		    					if (window.tokens.tokens[i].last_24_price > parseFloat(point)) {
									$("#arrow_24_price").addClass('text-danger')
									$("#arrow_24_price").removeClass('text-success')
									$("#arrow_24_price").find("i").removeClass("fa-caret-up")
									$("#arrow_24_price").find("i").addClass("fa-caret-down")
		    					}
								if (window.tokens.tokens[i].last_24_price < parseFloat(point)) {
									$("#arrow_24_price").find("i").removeClass("fa-caret-down")
									$("#arrow_24_price").find("i").addClass("fa-caret-up")
									$("#arrow_24_price").addClass('text-success')
									$("#arrow_24_price").removeClass('text-danger')
								}
								if (window.tokens.tokens[i].last_24_price == parseFloat(point)) {
									$("#arrow_24_price").find("i").removeClass("fa-caret-down")
									$("#arrow_24_price").find("i").removeClass("fa-caret-up")
									$("#arrow_24_price").removeClass('text-danger')
									$("#arrow_24_price").removeClass('text-success')
								}
								window.tokens.tokens[i].last_24_price = parseFloat(point);
								// console.log('symbol:',window.tokens.tokens[i].symbol)
								$(".last_price_24_"+window.tokens.tokens[i].symbol).text(window.tokens.tokens[i].last_24_price)
								if (window.tokens.tokens[i].last_big_24_price < parseFloat(point)) {
									
									$(".high_price").text(parseFloat(point))
								}
								window.tokens.tokens[i].last_24_price = parseFloat(point);
								if (parseFloat(point) < window.tokens.tokens[i].last_low_24_price) {
									window.tokens.tokens[i].last_low_24_price = parseFloat(point);
									$(".low_price").text(parseFloat(point))
								}
								
		    					$(".last_24_price").text(window.tokens.tokens[i].last_24_price)
		    				}
		    			}
		    		})
		    		// console.log('TEsting',result.args.get.toUpperCase() , web3.eth.accounts[0].toUpperCase() ,'||', web3.eth.accounts[0].toUpperCase() , result.args.give.toUpperCase())
		    		if (result.args.get.toUpperCase() == web3.eth.accounts[0].toUpperCase() || web3.eth.accounts[0].toUpperCase() == result.args.give.toUpperCase()) {
		    			auxMyHistory.push(result);
		    		}

		    		tradeEventArray.push(result);
					getBalance();
					updateFilled();
					createChart();


	    		})



	    	}
		

    })
    depositEvent.watch(function(error, result){
    	// console.log('deposit event ',result);
    	if (result) {
    		// console.log('deposit:',result)
    		depositEventArray.push(result);
    		if (result.args.user == web3.eth.defaultAccount) {
	    		getBalance();
    		}
    	}
    })
    cancelEvent.watch(function(error, result){
    	// console.log('Event '+result.event,result);
    	order = result.args;

    	window.ordersCancel.push(order);

    	drawOrders();
    	updateFilled();
    })
    orderEvent.watch(function(error, result){

    	// console.log('luego las ordenes')
    	// console.log('orderEvent ',result);
    	//to history

		getTimeTransaction(result.transactionHash,function(e,timeStamp){

			// console.log('TIME:',new Date(timeStamp*1000),timeStamp)
			today = new Date().getTime();
			tradeDate = new Date(timeStamp*1000).getTime();

			if (web3.eth.defaultAccount.toUpperCase() == result.args.user.toUpperCase()) {
				myOrders.push({
					date:tradeDate,
					type:'order',
					order:result
				})
			}
    	})
    	window.orders.push(result);

    	web3.eth.getBlockNumber(function(error, currentBlock){


    		// console.log('blockNumber:',result.blockNumber,'currentBlock:',currentBlock,' <= ',result.blockNumber <= currentBlock-1000);
    		//validating old orders;
    		if (result.blockNumber <= currentBlock-1000) {
    			return;
    		}

	    	var order = result.args;
	    	// console.log('order',order);
	    	/*validating repeated order*/
	    	if (theOrderWasRepeated(window.amountBuyFilledArray,order) || theOrderWasRepeated(window.amountSellFilledArray,order)) {
	    		return;
	    	}


	    	window.orders.push(result);
	    								//address tokenGet, uint amountGet, address tokenGive, uint amountGive, uint expires, uint nonce, address user
	    	window.Exchange.amountFilled(order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, order.expires, order.nonce, order.user,function(e,r){
	    		
	    		id = new Date().getTime();
	    		// console.log('SELL:',window.CurrentTokenOne.address.toUpperCase() , order.tokenGive.toUpperCase() , window.CurrentTokenTwo.address.toUpperCase() , order.tokenGet.toUpperCase())
	    		// console.log('BUY:',window.CurrentTokenTwo.address.toUpperCase() , order.tokenGive.toUpperCase(), window.CurrentTokenOne.address.toUpperCase() , order.tokenGet.toUpperCase())
		    	if(window.CurrentTokenOne.address.toUpperCase() == order.tokenGive.toUpperCase() && window.CurrentTokenTwo.address.toUpperCase() == order.tokenGet.toUpperCase()){
					//sell
					// console.log('entra en sell',order.tokenGet, order.tokenGive)
					cf = 1e10;

					// console.log("amountGet:",order.amountGet.toNumber(),order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals),"amountGive:",order.amountGive.toNumber(),order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals));

					num = order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals);
					den = order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals);
					price = (num * cf/den * cf )/ (cf*cf);
		    		// price = (Math.round(order.amountGet * cf) / (Math.pow(10,window.CurrentTokenTwo.decimals) * cf )) / (Math.round(order.amountGive * cf) / (Math.pow(10,window.CurrentTokenOne.decimals) * cf));
	    			amountSellFilledArray.push({
	    				vol:0,
		    			bk:order,
		    			amountFilled:r.toNumber()/order.amountGet.toNumber()*order.amountGive.toNumber(),
		    			amount:order.amountGive.toNumber(),
		    			ask:price,
		    			ready:(r.toNumber()/order.amountGet.toNumber()*order.amountGive.toNumber()) >= order.amountGive.toNumber(),
		    			user:order.user,
		    			id:id,
		    			blockNumber:result.blockNumber
		    		});
		    	}else if(window.CurrentTokenTwo.address.toUpperCase() == order.tokenGive.toUpperCase() && window.CurrentTokenOne.address.toUpperCase() == order.tokenGet.toUpperCase()){
	  				//buying
	  				// console.log('entra en buy',order.tokenGet, order.tokenGive)
	  				cf = Math.pow(10,window.CurrentTokenTwo.decimals);

					num = order.amountGive/Math.pow(10,window.CurrentTokenTwo.decimals);
					den = order.amountGet/Math.pow(10,window.CurrentTokenOne.decimals);
					price = Math.round(num * cf) / Math.round(den * cf);

		    		// price = (Math.round(order.amountGive * cf) / (Math.pow(10,window.CurrentTokenTwo.decimals) * cf)) / (Math.round(order.amountGet * cf) / (Math.pow(10,window.CurrentTokenOne.decimals) * cf));
		    			 
	    			amountBuyFilledArray.push({
	    				vol:0,
		    			bk:order,
		    			amountFilled:r.toNumber(),//amount filled
		    			amount:order.amountGet.toNumber()-r.toNumber(),//amount wanted
		    			ready:r.toNumber() >= order.amountGet.toNumber(),//filled?
		    			bid:price,
		    			user:order.user,
		    			id:id,
		    			blockNumber:result.blockNumber
		    		})
		    	}

		    	high = 0;
		    	for (var i = 1; i < window.amountSellFilledArray.length; i++) {
		    		if (window.amountSellFilledArray[i].ask > high) {
		    			high = window.amountSellFilledArray[i].ask;
		    			$('.high_price').html(high+"<span>ETH</span>");
		    		}
		    	}
		    	for (var i = 1; i < window.amountBuyFilledArray.length; i++) {
		    		if (window.amountBuyFilledArray[i].bid > high) {
		    			high = window.amountBuyFilledArray[i].bid;
		    			$('.high_price').html(high+"<span>ETH</span>");
		    		}
		    	}
		    	if (window.amountSellFilledArray[0]) {
			     	low = window.amountSellFilledArray[0].ask;
			    	for (var i = 1; i < window.amountSellFilledArray.length; i++) {
			    		if (window.amountSellFilledArray[i].ask < low) {
			    			low = window.amountSellFilledArray[i].ask;
			    			$('.low_price').html(low+"<span>ETH</span>");
			    		}
			    	}
			    	for (var i = 1; i < window.amountBuyFilledArray.length; i++) {
			    		if (window.amountBuyFilledArray[i].bid < low) {
			    			low = window.amountBuyFilledArray[i].bid;
			    			$('.low_price').html(low+"<span>ETH</span>");
			    		}
			    	}   		
		    	}

		        drawOrders()

	    	})
	 

	 
	    });
    });
    
}
function reloadPairOrders(){
	/*restarting*/
	window.amountBuyFilledArray = [];
	window.amountSellFilledArray = [];
	var cf = Math.pow(10,window.CurrentTokenTwo.decimals);
	window.orders.forEach(function(value,index,array){
		var order = value.args;
		// console.log("order:",order)
		web3.eth.getBlockNumber(function(error, currentBlock){
			if (value.blockNumber <= currentBlock-1000) {
    			//do nothing
    		}else{
		    	window.Exchange.amountFilled(order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, order.expires, order.nonce, order.user,function(e,r){
		    		id = new Date().getTime();
		    		
		    		// console.log('SELL:',window.CurrentTokenOne.address.toUpperCase() , order.tokenGive.toUpperCase() , window.CurrentTokenTwo.address.toUpperCase() , order.tokenGet.toUpperCase())
	    			// console.log('BUY:',window.CurrentTokenTwo.address.toUpperCase() , order.tokenGive.toUpperCase(), window.CurrentTokenOne.address.toUpperCase() , order.tokenGet.toUpperCase())
			    	
			    	if(window.CurrentTokenOne.address.toUpperCase() == order.tokenGive.toUpperCase() && window.CurrentTokenTwo.address.toUpperCase() == order.tokenGet.toUpperCase()){
						//sell
						cf = 1e10;
						console.log('entra en sell',order.tokenGet, order.tokenGive)
			    		// price = (order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals))/(order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals));
						num = order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals);
						den = order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals);
						price = Math.round(num * cf) / Math.round(den * cf) ;

		    			amountSellFilledArray.push({
		    				

		    				vol:0,
			    			bk:order,
			    			amountFilled:r.toNumber()/order.amountGet.toNumber()*order.amountGive.toNumber(),
			    			amount:order.amountGive.toNumber(),
			    			ask:price,
			    			ready:(r.toNumber()/order.amountGet.toNumber()*order.amountGive.toNumber()) >= order.amountGive.toNumber(),
			    			user:order.user,
			    			id:id,
			    			blockNumber:value.blockNumber


			    		});
			    	}else if(window.CurrentTokenTwo.address.toUpperCase() == order.tokenGive.toUpperCase() && window.CurrentTokenOne.address.toUpperCase() == order.tokenGet.toUpperCase()){
		  				//buying
		  				// console.log('entra en buy',order.tokenGet, order.tokenGive)
			    	// 	price = (order.amountGive/Math.pow(10,window.CurrentTokenTwo.decimals))/(order.amountGet/Math.pow(10,window.CurrentTokenOne.decimals));
			    	// 	console.log("price2:",price)

			    		num = (order.amountGive/Math.pow(10,window.CurrentTokenTwo.decimals));
						den = (order.amountGet/Math.pow(10,window.CurrentTokenOne.decimals));
						price = Math.round(num * cf) / Math.round(den * cf);

		    			amountBuyFilledArray.push({
		    				vol:0,
			    			bk:order,
			    			amountFilled:r.toNumber(),//amount filled
			    			amount:order.amountGet.toNumber()-r.toNumber(),//amount wanted
			    			ready:r.toNumber() >= order.amountGet.toNumber(),//filled?
			    			bid:price,
			    			user:order.user,
			    			id:id,
			    			blockNumber:value.blockNumber
			    		})
			    	}

			    	high = 0;
			    	for (var i = 1; i < window.amountSellFilledArray.length; i++) {
			    		if (window.amountSellFilledArray[i].ask > high) {
			    			high = window.amountSellFilledArray[i].ask;
			    			window.CurrentTokenTwo.symbol(function(errorSymbol,symbol){
			    				$('.high_price').html(high+"<span>"+symbol+"</span>");
			    			})
			    		}
			    	}
			    	for (var i = 1; i < window.amountBuyFilledArray.length; i++) {
			    		if (window.amountBuyFilledArray[i].bid > high) {
			    			high = window.amountBuyFilledArray[i].bid;
			    			window.CurrentTokenTwo.symbol(function(errorSymbol,symbol){
			    				$('.high_price').html(high+"<span>"+symbol+"</span>");
			    			})
			    		}
			    	}
			    	if (window.amountSellFilledArray[0]) {
				     	low = window.amountSellFilledArray[0].ask;
				    	for (var i = 1; i < window.amountSellFilledArray.length; i++) {
				    		if (window.amountSellFilledArray[i].ask < low) {
				    			low = window.amountSellFilledArray[i].ask;
				    			window.CurrentTokenTwo.symbol(function(errorSymbol,symbol){
					    			$('.low_price').html(low+"<span>"+symbol+"</span>");
					    		})
				    		}
				    	}
				    	for (var i = 1; i < window.amountBuyFilledArray.length; i++) {
				    		if (window.amountBuyFilledArray[i].bid < low) {
				    			low = window.amountBuyFilledArray[i].bid;
				    			window.CurrentTokenTwo.symbol(function(errorSymbol,symbol){
					    			$('.low_price').html(low+"<span>"+symbol+"</span>");
					    		})
				    		}
				    	}   		
			    	}

			        drawOrders()

		    	});    			
    		}
		
		})

	});
}
function updateFilled(){
	updateSellFilled();
	updateBuyFilled();
}
function updateSellFilled(){
	// console.log('amountSellFilledArray',amountSellFilledArray.length);
	var newSellVol = 0.00;
	window.amountSellFilledArray.forEach(function(item,index){
		var order = item.bk;
		window.Exchange.amountFilled(order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, order.expires, order.nonce, order.user,function(e,r){

			// console.log("amountGive:",order.amountGive.toNumber());
			// console.log("amountGet:",order.amountGet.toNumber());
			// console.log('r:',r.toNumber());
			// console.log('r:',r);

    		price = (order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals))/(order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals));
			if (typeof amountSellFilledArray[index] == 'undefined') {
				return;
			}
			id = amountSellFilledArray[index].id;
			// console.log('typeof $("#"+id)[0] != undefined',typeof $("#"+id)[0] != 'undefined')
			if(typeof $("#"+id)[0] != 'undefined'){

				cf = Math.pow(10,window.CurrentTokenTwo.decimals);

				// console.log("amountGet:",order.amountGet.toNumber(),order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals),"amountGive:",order.amountGive.toNumber(),order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals));

				num = order.amountGet/Math.pow(10,window.CurrentTokenTwo.decimals);
				den = order.amountGive/Math.pow(10,window.CurrentTokenOne.decimals);


				price = Math.round(num * cf) / Math.round(den * cf);

				amountSellFilledArray[index]={
					vol:0,
	    			bk:order,
	    			amountFilled:r.toNumber()/order.amountGet.toNumber()*order.amountGive.toNumber(),
	    			amount:order.amountGive.toNumber(),
	    			ask:price,
	    			ready:(r.toNumber()/order.amountGet.toNumber()*order.amountGive.toNumber()) >= order.amountGive.toNumber(),
	    			user:order.user,
	    			id:id
	    		};

	    		drawOrders();
			}	
		})
	});

}
function updateBuyFilled(){
	var newBuyVol = 0.00;
	window.amountBuyFilledArray.forEach(function(item,index){
		var order = window.amountBuyFilledArray[index].bk;
		if (typeof window.amountBuyFilledArray[index] ==  'undefined') {
			return;
		}
		id = amountBuyFilledArray[index].id;
    	window.Exchange.amountFilled(order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, order.expires, order.nonce, order.user,function(e,r){
    		price = (order.amountGive/Math.pow(10,window.CurrentTokenTwo.decimals))/(order.amountGet/Math.pow(10,window.CurrentTokenOne.decimals));
    		if(typeof $("#"+id)[0] != 'undefined'){
				cf = Math.pow(10,window.CurrentTokenTwo.decimals);

				num = order.amountGive/Math.pow(10,window.CurrentTokenTwo.decimals);
				den = order.amountGet/Math.pow(10,window.CurrentTokenOne.decimals);

				price = Math.round(num * cf) / Math.round(den * cf);
				amountBuyFilledArray[index]={
					vol:0,
	    			bk:order,
	    			amountFilled:r.toNumber(),//amount filled
	    			amount:order.amountGet.toNumber()-r.toNumber(),//amount wanted
	    			ready:r.toNumber() >= order.amountGet.toNumber(),//filled?
	    			bid:price,
	    			user:order.user,
	    			id:id
	    		}
				
	    		drawOrders();

			}
		})				

	})
}
function theOrderWasRepeated(orders,newOrder){
	for (var i = 0; i < orders.length; i++) {
		/*buy orders*/
		if (orders[i].bk.tokenGet == '0x0000000000000000000000000000000000000000') {
			if (orders[i].bk.user == newOrder.user && orders[i].bk.expires.toNumber() == newOrder.expires.toNumber() && orders[i].bk.amountGet.toNumber() == newOrder.amountGet.toNumber()) {
				return true;
				break;
			}
		}else{
			if (orders[i].bk.user == newOrder.user && orders[i].bk.expires.toNumber() == newOrder.expires.toNumber() && orders[i].bk.amountGive.toNumber() == newOrder.amountGive.toNumber()) {
				return true;
				break;
			}
		}
	}
	return false;
}
function isListedOnSell(order){
	listed = false;
	price = (order.amountGet/Math.pow(10,18))/(order.amountGive/Math.pow(10,18));
	for (var i = 0; i < window.ordersSell.length; i++) {
		if (window.ordersSell[i].bid == price.toFixed(8) && window.ordersSell[i].user == order.user && window.ordersSell[i].amount == order.amountGive) {
			listed = true;
		}
	}
	return listed;
}
function isListedOnBuy(order){
	listed = false;
	price = (order.amountGive/Math.pow(10,18))/(order.amountGet/Math.pow(10,10));
	for (var i = 0; i < window.ordersBuy.length; i++) {
		if (window.ordersBuy[i].ask == price.toFixed(8) && window.ordersBuy[i].user == order.user && window.ordersBuy[i].amount == order.amountGet) {
			listed = true;
		}
	}
	return listed;
}
function isCanceled(order){
	cancel_order=false;

	for (var k = 0; k < window.ordersCancel.length; k++) {
		if (window.ordersCancel[k].nonce.toNumber() == order.bk.nonce.toNumber() && order.bk.user == window.ordersCancel[k].user) {
			cancel_order=true;
		}
	}

	return cancel_order;
}
function writeInOrders(){
	window.CurrentTokenOne.symbol(function(e,currentSymbol){
		table = "";
		for (var i = 0; i < window.amountBuyFilledArray.length; i++) {
			cancel_order=false;
				cancel_order=isCanceled(window.amountBuyFilledArray[i]);
				if (cancel_order && window.amountBuyFilledArray[i].user == web3.eth.defaultAccount) {
					table+="<tr class='order_canceled'><td>ETH/"+currentSymbol+"</td><td class='buy'>Buy</td><td>"+window.amountBuyFilledArray[i].amount/Math.pow(10,window.CurrentTokenOne.decimals)+"</td><td>"+(window.amountBuyFilledArray[i].bid)+"</td><td>Canceled</td></tr>";
				}
			
			if (!cancel_order && window.amountBuyFilledArray[i].user == web3.eth.defaultAccount) {
				table+="<tr><td>ETH/"+currentSymbol+"</td><td class='buy'>Buy</td><td>"+window.amountBuyFilledArray[i].amount/Math.pow(10,window.CurrentTokenOne.decimals)+"</td><td>"+(window.amountBuyFilledArray[i].bid)+"</td><td><a href='' id='"+JSON.stringify(window.amountBuyFilledArray[i].bk)+"' class='cancel_order_btn'>Cancel</a></td></tr>";
			}
		}
		window.amountSellFilledArray.forEach(function(value,index,array){
			cancel_order=false;
			cancel_order=isCanceled(value);
			if (cancel_order && value.user == web3.eth.defaultAccount) {
				table += "<tr class='order_canceled'><td>EXO/"+currentSymbol+"</td><td class='sell'>Sell</td><td>"+((value.amount-value.amountFilled)/Math.pow(10,window.CurrentTokenOne.decimals))+"</td><td>"+(value.ask)+"</td><td>Canceled</td></tr>";
				
			}
			if (!cancel_order && value.user == web3.eth.defaultAccount) {
				if (value.ready) {
					table += "<tr><td>ETH/"+currentSymbol+"</td><td class='sell'>Sell</td><td>"+((value.amount)/Math.pow(10,window.CurrentTokenOne.decimals))+"</td><td>"+(value.ask)+"</td><td>Filled</td></tr>";

				}else{
					table += "<tr><td>ETH/"+currentSymbol+"</td><td class='sell'>Sell</td><td>"+((value.amount-value.amountFilled)/Math.pow(10,window.CurrentTokenOne.decimals))+"</td><td>"+(value.ask)+"</td><td><a href='' id='"+JSON.stringify(value.bk)+"' class='cancel_order_btn'>Cancel</a></td></tr>";
				}
			}
		})	
		$(".orders_tbody").html(table);	
	})

	
	
}

function drawOrders(){


		var rowToSell = '';
		var rowToBuy = '';
		window.volToken = 0;
		window.volTokenSell = 0;
		window.volTokenBuy = 0;
		window.volEth = 0;
		window.ask = 0;
		window.bid = 0;
		newBuyVol = 0;
		newSellVol = 0;
		window.amountBuyFilledArray.sort(sortBuyOrder);
		window.amountSellFilledArray.sort(sortSellOrder);
		window.lastPrices = {
			buy :[],
			sell:[]
		}
		for (var i = 0; i < window.amountBuyFilledArray.length; i++) {
			
			tradeDone = false;

			
			if (!amountBuyFilledArray[i].ready) {
				if (amountBuyFilledArray[i].user == web3.eth.defaultAccount) {
					classRow=" style='color:#3eab3e;border:1px solid white' title='Your Order'";
				}else{
					classRow=" style='color:#3eab3e' title='Your Order'";
				}

				newBuyVol += window.amountBuyFilledArray[i].amount;
				rowToSell +="<tr "+classRow+" id='"+window.amountBuyFilledArray[i].id+"'><td style='font-size:10px;padding-left:2px'>"+(newBuyVol/Math.pow(10,window.CurrentTokenOne.decimals))+"</td><td style='text-align:center;' class='price_column'>"+(window.amountBuyFilledArray[i].bid)+"</td><td style='text-align:right;' class='amount_column' >"+window.amountBuyFilledArray[i].amount/Math.pow(10,window.CurrentTokenOne.decimals)+"</td></tr>";
			    lastPrices.buy.push({price:window.amountBuyFilledArray[i].bid,amount:window.amountBuyFilledArray[i].amount/Math.pow(10,window.CurrentTokenOne.decimals)});
			    window.volToken += parseFloat(window.amountBuyFilledArray[i].amount/Math.pow(10,window.CurrentTokenOne.decimals));
			    window.volEth += parseFloat(window.amountBuyFilledArray[i].bid);
			    window.bid += parseFloat(window.amountBuyFilledArray[i].bid);
				writeInOrders(window.amountBuyFilledArray[i]);

			}

			
			
		}
		for (var i = 0; i < window.amountSellFilledArray.length; i++) {
			
			if (!window.amountSellFilledArray[i].ready) {
				newSellVol += window.amountSellFilledArray[i].amount/Math.pow(10,window.CurrentTokenOne.decimals);
				if (amountSellFilledArray[i].user == web3.eth.defaultAccount) {
					classRow=" style='color:#c13030;border:1px solid white' title='Your Order'";
				}else{
					classRow=" style='color:#c13030' title='Your Order'";
				}
			    volTokenVar = (window.amountSellFilledArray[i].amount-window.amountSellFilledArray[i].amountFilled);
			    window.volToken += volTokenVar/Math.pow(10,window.CurrentTokenOne.decimals);
			    // console.log('window.volTokenSell',window.volTokenSell)
			    window.volTokenSell = Math.round((window.volTokenSell + volTokenVar/Math.pow(10,window.CurrentTokenOne.decimals)) * 1e12) / 1e12 ;
			    // console.log('window.amountSellFilledArray[i].ask',window.amountSellFilledArray[i].ask)
				rowToBuy+="<tr "+classRow+" id='"+window.amountSellFilledArray[i].id+"'><td style='text-align:left;'>"+window.volTokenSell+"</td><td style='font-size:10px;padding-left:2px;text-align:center' class='price_column' >"+window.amountSellFilledArray[i].ask+"</td><td style='text-align:right;' class='amount_column'>"+(window.amountSellFilledArray[i].amount-window.amountSellFilledArray[i].amountFilled)/Math.pow(10,window.CurrentTokenOne.decimals)+"</td></tr>";
			    lastPrices.sell.push({price:window.amountSellFilledArray[i].ask,amount:(window.amountSellFilledArray[i].amount-window.amountSellFilledArray[i].amountFilled)/Math.pow(10,window.CurrentTokenOne.decimals)});
			    window.volEth += parseFloat(window.amountSellFilledArray[i].ask);
			    window.ask += parseFloat(window.amountSellFilledArray[i].ask);
				writeInOrders(window.amountSellFilledArray[i]);
			}

		}
		writeInOrders();

		$(".order_sell").html("")
		$(".order_buy").html("");
		$(".order_sell").html(rowToSell)
		$(".order_buy").html(rowToBuy);
		window.CurrentTokenOne.symbol(function(e,r){
			window.CurrentTokenTwo.symbol(function(e,r2){
				$('.volToken').html(window.volToken+" <span>"+r+"</span>");
				$('.volEth').html(window.volEth+" <span>"+r2+"</span>");
				$('.ask_value').html(window.ask+" <span>"+r+"</span>");
				$('.bid_value').html(window.bid+" <span>"+r2+"</span>");				
			})

		})
}
function showModal(title,message){
	$("#myModalLabel").text(title);
	$("#myModalBody").html("<p>"+message+"</p>");
	$('#myModal').modal("show")
}

function volEther(){
	sumaEth = 0;
	restaEth = 0;
	for (var i = 0; i < depositEventArray.length; i++) {
		if (depositEventArray[i].args.token == "0x0000000000000000000000000000000000000000") {
			sumaEth += parseFloat(depositEventArray[i].args.amount);
		}
	}
	for (var i = 0; i < withdrawEventArray.length; i++) {
		if (withdrawEventArray[i].args.token == "0x0000000000000000000000000000000000000000") {
			restaEth += parseFloat(withdrawEventArray[i].args.amount);
		}
	}
	return (sumaEth-restaEth)/Math.pow(10,18);
}
function volToken_(token){
	sumaToken = 0;
	restaToken = 0;
	// console.log('token',token)
	for (var i = 0; i < depositEventArray.length; i++) {
		if (depositEventArray[i].args.token.toUpperCase() == token.address.toUpperCase()) {
			sumaToken += parseFloat(depositEventArray[i].args.amount);
		}
	}
	for (var k = 0; k < withdrawEventArray.length; k++) {
		if (withdrawEventArray[k].args.token.toUpperCase() == token.address.toUpperCase()) {
			restaToken += parseFloat(withdrawEventArray[k].args.amount);
		}
	}
	// console.log('sumaToken',sumaToken)
	// console.log('restaToken',restaToken)
	return (sumaToken-restaToken)/Math.pow(10,token.decimals);
}

function sortBuyOrder(a,b) {
  if (a.bid > b.bid)
    return -1;
  if (a.bid < b.bid)
    return 1;
  return 0;
}
function sortSellOrder(a,b) {
  if (a.ask < b.ask)
    return -1;
  if (a.ask > b.ask)
    return 1;
  return 0;
}
function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
}