import { Line } from "./Line";
import { Manager } from "./Manager";
import { Segment } from "./Segment";

export class Layer {

    public instrument: Line;
    public readonly segments: Segment[]

    constructor(
        line: Line
    ) {
        this.instrument = line;
        this.segments = line.segments;
    }
}

export class Player {

    public composition: Layer[] = [];

    public ms: number = 0;

    public playing = false;

    public get p5() {
        return this.manager.p5;
    }


    public constructor(
        public readonly manager: Manager
    ) {

    }

    public createComposition(
        lines: Line[]
    ) {
        this.composition = lines.map( line => new Layer(line) );
        this.ms = 0;
    }

    update() {
        if ( this.playing ) {
            if ( this.ms < this.manager.p5.width ) {
                this.ms = this.ms + 1;

                this.composition.forEach( layer => {
                    layer.segments.forEach( segment => {
                        segment.update( this.ms );
                    } );
                } );


            } else {
                this.playing = false;
                this.ms = 0;
            }
        }
    }

    public draw() {

        this.p5.push();
        this.p5.translate( this.ms, 0 );
        this.p5.stroke( this.p5.color( 133,244, 0 ) );
        this.p5.line( 0, 0, 0, this.p5.height );
        this.p5.pop();


        this.composition.forEach( layer => {
            layer.segments.forEach( segment => {
                segment.coordinates.forEach( point => {
                    if ( point.x < this.ms ) {
                        this.p5.push();

                        this.p5.translate( point.x, point.y );

                        this.p5.ellipseMode( this.p5.CENTER );

                        this.p5.fill( 0, 255, 255 );
                        this.p5.noStroke();

                        this.p5.circle( 0,0, 20 );

                        this.p5.pop();
                    }
                } );
            } );
        } );

    }

    toggle() {
        this.playing = ! this.playing;
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    stop() {
        this.playing = false;
        this.ms = 0;
    }

}