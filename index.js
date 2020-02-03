async function register(){
	let p1 = document.getElementById("p1");
	let p2 = document.getElementById("p2");
	console.log("Register pressed");
	if (p1.value === p2.value){
		console.log("password match");
		const resp = await fetch("/register", {
			method: "POST",
			body: JSON.stringify({
				username: document.getElementById("username").value,
				password: p1.value
			}),
			headers: {"Content-Type" : "application/json"}
		});
		const respp = await resp.json();
		if (respp.created)
			window.location.replace("/mainPage");
		else
			document.getElementById("userExists").style.display = "block";
	}else{
		document.getElementById("wPass").style.display = "block";
	}
	
}

async function login(){
	const login = document.getElementById("loginUser").value;
	const pass = document.getElementById("loginPass").value;

	const resp = await fetch("/login",{
		method: "POST",
		headers: {"Content-Type":"application/json"},
		body: JSON.stringify({
			username: login,
			password: pass
		})
	});
	const respJson = await resp.json();
	if (respJson.allowed)
		window.location.replace("/mainPage");
	else
		document.getElementById("badInfo").style.display = "block";
}

function switchToRegister(){
	document.getElementById("loginDiv").style.display = "none";
	document.getElementById("registerDiv").style.display = "block";
}
