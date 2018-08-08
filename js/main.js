$(document).ready(function(){
	var ps3 =null;
	setInterval(function(){
		$("#chartdiv_loading").addClass('hide');
		$("#chartdiv2").removeClass('hide');
		$(".highcharts-button").eq(2).click();
	},6000)
	init();
	$("#btn_limit").click(function(e){
		e.preventDefault();
		$("#btn_market").removeClass('active');
		$(this).addClass('active');
		$("#price,#price_label").removeClass('hide');

	})
	$("#btn_market").click(function(e){
		e.preventDefault();
		$("#btn_limit").removeClass('active');
		$("#price,#price_label").addClass('hide');
		$(this).addClass('active');
		if ($("#btnSend").hasClass('order_buy_btn')) {
			if (window.lastPrices.sell.length > 0) {
				$("#price").val(window.lastPrices.sell[0].price);
				$("#amount").val(window.lastPrices.sell[0].amount);
			}else{
				$("#price").val(0);
			}
		}else{
			if (window.lastPrices.buy.length > 0) {
				$("#price").val(window.lastPrices.buy[0].price);
				$("#amount").val(window.lastPrices.buy[0].amount);
			}else{
				$("#price").val(0);
			}
		}
	})
	$("body").on('click','.price_column',function(){
	
		$("#price").val($.trim($(this).text()))
		$("#price").trigger('keyup');
	});
	$("body").on('click','.amount_column',function(){
		$("#amount").val($.trim($(this).text()))
		$("#amount").trigger('keyup');

	});
	

	$("body").on("click",'#registered',function(){
		if($(this).is(":checked")){
			$("#btn-add-2fa").removeClass('hide');
		}else{
			$("#btn-add-2fa").addClass('hide');

		}
	})
	//adding by default
	$("#btnSend").attr('action','buy');
	$("body").on("click",'#opcBuy',function(){
		$("#btnSend").addClass('btn-primary');
		$("#btnSend").removeClass('btn-danger');
		if ($("#btn_market").hasClass("active")) {
			$("#btn_market").click();
			if (window.lastPrices.sell.length > 0) {
				$("#price").val(window.lastPrices.sell[0].price);
				$("#amount").val(window.lastPrices.sell[0].amount);
			}else{
				$("#price").val(0);
			}
	

		}
		$(this).addClass('active');
		$("#btnSend").attr('action','buy');
		
		$("#opcSell").removeClass('active');
		window.CurrentTokenOne.symbol(function(e,r){
			if (e) {
				alert(e);
			}else{
				$("#btnSend").html('<span id="accion" class="trn">BUY </span><span class="currentTokenOne">'+r+'</span>')
			}
			
		})
		
		$("#btnSend").addClass('order_buy_btn')
		$("#btnSend").removeClass('order_sell_btn')
	})
	$("body").on("click",'#opcSell',function(){
		$("#btnSend").removeClass('btn-primary');
		$("#btnSend").addClass('btn-danger');
		if ($("#btn_market").hasClass("active")) {
			$("#btn_market").click();
			if (window.lastPrices.buy.length > 0) {
				$("#price").val(window.lastPrices.buy[0].price);
				$("#amount").val(window.lastPrices.buy[0].amount);
			}else{
				$("#price").val(0);
			}
		}
		$(this).addClass('active');
		$("#btnSend").attr('action','sell');
		$("#opcBuy").removeClass('active');
		window.CurrentTokenOne.symbol(function(e,r){
			if (e) {
				alert(e);
			}else{
				$("#btnSend").html('<span id="accion" class="trn">SELL </span><span class="currentTokenOne">'+r+'</span>');
			}
		})
		$("#btnSend").addClass('order_sell_btn')
		$("#btnSend").removeClass('order_buy_btn')

	})
	$("body").on('click','#btn-authenticate',function(){
		$(".loading_auth").removeClass('hide');
		$.ajax({
			url:'/verify/'+$("#key").val()+'/'+web3.eth.defaultAccount,
			success:function(r){
				$(".loading_auth").addClass('hide');
				if (r.verified == true) {
					console.log(r);
					location.reload('/');
				}else{
					console.log(r);
					$('.wrong').removeClass('hide')
				}
				
			}
		})
	})
	$('body').on('click','#btn-add-2fa',function(){
		window.exchange2faContract.setSecret($(this).attr('secret'),{from:web3.eth.defaultAccount},function(e,r){
			console.log(e,r);
			if (e) {
				alert(e);
			}else{
				$("#text_qr").html("Your address is being registered in the blockchain. You can close this window now");
				$("#btn-add-2fa,#qr_image_code,#text_check_qr").addClass('hide');
			}
		})
	})

	$("body").on("click",".selectable_pair",function(){
		
		if (confirm('A continuacion se cambiara de par, desea continuar?')) {

			$("#price,#amount").val("");
			$("#total_order").text("");
			var este = $(this).text()
			var pair = $(this).attr('value').split("_");
			var idToken = $(this).attr('token');
			$('body').find('#tickers_list tr.active').eq(0).removeClass('active');
			$('body').find('#tickers_list #token'+idToken).eq(0).addClass('active');
			$(this).addClass('pair_selected');
			if (pair.length == 1) {
				for (var i = 0; i < window.tokens.tokens.length; i++) {
					console.log('window.tokens.tokens[i].symbol == pair[0].toUpperCase()',window.tokens.tokens[i].symbol , pair[0].toUpperCase())
					if (window.tokens.tokens[i].symbol == pair[0].toUpperCase()) {

						window.CurrentTokenOne = web3.eth.contract(window.tokens.tokens[i].abi).at(window.tokens.tokens[i].address);
						window.CurrentTokenOne.decimals(function(e,r){
							if (r && r.toNumber() == 0) {
								window.CurrentTokenOne.decimals = 18
							}
							if (r && r.toNumber() != 0) {
								window.CurrentTokenOne.decimals = r.toNumber();
							}
							console.log('window.CurrentTokenOne.decimals',window.CurrentTokenOne.decimals)
						})
						window.CurrentTokenOne.symbol(function(e,r){
							if (e) {
								window.CurrentTokenOne.symbol = function(cb){
									cb(null,window.tokens.tokens[i].symbol)
								}
							}
						})
						window.CurrentTokenTwo = {};
						window.CurrentTokenTwo.address = "0x0000000000000000000000000000000000000000";
						window.CurrentTokenTwo.decimals = 18;
						window.CurrentTokenTwo.symbol = function(cb){
							cb(null,"EXP");
						}
						$(".currentTokenOne").text(window.tokens.tokens[i].symbol);
						$(".currentTokenTwo").text("EXP");
					
						$("#selected").text(este)								
						
						$("#allowance_result,#token_to_deposit,#ether_to_deposit").val("");

						break;
					}
				}
			}
			if (pair.length == 2) {
				console.log('pair 2')
				for (var i = 0; i < window.tokens.tokens.length; i++) {
					if (window.tokens.tokens[i].symbol == pair[0].toUpperCase()) {
						window.CurrentTokenOne = web3.eth.contract(window.tokens.tokens[i].abi).at(window.tokens.tokens[i].address);
						$(".currentTokenOne").text(window.tokens.tokens[i].symbol);
						window.CurrentTokenOne.decimals(function(e,r){
							window.CurrentTokenOne.decimals = r.toNumber();
						})
						console.log('encontro1')
						break;
					}
				}	
				for (var i = 0; i < window.tokens.tokens.length; i++) {
					if (window.tokens.tokens[i].symbol == pair[1].toUpperCase()) {
						console.log(">")
						window.CurrentTokenTwo = web3.eth.contract(window.tokens.tokens[i].abi).at(window.tokens.tokens[i].address);
						$(".currentTokenTwo").text(window.tokens.tokens[i].symbol);
						window.CurrentTokenTwo.decimals(function(e,r){
							window.CurrentTokenTwo.decimals = r.toNumber();
						})
						console.log('encontro2')
						break;
					}
				}
			}
			$("#waiting_modal").modal('show');
			$(".table-sortable").DataTable().clear().draw();
			setTimeout(function(){
				getBalance();
				$("#waiting_modal").modal('toggle');
				reloadPairOrders();
				createChart();
				crearInputs();
				myOrders.printAgain();
				// 
			},2500)
		}

	})

	$("body").on("click","#look_book_orders",function(){
		drawOrders()
	})
	/*to calculate buy price*/
	$("body").on("keyup","#price, #amount",function(){
		$(this).val($.trim($(this).val()));
		long = $(this).val().length;
		if (!IsNumeric($(this).val()) && $(this).val()!="" && $(this).val()[long-1] != '.') {
			$(this).val(parseFloat(0));
			return;
		}
		if ($("#amount").val()) {
			amount = parseFloat($("#amount").val())
		}else{
			amount = parseFloat(0);
			return;
			// $("#amount").val(amount)
		}
		if ($(this).val()) {
			price = parseFloat($("#price").val());
		}else{
			price = parseFloat(0);
			return;

			// $(this).val(price)
		}

		cf  = Math.pow(10,window.CurrentTokenOne.decimals);

		if (IsNumeric(amount) && IsNumeric(price) && amount != '' && price != '') {
			total = (Math.round(amount * cf) * Math.round(price * cf)) / (cf*cf);
			/*total -> 100
			    x <- 0.2
			*/
			feetotal = 0.2 * total / 100;
			//feetotal = total - feetotal;
			

			$("#buy_fee").val(parseFloat(feetotal));
			$("#total_order").text(Number(total).toFixed(8).replace(/\.?0+$/,""));			
		}

	});
	$("body").on('click','.symbols',function(){
		$(".symbols").removeClass('active');
		$(this).addClass('active');
		if ($(this).find('td').eq(0).text() == 'EXP') {
			$("#wrap-eth-button").addClass('deposit_ether')
			$("#wrap-eth-button_withdraw").addClass('withdraw_ether');
			$("#wrap-eth-button_withdraw").removeClass('withdraw_token');
			$("#wrap-eth-button").removeClass('deposit_token')
		}else{
			$("#wrap-eth-button").addClass('deposit_token');
			$("#wrap-eth-button_withdraw").addClass('withdraw_token');
			$("#wrap-eth-button_withdraw").removeClass('withdraw_ether');
			$("#wrap-eth-button").removeClass('deposit_ether');
		}
	})
	/*to calculate sell price*/
	$("body").on("keyup","#sell_price, #sell_amount",function(){
		$(this).val($.trim($(this).val()));
		long = $(this).val().length;
		if (!IsNumeric($(this).val()) && $(this).val()!="" && $(this).val()[long-1] != '.') {
			$(this).val(parseFloat(0));
			return;
		}
		if ($("#sell_amount").val()) {
			amount = parseFloat($("#sell_amount").val())
		}else{
			amount = parseFloat(0);
			// $("#sell_amount").val(amount)
		}
		if ($(this).val()) {
			price = parseFloat($("#sell_price").val());
		}else{
			price = parseFloat(0);
			// $(this).val(price)
		}
		//feetotal = amount * price + ( amount * price * 0.2);
		if (IsNumeric(amount) && IsNumeric(price) && amount != '' && price != '') {
			total = amount * price;
			feetotal = 0.2 * total / 100;
			$("#sell_fee").val(feetotal);
			$("#sell_total").val(total);
		}
	});
	function recorrerSell(array,index){
		if (typeof array[index] != 'undefined') {
			value = array[index];
			if (parseFloat(value.ask) == parseFloat($("#price").val()) && value.ready == false &&
				value.bk.tokenGet.toUpperCase() == window.CurrentTokenTwo.address.toUpperCase() && 
				value.bk.tokenGive.toUpperCase() == window.CurrentTokenOne.address.toUpperCase() && 
				value.user.toUpperCase() != web3.eth.defaultAccount.toUpperCase()) {

				amount = parseFloat($("#total_order").text()) * Math.pow(10,window.CurrentTokenTwo.decimals);
				amount = Math.round(amount);
				window.Exchange.testTrade(value.bk.tokenGet, Math.round(value.bk.amountGet), value.bk.tokenGive, Math.round(value.bk.amountGive), value.bk.expires, value.bk.nonce, value.bk.user, 0, 0, 0, amount, web3.eth.defaultAccount,{from:web3.eth.defaultAccount},function(error,result){
					console.log('Test trade ',result)
					if (result) {
						// console.log('------1-->',value.bk.tokenGet, Math.round(value.bk.amountGet), value.bk.tokenGive, Math.round(value.bk.amountGive), value.bk.expires, value.bk.nonce, value.bk.user, 0, 0, 0, amount)
						window.Exchange.trade(value.bk.tokenGet, Math.round(value.bk.amountGet), value.bk.tokenGive, Math.round(value.bk.amountGive), value.bk.expires, value.bk.nonce, value.bk.user, 0, 0, 0, amount,{from:web3.eth.defaultAccount},function(errorTrade,resultTrade){
							console.log('trade error:',errorTrade);
							console.log('trade result:',resultTrade);
						})
					}else{
						if (typeof array[index+1] !='undefined') {
							recorrerSell(array,index+1);
						}else{
							addBuyOrder();
						}					
					}
				})
			}else{
				if (typeof array[index+1] !='undefined') {
					recorrerSell(array,index+1);
				}else{
					addBuyOrder();
				}
			}			
		}else{
			addBuyOrder();
		}

	}
	function recorrerBuy(array,index){
		if (typeof array[index] != 'undefined') {
			value = array[index];
	
				if (parseFloat(value.bid) == parseFloat($("#price").val())  && value.ready == false && 
					value.bk.tokenGet.toUpperCase() == window.CurrentTokenOne.address.toUpperCase() && 
					value.bk.tokenGive.toUpperCase() == window.CurrentTokenTwo.address.toUpperCase() && 
					value.user.toUpperCase() != web3.eth.defaultAccount.toUpperCase()) {
					amount = parseFloat($("#amount").val())  * Math.pow(10,window.CurrentTokenOne.decimals);
					amount = Math.round(amount);
					window.Exchange.testTrade(value.bk.tokenGet, Math.round(value.bk.amountGet), value.bk.tokenGive, Math.round(value.bk.amountGive), value.bk.expires, value.bk.nonce, value.bk.user, 0, 0, 0, amount, web3.eth.defaultAccount,{from:web3.eth.defaultAccount},function(error,result){
						console.log('Test trade ',result)
						if (result) {

							window.Exchange.trade(value.bk.tokenGet, Math.round(value.bk.amountGet), value.bk.tokenGive, Math.round(value.bk.amountGive), value.bk.expires, value.bk.nonce, value.bk.user, 0, 0, 0, amount,{from:web3.eth.defaultAccount},function(errorTrade,resultTrade){
								console.log('trade error:',errorTrade);
								console.log('trade result:',resultTrade);
							})
						}else{
							if (typeof array[index+1] !='undefined') {
								recorrerBuy(array,index+1);
							}else{
								console.log('?1')
								addSellOrder();
							}					
						}
					})
			}else{
				if (typeof array[index+1] != 'undefined') {
					recorrerBuy(array,index+1);
				}else{
					console.log('?2')
					addSellOrder();
				}
			}			
		}else{
			console.log('?3')
			addSellOrder();
		}

	}
	/*event to buy*/
	$("body").on("click",".order_buy_btn",function(e){
		e.preventDefault();

		window.Exchange.balanceOf(window.CurrentTokenTwo.address,web3.eth.defaultAccount,{from:web3.eth.defaultAccount},function(e,r){
			console.log(e,);
			if (r.toNumber()/Math.pow(10,window.CurrentTokenTwo.decimals) >= parseFloat($("#total_order").text())) {
				recorrerSell(amountSellFilledArray,0);
			}else{
				alert('No tienes suficientes fondos de Ether.')
				return;
			}
		})
		
		
	});
	function addBuyOrder(){
		console.log('addBuyOrder!')
		web3.eth.getBlockNumber(function(error, currentBlock){ 
			nonce = Date.now();
			tokenGet = window.CurrentTokenOne.address;
			amountGet = (parseFloat($("#amount").val()) * cf) * (Math.pow(10,window.CurrentTokenOne.decimals) * cf) / (cf*cf);
			tokenGive = window.CurrentTokenTwo.address;
			amountGive = (parseFloat($("#total_order").text())* cf) * (Math.pow(10,window.CurrentTokenTwo.decimals)* cf)/ (cf*cf);
			amountGive = Math.round(amountGive);
			amountGet = Math.round(amountGet);
			console.log(tokenGet, amountGet, tokenGive, amountGive, currentBlock+1000, nonce);
			window.Exchange.order(tokenGet, amountGet, tokenGive, amountGive, currentBlock+1000, nonce,{from:web3.eth.defaultAccount},function(error,result){
				console.log('error:',error);
				console.log('result:',result);
			})
		})
	}
	/*event to sell*/
	$("body").on("click",".order_sell_btn",function(e){
		e.preventDefault();
		window.Exchange.balanceOf(window.CurrentTokenOne.address,web3.eth.defaultAccount,{from:web3.eth.defaultAccount},function(e,r){
			amount = r.toNumber()/Math.pow(10,window.CurrentTokenOne.decimals);
			if (amount >= parseFloat($("#amount").val())) {
				recorrerBuy(amountBuyFilledArray,0);
			}else{
				window.CurrentTokenOne.symbol(function(e,sy){
					alert('No tienes suficientes fondos de '+sy+'.')
					return;							
				})
		
			}
		})
		

	});
	function addSellOrder(){
		console.log('addSellOrder')
		web3.eth.getBlockNumber(function(error, currentBlock){ 
			nonce = Date.now();
			tokenGet = window.CurrentTokenTwo.address;
			amountGet = (parseFloat($("#price").val()) * cf) * (parseFloat($("#amount").val()) * cf) * (Math.pow(10,window.CurrentTokenTwo.decimals) * cf) / (cf * cf * cf);
			tokenGive = window.CurrentTokenOne.address;
			amountGive = (parseFloat($("#amount").val()) * cf) * (Math.pow(10,window.CurrentTokenOne.decimals) * cf) / (cf * cf);
			amountGive = Math.round(amountGive);
			amountGet = Math.round(amountGet);
			console.log(tokenGet, amountGet, tokenGive, amountGive, currentBlock+1000, nonce);
			
			window.Exchange.order(tokenGet, amountGet, tokenGive, amountGive, currentBlock+1000, nonce,{from:web3.eth.defaultAccount},function(error,result){
				console.log('error:',error);
				console.log('result:',result);
			})
		})		
	}
	/*to cancel orders*/
	$("body").on("click",".cancel_order_btn",function(e){
		e.preventDefault();
		var attributes = JSON.parse($(this).attr('id'));
		console.log(attributes);
		if (confirm('Are you sure?')) {
			//(address tokenGet, uint amountGet, address tokenGive, uint amountGive, uint expires, uint nonce, uint8 v, bytes32 r, bytes32 s)
			window.Exchange.cancelOrder(attributes.tokenGet,attributes.amountGet,attributes.tokenGive,attributes.amountGive,attributes.expires,attributes.nonce,0,0,0,{from:web3.eth.defaultAccount},function(error,result){
				if (error) {
					alert(error);
				}else{
					console.log('result:',result);
				}
			})
		}
	})

	/*to deposit ether modal event*/
	$('body').on('click','.deposit_ether',function(){
		tokenIndex = false;
		window.tokens.tokens.forEach(function(value,index,array){
			console.log('value.address.toUpperCase() == CurrentTokenTwo.address.toUpperCase()',value.address.toUpperCase(), CurrentTokenTwo.address.toUpperCase(),value.address.toUpperCase() == CurrentTokenTwo.address.toUpperCase())
			if (value.address.toUpperCase() == CurrentTokenTwo.address.toUpperCase()) {
				tokenIndex = index;
			}
		})
		if (tokenIndex !== false && window.tokens.tokens[tokenIndex].type == 'ERC223') {
			// console.log('this madafoka')
			window.CurrentTokenTwo.symbol(function(e,symbol){
				text='To deposit ERC223 tokens, please send them directly<br>'+
				'to the exchange contract address:<br>'+
				window.Exchange.address+"<br>"+
				'Please check that your token '+symbol+' is at address '+
				CurrentTokenTwo.address+'<br>'+
				'Deposit will be credited once the transaction was mined';
				$("#depositERC223_myModalBody").html('<p>'+text+'</p>');
				$("#depositERC223").modal('show');					
			})

		}else{
			$("#depositEtherModal").modal('show');
		}
	})
	/*to deposit token modal event*/
	$('body').on('click','.deposit_token',function(){
				tokenIndex = false;
		window.tokens.tokens.forEach(function(value,index,array){
			if (value.address.toUpperCase() == CurrentTokenOne.address.toUpperCase()) {
				tokenIndex = index;
			}
		})
		if (tokenIndex !== false && window.tokens.tokens[tokenIndex].type == 'ERC223') {
			window.CurrentTokenOne.symbol(function(e,symbol){
				text='To deposit ERC223 tokens, please send them directly<br>'+
				'to the exchange contract address:<br>'+
				window.Exchange.address+"<br>"+
				'Please check that your token '+symbol+' is at address '+
				CurrentTokenOne.address+'<br>'+
				'Deposit will be credited once the transaction was mined';
				$("#depositERC223_myModalBody").html('<p>'+text+'</p>');
				$("#depositERC223").modal('show');					
			})

		}else{
			$("#depositTokenModal").modal('show');
			window.CurrentTokenOne.allowance(web3.eth.defaultAccount,window.Exchange.address,function(err,allowanceResult){
				if (!err) {
					$("#allowance_result").val(allowanceResult/Math.pow(10,window.CurrentTokenOne.decimals));
					if (allowanceResult == 0) {
						$('.allowance_message').html("Please approve some tokens <br> Owner:"+web3.eth.defaultAccount+"<br>Spender:"+window.Exchange.address);
					}
				}
			})
		}

	})
	/*to withdraw ether modal event*/
	$('body').on('click','.withdraw_ether',function(){
		$("#withdrawEtherModal").modal('show');
		$("#ether_to_withdraw").val($("#eth_bal_buy").text().split(" ")[0])
	})
	/*to withdraw token modal event*/
	$('body').on('click','.withdraw_token',function(){
		$("#withdrawTokenModal").modal('show');
		$("#token_to_withdraw").val($("#tokenOne_bal_sell").text().split(" ")[0])
	})
	/*withdraw token btn*/
	$('body').on('click','#withdraw_token_btn',function(){
		if ($("#token_to_withdraw").val()) {
			token = parseFloat($("#token_to_withdraw").val())*Math.pow(10,window.CurrentTokenOne.decimals);
			console.log('Token Quantity:',token);
			console.log(window.CurrentTokenOne.address,token);
			window.Exchange.withdrawToken(window.CurrentTokenOne.address,token,{from:web3.eth.defaultAccount},function(err,result){
				if (err) {
					alert(err)
				}else{
					if (window.networkVersion == 4) {
						url = 'https://rinkeby.etherscan.io/tx/'+result;
						showModal("Success","txAddress:<p><a target='_blank' href='"+url+"'>Click Here to see tx state</a></p>");
					}else{
						showModal("Success","txAddress:<p>"+result+"</p>");
					}
				}
			})			
		}

	})
	/*withdraw ether btn*/
	$('body').on('click','#withdraw_ether_btn',function(){
		if ($("#ether_to_withdraw").val()) {
			ethersWeis = parseFloat($("#ether_to_withdraw").val())*Math.pow(10,window.CurrentTokenTwo.decimals);
			window.Exchange.withdraw(ethersWeis,{from:web3.eth.defaultAccount},function(err,result){
				if (err) {
					alert(err)
				}else{
					if (window.networkVersion == 4) {
						url = 'https://rinkeby.etherscan.io/tx/'+result;
						showModal("Success","txAddress:<p><a target='_blank' href='"+url+"'>Click Here to see tx state</a></p>");
					}else{
						showModal("Success","txAddress:<p>"+result+"</p>");
					}
				}
			})			
		}

	})
	/*to withdraw token modal event*/
	$('body').on('click','.withdraw_token',function(){
		$("#withdrawTokenModal").modal('show');
	})
	/*deposit ether btn*/
	$('body').on('click','#deposit_ether_btn',function(){
		if ($("#ether_to_deposit").val()) {
			ethersWeis = $("#ether_to_deposit").val()*Math.pow(10,18);
			window.Exchange.deposit({value:ethersWeis,from:web3.eth.defaultAccount},function(err,result){
				if (err) {
					alert(err)
				}else{
					console.log('Result:',result);
				}
			})			
		}

	})
		/*deposit token btn*/
	$('body').on('click','#deposit_token_btn',function(){
		if ($("#token_to_deposit").val()) {
			tokenQuantity = $("#token_to_deposit").val()*Math.pow(10,window.CurrentTokenOne.decimals);//i dont know why deposit multi by 2
			// console.log("deposit:",tokenQuantity);
			window.Exchange.depositToken(window.CurrentTokenOne.address,parseInt(tokenQuantity),{from:web3.eth.defaultAccount},function(err,result){
				if (err) {
					alert(err)
				}else{
					console.log('Result:',result);
				}
			})			
		}

	})
	$("body").on("click","#eth_bal_buy",function(){
		var text = $(this).text().split(" ")[0];
		$("#price").val(parseFloat(text));
	})
	$("body").on("click","#tokenOne_bal_sell",function(){
		var text = $(this).text().split(" ")[0];
		$("#sell_amount").val(parseFloat(text));
	})
});