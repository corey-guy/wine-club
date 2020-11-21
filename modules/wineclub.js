import Club from './club.js';

class WineClub {

	constructor() {
			
		//setup our onclick listener for the search button
		window.addEventListener("DOMContentLoaded", (event) => {
			var login_button = document.querySelector("#login_button");
			console.log(login_button);
			$("#login_button").on("click", () => {
				console.log("click log in");
				this.loadAppStart()
			});
        });

	}

	loadAppStart() {
		this.loadCreateOrJoin();
		console.log("league home");
	}

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

	loadCreateOrJoin() {
		$("#main_div").load("./views/createOrJoin.html");

		$(document).on("click", "#createleague",  () => {
			this.loadCreateLeagueForm();
		})
		$(document).on("click", "#joinleague", () => {
			console.log("join league");
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
	
	/*
	createClub() {
		console.log("getFileDataText");
		
		const getRequest = new Request("http://localhost:3000/text/", {
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
				let textArea = document.querySelector('#filesearch_text');
				textArea.value = data.text;
				
			})
			.catch(errors => {
				console.log(`Could not post new entry: ${errors}`);
		});
		
	}
	*/

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