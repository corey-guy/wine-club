import Club from './club.js';
import User from './user.js';

class WineClub {

	constructor() {
			
		//setup our onclick listener for the login button
		window.addEventListener("DOMContentLoaded", (event) => {
			var login_button = document.querySelector("#login_button");
			console.log(login_button);
			$("#login_button").on("click", () => {
				console.log("click log in");
				//make call to facebook login
				this.authFacebook();
				this.loadAppStart();
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
			this.loadCreateLeagueForm();
		})
		$(document).on("click", "#joinclub", () => {
			console.log("join league");
		})
		$(document).on("click", "#myclubs", () => {
			this.showMyClubs();
		})
	}

	loadCreateLeagueForm() {
		$("#main_div").load("./views/createLeagueForm.html");

		$(document).on('submit', '#createform', (event) => {
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
	//--------------------------------- API -----------------------------//
		
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
				console.log("posted new club");
				
			})
			.catch(errors => {
				console.log(`Could not post new club: ${errors}`);
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

	/*
	searchFileDataText(caseSensitive) {


		//grab text
		let searchText = document.querySelector('#input_search');

		//trim it
		let trimmedSearchText = searchText.value.trim();

		//make sure it's not blank
		if(!trimmedSearchText) {
			console.log("blank!");
			searchText.value = "Enter something here! No blank spaces.";
		}
		else {
			//make the web service call
			const getRequest = new Request(`http://localhost:3000/search/${trimmedSearchText}/${caseSensitive}`, {
				method: "GET",
				mode: "cors",
				redirect: "follow",
				credentials: "include",
				headers: new Headers({ "Content-Type": "text/plain" })
			});

			fetch(getRequest)
				.then(response => {
					return response.json();
				})
				.then(data => {
					console.log(data);
					let displayArea = document.querySelector('#display_count');
					displayArea.value = `This phrased showed up ${data.frequency} times!`
				})
				.catch(errors => {
					console.log(`Could not post new entry: ${errors}`);
				})
		}


	}
	*/
}

export { WineClub };