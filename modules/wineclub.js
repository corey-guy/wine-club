class WineClub {

	constructor() {
		//make a call to get file data from server
		this.getFileDataText();
		
		
		//setup our onclick listener for the search button
		window.addEventListener("DOMContentLoaded", (event) => {

            // Setup the onclick callbacks for the main save buton
            const searchButton = document.querySelector("#button_search_sensitive");
            searchButton.addEventListener("click", event => {
                console.log("Calling server for sensitive search");
 				this.searchFileDataText(true);
            });

            // Setup the onclick callbacks for the main save buton
            const searchButton2 = document.querySelector("#button_search_insensitive");
            searchButton2.addEventListener("click", event => {
                console.log("Calling server for insensitive search");
 				this.searchFileDataText(false);
            });

        });

	}

	//--------------------------------- API -----------------------------//
	
	/*
	getFileDataText() {
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