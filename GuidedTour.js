/////////////////////////////////////
// 
// ### USAGE:
// In order to make use of the component you need to register application element with the help of the "register()" 
// method which takes a DOM element and an "options" object
// NOTE* -> It's recommended that you register the tour item inside the "componentDidMount" hook of the curently registered item
// in order to make sure that the target component has been created
// 
// ## AVAILABLE OPTIONS: 
// position: "top" || "right" || "bottom" || "left" <- Positions the guide box relative to the target element
// click: bool <- Simulates a click on component if true
// step: int <- Choose in which step of the tour should the component be highlighted
// isFixed: bool <- Tells the component if the target component is fixed in order to handle window scrolling accordingly
// 
// ## STARTING THE TOUR
// In order to start the tour you need to call the "initialize" method which will setup the tour
// 
// ## EXTEDING AVAILABLE OPTIONS
// if the component needs to have additional options, the name of key that is holding the option value has to be matched with
// the name of the method that handles the logic
// 
// EXAMPLE: {confirmExit: True}
// 		confirmExit( optionValue ) {
// 			/* Handle options */
// 		}
// 
/////////////////////////////////////

const { Component } = require("react");
const router = require("app/services/router");

class GuidedTour extends Component 
{
	constructor() {
		super()

		this.state = {
			sequence: [],
			step: 0,
			ready: false
		}
		
		this.store = [];
		this.priorityStore = [];
		this.component = {}
	}

	get sequenceContents() {
		const sequenceContents = [
			<p>Here you can selected which domain you want to get data for.</p>,
			<p>This is the range picker, it helps you select in which period you want to view your data</p>,
			<p>Here you can find the application settings</p>,
			<p>Here you can view your SEO value calculated in morningscore, this is a curency that shows you how powerful your SEO is</p>,
			<p>This little icons here means: "Hey! Explain me what this is!"</p>,
			<p>This graph shows you an overview of you morningscore evolution in the selected period, remember the Range picker?</p>,
			<p>Here you can take a sneak peek at you competitors</p>,
			<p>This chart shows the evolution of your SEO traffic over your selected period</p>,
			<p>Here this component will show you your total traffic potential compared to your competitors</p>,
			<p>Here we have the components that hold your website reports organized in tabs</p>,
			<p>The first tabs shows you information about the keywords you are tracking</p>,
			<p>We know that links are important for SEO, so we create a special tab for them</p>,
			<p>We plan on offering onsite analysis to your website, stay tuned</p>,
			<p>Just to let you know there are new components coming soo</p>,
			<p>Don\'t forget that you can take the tour again here, you are now ready to use morningscore</p>,
		];

		return sequenceContents;
	}

	register = (component, options) => {
		if (options.hasOwnProperty("step")) {
			this.priorityStore.push({component, options});
		}
		else {
			this.store.push({component, options})
		}
	}

	prioritizeSequence = (store, priorityStore) => {
		var sequence = [];
		var totalEntries = store.length + priorityStore.length;

		priorityStore.sort((a, b) => {
			return b.options.step - a.options.step;
		});
		store.reverse();

		for (let i = 0; i < totalEntries; i++) {
			if (priorityStore.length > 0 && priorityStore[priorityStore.length - 1].options.step === i) {
				delete priorityStore[priorityStore.length - 1].options.step;
				sequence.push(priorityStore.pop());
			}
			else {
				sequence.push(store.pop());
			}
		}
		return sequence;
	}

	next = () => {
		this.state.step + 1 < this.state.sequence.length
			? this.handleStepChange(() => {
				this.setState({
					step: ++this.state.step
				});
			})
			: this.finishTour();
	}
	prev = () => {
		this.state.step > 0
			? this.handleStepChange(() => {
				this.setState({
					step: --this.state.step
				});
			})
			: null;
	}

	handleStepChange(handler) {
		
		this.guideBox.style.transform = "scale(0, 0)";

		setTimeout(() => {
			this.component.classList.remove("guide-item--active");
			handler();
			this.guideBox.style.transform = "scale(1, 1)";
		}, 300);
	}

	finishTour = () => {
		document.body.style.overflowY = "auto";
		this.overlay.style.opacity = 0;

		document.querySelector(".guided-tour__box").style.opacity = 0;
		window.scrollTo(0, 0);

		setTimeout(() => {
			this.component.classList.remove("guide-item--active");
			this.componentDidUpdate = null;
			this.overlay.parentNode.removeChild(this.overlay);
			this.setState({
				step: 0,
				ready: false
			})
		}, 500)
	}

	click(simulate) {
		simulate
			? setTimeout(() => {
				this.component.click(); 
				this.component.classList.add("guide-item--active");
			}, 5)
			: null;

		return simulate;
	}

