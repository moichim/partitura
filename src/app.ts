import P5 from "p5";
import "p5/lib/addons/p5.dom";
// import "p5/lib/addons/p5.sound";	// Include if needed
import "./styles.scss";

// DEMO: A sample class implementation
import MyCircle from "./MyCircle";
import { Manager } from "./objects/Manager";

// Creating the sketch itself
const sketch = (p5: P5) => {
	// DEMO: Prepare an array of MyCircle instances
	const myCircles: MyCircle[] = [];

	const manager = new Manager(p5);

	console.log( manager );

	// The sketch setup method 
	p5.setup = () => {

		// Creating and positioning the canvas
		const canvas = p5.createCanvas(1000, 700);

		canvas.parent("app");

		// Configuring the canvas
		p5.background("black");

		p5.frameRate( 100 );

		p5.loop();

	};

	// The sketch draw method
	p5.draw = () => {
		p5.background( "black" );
		manager.update();
		manager.draw();
	};

	p5.mousePressed = () => {
		manager.startLineAt( p5.mouseX, p5.mouseY );
	}

	p5.mouseReleased = () => {
		manager.mouseReleased();
	}

	p5.keyPressed = () => {
		if ( p5.keyCode === p5.ESCAPE ) {
			manager.player.stop();
		} else if ( p5.keyCode === p5.SHIFT ) {
			manager.player.createComposition( manager.lines );
			manager.player.toggle();
		}
	}
};

new P5(sketch);
