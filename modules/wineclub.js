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
		$("#navigation_div").load("./views/navigation.html");
		$("#main_div").empty();
		$(document).on("click", "#createclub",  () => {
			this.loadCreateClubForm();
		});
		$(document).on("click", "#joinclub", () => {
			console.log("join league");
		});
		$(document).on("click", "#myclubs", () => {
			this.showMyClubs();
		});
	}

	loadCreateClubForm() {
		$("#main_div").load("./views/createClubForm.html");

		$(document).on('submit', '#createform', (event) => {
			$("#club_error_bar").empty();
			event.preventDefault();

			//create club Object
			const formData = $("#createform").serializeArray();

			if(formData[0].value.includes(`_`)) {
				$("#club_error_bar").load("./views/usernameHasUnderscores.html");
			}
			else {
				let newClub = new Club(formData[0].value, formData[1].value,
									 formData[2].value, formData[3].value);
				this.createClub(newClub);
			}
		})
	}

	async showMyClubs() {
		console.log("show my clubs");
		let clubs = await this.getClubsByLoggedInUser();
		//form list
		$("#main_div").load("./views/clubList.html", function() {
			$("#clublistdiv").append("<ul id='clubList' class='tilesWrap'></ul>");
			let number = 1;
			console.log(clubs);
			clubs.forEach(function (club) {
				$("#clubList").append(`<li id=${club._id}><h2>${number}</h2><h3>${club.name}</h3><p>Club Game: ${club.game}<br>Start Date: ${club.startdate} <br> Weeks: ${club.numWeeks}</p><button id="${club._id}_button">View Club</button></li>`);
				number++;
				//TODO - ADD EVENT HANDLERS FOR CLUB CLICKING
				$(document).on('click', `#${club._id}_button`, (event) => {
					console.log(`you've clicked the button for ${club._id}`);
					//is this the right way to solve this problem?
					let wineclub = new WineClub();
					wineclub.loadClubHome(club._id);
				});
			});
			if(clubs.length == 0) {
				$("#clubList").append(`you do not have any clubs`);
			}
			console.log("Added club list");
		});

	}

	loadClubCalendar(id) {
		//todo
		console.log("load club calendar");
		//create a table the size of weeks for club
		this.loadClubCalendarById(id);
	}

	loadClubRoster() {
		//todo
		console.log("load club roster");

	}

	loadAdjustYourWeek() {
		//todo
		console.log("load adjust week");

	}

	loadClubHome = function(id) {
		//TODO
		console.log(id);
		this.loadClubById(id);
		this.loadClubCalendar(id);
		$(document).on("click", "#clubcalendar",  () => {
			this.loadClubCalendar();
		});
		$(document).on("click", "#clubroster", () => {
			this.loadClubRoster();
		});
		$(document).on("click", "#editweeks", () => {
			this.loadAdjustYourWeek();
		});

	}

	//--------------------------------- API -----------------------------//
	
	loadClubCalendarById(id) {
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
				let html = "<table class='pure-table'><tr><th>Week</th><th>Captain of the Week</th><th>Date</th><th>Load Out</th>"
				for( let x = 0; x < data.numWeeks; x++ ) {
					//generate table row
					let date = this.calculateDate(data.startdate, x);
					html += `<tr><td>${x+1}</td><td>hey</td><td>${date}</td><td>hey</td></tr>`;
				}
				html += "</table>";
				console.log(html);
				$("#main_div").html(html);
			})
			.catch(errors => {
				console.log(`could not get club: ${errors}`);
			});
		
	}
	calculateDate(startDate, weeks) {
		let now = new Date(startDate);
		now.setDate(now.getDate() + weeks * 7);
		return now.toDateString();
	}
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
				$("#club_nav_div").load("./views/clubNav.html");
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
		return new Promise(function (resolve, reject) {
				console.log("get clubs by logged in user");
				const getRequest = new Request("http://localhost:3000/user/clubs", {
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
					resolve(data);
				})
				.catch(errors => {
					console.log(`could not post new entry: ${errors}`);
					reject(errors);
				});
		});
	}
}

export { WineClub };