	position(position) {
		const { top, right, bottom, left } = this.component.getBoundingClientRect(),

			  Yoffset = window.pageYOffset,
			  gutter = 20,

			  componentWidth = right - left,
			  componentHeight = bottom - top,
			  guideBoxWidth = 430,
			  guideBoxHeight = 200,
			  carretWidth = 30,
			  carretHeight = 20;
			  
		// Center coordinates
		var boxX = left + componentWidth / 2 - guideBoxWidth / 2,
			boxY = top + componentHeight / 2 - guideBoxHeight / 2 + Yoffset,
			carretX = guideBoxWidth / 2 - carretWidth / 2,
			carretY = guideBoxHeight / 2 - carretHeight / 2,
			rotation = 0;

		switch (position) {
			case "right":
				boxX += componentWidth / 2 + guideBoxWidth / 2 + gutter;
				carretX -= guideBoxWidth / 2 + carretWidth / 2 - 10;
				rotation += 90;
				break;

			case "bottom":
				boxY += componentHeight / 2 + guideBoxHeight / 2 + gutter;
				carretY -= guideBoxHeight / 2 + carretHeight / 2 - 5;
				rotation += 180;
				break;

			case "left":
				boxX -= componentWidth / 2 + guideBoxWidth / 2 + gutter;
				carretX += guideBoxWidth / 2 + carretWidth / 2 - 10;
				rotation += 270;
				break;

			default: // TOP
				boxY -= componentHeight / 2 + guideBoxHeight / 2 + gutter;
				carretY += guideBoxHeight / 2 + carretHeight / 2 - 5;
				break;
		}

		// Reposition box if it goes outside the window
		if (boxX + guideBoxWidth > window.innerWidth) {
			let diff = window.innerWidth - boxX - guideBoxWidth;
			boxX += diff;
			carretX -= diff;
		}
		
		return {
			box: {
				left: boxX,
				top: boxY
			},
			carret: {
				left: carretX,
				top: carretY,
				transform: `rotate(${rotation}deg)`
			}
		}
	}

	isFixed = (isFixed) => {
		if (typeof isFixed === "boolean") {
			return isFixed
		}
		return false
	}

	handleOptions = (options) => {
		let modifiers = {};

		Object.keys(options).map((key) => {
			modifiers[key] = this[key](options[key]);
		})

		return modifiers;
	}

	initialize = () => {	
		document.body.style.overflowY = "hidden";
		window.scrollTo(0, 0);

		this.overlay = document.createElement("div");
		this.overlay.classList.add("guided-tour__fixed-el");
		
		this.componentDidUpdate = () => {
			this.state.sequence[this.state.step].component.scrollIntoView({block: "start"});
			
			if (!this.modifiers.isFixed) {
				window.scrollBy(0, -300);
			}

			this.progressBar.style.width = 100 * this.state.step / this.state.sequence.length + 100 / this.state.sequence.length + "%";
		} 
		
		if (this.state.sequence.length === 0) {
			var sequence =	this.prioritizeSequence(this.store, this.priorityStore);

			// Makes sure that the last element of the sequence is pointing at the tour trigger
			sequence.push({component: document.querySelector(".guided-tour-trigger"), options: {position: "bottom", isFixed: true}});

			this.setState({
				sequence: sequence,
				ready: true
			});
			return;
		}
		this.setState({
			ready: true
		});
	}

	render = () => {
		if (!this.state.ready) {
			return null;
		}
		
		this.component = this.state.sequence[this.state.step].component;
		this.component.parentNode.prepend(this.overlay);
		this.component.classList.add("guide-item--active");
		
		this.modifiers = this.handleOptions(this.state.sequence[this.state.step].options);

		return (
			<div className="guided-tour" ref={(el) => {this.guidedTour = el}}>
				<div>
					<div className="guided-tour__box" style={this.modifiers.position.box} ref={(el) => {this.guideBox = el}}>
						<img src={router.url("img/icons/arrow-down-white.svg")} alt="SEO infographic" className="guided-tour__box__carret" style={this.modifiers.position.carret}/>
						<div className="guided-tour__box__description">
							{this.sequenceContents[this.state.step]}
						</div>
						<br/>
						<p>step {this.state.step + 1} / {this.state.sequence.length}</p>
						<div className="guided-tour__box__progress-bar" ref={e => this.progressBar = e}>
							<div className="guided-tour__box__progress-bar__fill"></div>
						</div>
						<br/>
						<div className="guided-tour__box__buttons">
							<p className="button" onClick={this.prev}>Prev</p>
							<p className="button" onClick={this.next}>{this.state.step == this.state.sequence.length - 1 ? "Finish" : "Next"}</p>
						</div>
						<br/>
						<div onClick={this.finishTour} className="guided-tour__box__close"><p>close</p></div>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = GuidedTour;
