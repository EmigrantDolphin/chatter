loadWelcome();

async function loadWelcome(){
	let welMsg = document.getElementById("welcomeId");
	let userInfo = await fetch('/userInfo',{
		method: "GET"
	});
	console.log(userInfo);
}


