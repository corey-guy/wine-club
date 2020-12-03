import Club from './club.js';
import User from './user.js';

class WineClub {

	constructor() {
			
		//setup our onclick listener for the login button
		window.addEventListener("DOMContentLoaded", (event) => {

			$(document).on("submit", "#loginform", (event) => {
				console.log("submit login");

				$("#login_error_bar").empty();
				event.preventDefault();
				this.login();
			});

			$("#register_button").on("click", () => {
				console.log("click register");
				this.loadRegistration();
			});

        });

	}

	loadAppStart() {
		this.loadCreateOrJoin();
		console.log("league home");
	}

/*
	loadNavigation() {
		let htmlList = "<ul><li id='cc'><a>Club Calendar</a></li><li id='cr'>Club Roster</li><li id='ayw'>Adjust Your Week</li></ul>";
		$("#navigation_div").html(htmlList)
		//set on clickers
		$("#cc").on("click", () => {
			console.log("clicked cc");
			this.loadClubCalendar();
		})

		$("#cr").on("click", () => {
			console.log("clicked cc");
			this.loadClubRoster();
		})

		$("#ayw").on("click", () => {
			console.log("clicked cc");
			this.loadAdjustYourWeek();
		})


	}
*/
	
	login() {		
		//if success

		const formData = $("#loginform").serializeArray();
		
		let user = new User(formData[0].value, "", formData[1].value);
		console.log(user);
		this.authUser(user);
	}

	loadRegistration() {
		$("#main_div").load("./views/registration.html");

		$(document).on("submit", "#registerform", () => {
			$("#error_bar").empty();
			event.preventDefault();
			const formData = $("#registerform").serializeArray();
			//lets at least flash a warning sign that the passwords are not the same and to resubmit
			if(formData[2].value != formData[3].value) {
				$("#error_bar").load("./views/passwordNotMatch.html");
			}
			else {
				//create user object
				let newUser = new User(formData[0].value, 
									   formData[1].value,
									   formData[2].value);
				this.createUser(newUser);
			}
		})
	}

	loadCreateOrJoin() {
		$("#main_div").load("./views/navigation.html");

		$(document).on("click", "#createclub",  () => {
			this.loadCreateClubForm();
		})
		$(document).on("click", "#joinclub", () => {
			console.log("join league");
		})
		$(document).on("click", "#myclubs", () => {
			this.showMyClubs();
		})
	}

	loadCreateClubForm() {
		$("#main_div").load("./views/createClubForm.html");

		$(document).on('submit', '#createform', (event) => {
			$("#club_error_bar").empty();
			event.preventDefault();
			//create club Object
			const formData = $("#createform").serializeArray();
			let newClub = new Club(formData[0].value, formData[1].value,
								 formData[2].value, formData[3].value);
			this.createClub(newClub)
		})
	}

	showMyClubs() {
		console.log("show my clubs");
		this.getClubsByLoggedInUser();

	}

	loadClubCalendar() {
		//todo

	}

	loadClubRoster() {
		//todo
		
	}

	loadAdjustYourWeek() {
		//todo
	}

	loadClubHome(id) {
		//TODO
		this.loadClubById(id);

	}

	//--------------------------------- API -----------------------------//
	
	loadClubById(id) {
		const getRequest = new Request("http://localhost:3000/club/" + id, {
			method: "GET",
			mode: "cors",
			redirect: "follow",
			credentials: "include",
			headers: new Headers({ "Content-Type": "application/json" })
		});

		fetch(getRequest)
			.then(response => {
				return response.json();
			})
			.then(data => {
				console.log(data);
				console.log("get club request complete");
				$("#main_div").html(`Club name: ${data.name} <br> Club game: ${data.game} <br> Start date: ${data.startdate}`)
			})
			.catch(errors => {
				console.log(`could not get club: ${errors}`);
			});
		
	}

	authFacebook() {
		console.log("facebook auth call ");

		const getRequest = new Request("http://localhost:3000/auth/facebook", {
			method: "GET",
			mode: "no-cors",
			redirect: "follow",
			credentials: "include",
			headers: new Headers({ "Content-Type": "application/json" })
		});

		fetch(getRequest)
			.then(response => {
				return response.json();
			})
			.then(data => {
				console.log(data);
				console.log("auth facebook success");
				
			})
			.catch(errors => {
				console.log(`Could not auth facebook: ${errors}`);
		});
	}

	createClub(club) {
		console.log("generating createClub call to server");
		console.log(JSON.stringify(club));

		const postRequest = new Request("http://localhost:3000/club", {
			method: "POST",
			mode: "cors",
			redirect: "follow",
			credentials: "include",
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify(club)
		});

		fetch(postRequest)
			.then(response => {
				return response.json();
			})
			.then(data => {
				console.log(data);
				if(data == "error") {
					console.log("club already exists, choose a new name");
					$("#club_error_bar").load("./views/clubNameInvalid.html");
				}
				else {
					console.log("posted new club");
					console.log(data);
					this.loadClubHome(data._id);
				}
				
			})
			.catch(errors => {
				console.log(`Could not post new club: ${errors}`);
		});
		
	}

	authUser(user) {
		console.log("auth user");

		const postRequest = new Request("http://localhost:3000/authUser", {
			method: "POST",
			mode: "cors",
			redirect: "follow",
			credentials: "include",
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify(user)
		});

		fetch(postRequest)
			.then(response => {
				return response.json();
			})
			.then(data => {
				console.log(data);
				
				if(data == "error") {
					console.log("Login Credentials Invalid");
					$("#login_error_bar").load("./views/loginInvalid.html");
				}
				else {
					console.log("sucessful login");
					console.log(data);
					this.loadAppStart();
				}
				
				
			})
			.catch(errors => {
				console.log(`Could not login: ${errors}`);
		});
	}

	createUser(user) {
		console.log("generating createUser call to server");

		const postRequest = new Request("http://localhost:3000/user", {
			method: "POST",
			mode: "cors",
			redirect: "follow",
			credentials: "include",
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify(user)
		});

		fetch(postRequest)
			.then(response => {
				return response.json();
			})
			.then(data => {
				console.log(data);
				if(data == "error") {
					console.log("username taken");
					$("#error_bar").load("./views/usernameTaken.html");

				}
				else {
					console.log("posted new user");
					this.loadCreateOrJoin();
				}
				
			})
			.catch(errors => {
				console.log(`Could not post new user: ${errors}`);
		});
	}
	
	getClubsByLoggedInUser() {
		console.log("get clubs by logged in user");
		const getRequest = new Request("http://localhost:3000/clubs", {
			method: "GET",
			mode: "cors",
			redirect: "follow",
			credentials: "include",
			headers: new Headers({ "Content-Type": "application/json"})
		});

		fetch(getRequest)
			.then(response => {
				return response.json();
			})
			.then(data => {
				console.log(data);
			})
			.catch(errors => {
				console.log(`could not post new entry: ${errors}`);
			})
	}
}

export { WineClub };