# React-guided-tour
Component that walks the user through the application

## USAGE:
In order to make use of the component you need to register application element with the help of the "register()" 
method which takes a DOM element and an "options" object
NOTE* -> It's recommended that you register the tour item inside the "componentDidMount" hook of the curently registered item
in order to make sure that the target component has been created

### AVAILABLE OPTIONS: 
position: "top" || "right" || "bottom" || "left" <- Positions the guide box relative to the target element
click: bool <- Simulates a click on component if true
step: int <- Choose in which step of the tour should the component be highlighted
isFixed: bool <- Tells the component if the target component is fixed in order to handle window scrolling accordingly

### STARTING THE TOUR
In order to start the tour you need to call the "initialize" method which will setup the tour

### EXTEDING AVAILABLE OPTIONS
if the component needs to have additional options, the name of key that is holding the option value has to be matched with
the name of the method that handles the logic

EXAMPLE: `{confirmExit: True}`
		`confirmExit( optionValue ) {
			/* Handle options */
		}`

