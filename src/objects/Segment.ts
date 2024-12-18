import { Color } from "p5";
import { Line } from "./Line";
import { LinePoint } from "./LinePoint";
import * as Tone from "tone"; 

export class Segment {

    public coordinates: {x:number,y:number}[] = [];

    protected rgb: Color;

    public get left() {
        return this.coordinates[0].x;
    }

    protected get p5() {
        return this.Line.manager.p5;
    }

    protected osc?: Tone.Oscillator;
    protected gain?: Tone.Gain;

    protected constructor(
        protected Line: Line,
        protected pointer?: LinePoint
    ) {
        this.rgb = this.p5.color( this.c(), this.c(), this.c() );
    }

    protected c() {
        return Math.floor( Math.random() * 255 );
    }

    public static initFromPoint( line: Line, point: LinePoint ): Segment {
        const item = new Segment( line, point );
        item.storePoint( point );
        return item;
    }

    protected storePoint(
        point: LinePoint
    ) {
        this.coordinates.push( {
            x: point.x,
            y: point.y
        } );
    }

    public analysePointer() {

        if ( this.pointer === undefined ) {
            return;
        }


        const result = this.pointer.analysePoint();

        if ( result.newSegmentFrom !== undefined ) {
            const segment = Segment.initFromPoint( this.Line, result.newSegmentFrom );
            segment.analysePointer();
            this.Line.segments.push( segment );
        }

        if ( result.nextInLine !== undefined ) {
            this.storePoint( result.nextInLine );
            this.pointer = result.nextInLine;
            this.analysePointer();
        } else {
            this.pointer = undefined;
            this.onSegmentEnd();
        }

    }

    onSegmentEnd() {
        this.coordinates = this.coordinates.sort( (a,b) => {
            return a.x - b.x;
        } );

        this.coordinates = this.coordinates.map( c => {
            return {
                x: Math.floor( c.x ),
                y: Math.floor( c.y )
            }
        } );
    }

    draw() {

        this.coordinates.forEach( coordinate => {

            this.p5.push();
            this.p5.translate( coordinate.x, coordinate.y );
            this.p5.ellipseMode( this.p5.CENTER );
            this.p5.fill( this.rgb );
            this.p5.circle( 0, 0, this.Line.width );
            this.p5.pop();

        } );

    }

    start(){

        const initialFrequency = this.yToFrequency( this.coordinates[0].y );

        console.log( initialFrequency );

        this.osc = new Tone.Oscillator( initialFrequency, "sine" );

        this.gain = new Tone.Gain( 1 ).toDestination();
        this.osc.connect( this.gain );

        this.osc.start();

    }

    public update( ms: number ) {

        const affectedPoint = this.coordinates.findIndex( p => p.x === ms );

        if ( affectedPoint === 0 ) {
            this.start();
        }

        else if ( affectedPoint > 0 ) {
            const nextPointIndex = affectedPoint + 1;
            const nextPoint = this.coordinates[ nextPointIndex ];

            if ( nextPoint ) {

                const currentTime = Tone.now();

                const currentTimeInMs = this.coordinates[ affectedPoint ].x;

                const nextTimeInMs = nextPoint.x;

                const differenceInMs = nextTimeInMs - currentTimeInMs;

                const differenceInS = differenceInMs / 1000;

                const timeInSeconds = nextPoint.y / 1000;

                const timeDifference = 0.1;

                const newFreq = this.yToFrequency( nextPoint.y );

                this.osc.frequency.linearRampToValueAtTime( newFreq, 1 );

                // this.gain.gain.linearRampToValueAtTime( newFreq, differenceInS );

                console.log( "frekvence", newFreq, timeDifference, {
                    currentTime, timeInSeconds, differenceInMs,
                    finalresult: differenceInMs / 1000
                } );

            } else {

                this.gain.gain.linearRampToValueAtTime( 0, 1 );

            }

        }

    }

    protected yToFrequency( y: number ) {

        const percent = (this.p5.height - y) / this.p5.height;

        const min = 20;
        const max = 300;

        return min + ( percent * ( max - min ) );

    }


    

}