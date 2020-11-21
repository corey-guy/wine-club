export default class Club {

	constructor(name, game, startDate, numWeeks) {
		this.name = name;
		this.game = game;
		this.startDate = startDate;
		this.numWeeks = numWeeks;
	}

	getName() {
		return this.name;
	}
}
