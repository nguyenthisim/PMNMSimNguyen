/*
var socket=io();

socket.on("server-send-dki-thatbai",function(){
	alert("Sai username (co nguoi da dang ki!)");
});

socket.on("server-send-dki-thanhcong",function(data){
	$("#currentUser").html(data);
	$("#loginForm").hide(2000);
	$("#chatForm").show(1000);
});

socket.on("server-send-message",function(data){
	$("#listMessages").append("<div class='ms'>"+data.un+":"+data.nd+"</div>");
	
});

//socket.on("server-send-danhsach-Users",function(data){

//	$("#boxContent").html("");
	//data.forEach(function(i){
	//	$("#boxContent").append("<div class='user'>"+i+"</div>");
	//});
//});

$(document).ready(function(){
	$("#loginForm").show();
	$("#chatForm").hide();

	$("#btnRegister").click(function(){
		socket.emit("client-send-Username",$("#txtUsername").val());

	});
	$("#btnLogout").click(function(){
		socket.emit("logout");
		 $("#chatForm").hide(2000);
		$("#loginForm").show(10000);
	   
	});
	$("#btnSendMessage").click(function(){
		socket.emit("user-send-message",$("#txtMessage").val());

	});

});
*/