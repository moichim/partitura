import { Color } from "p5";
import { LinePoint } from "./LinePoint";
import { Manager } from "./Manager";
import { Segment } from "./Segment";
type P5 = import('p5');

export class Line {

    public width: number = 10;

    protected points: LinePoint[] = []

    public segments: Segment[] = []


    public get lastPoint() {
        if ( this.points.length === 0 ) return undefined;
        return this.points[ this.points.length - 1 ];
    }

    protected get leftmostPoint() {
        if ( this.points.length === 0 ) return undefined;
        return this.points.reduce( (state, current) => {
            if ( current.x < state.x ) return current;
            return state;
        }, this.points[0] );
    }

    protected pointExistsAtPlace(
        x: number,
        y: number
    ) {

        let exists = false;

        this.points.forEach( point => {
            if ( exists === false ) {
                if ( point.isWithin( x, y ) )
                    exists = true;
            }
        } );

        return exists;

    }

    protected constructor(
        public color: Color,
        public manager: Manager
    ) {

    }

    public addPoint(
        x: number,
        y: number
    ) {
        if ( ! this.pointExistsAtPlace( x, y ) ) {
            const point = new LinePoint( this, x, y );
            this.lastPoint?.setNextPoint( point );
            this.points.push( point );
        }
    }

    public static initAt(
        manager: Manager,
        color: Color,
        x: number,
        y: number
    ): Line {
        const item = new Line( color, manager );
        item.addPoint( x, y );
        return item;
    }

    public finish() {

        console.log( "bod nejvíce vlevo", this.leftmostPoint );

        const segment = Segment.initFromPoint( this, this.points[0] );
        segment.analysePointer();
        this.segments.push( segment );

        this.segments = this.segments.sort( (a,b) => {
            return a.left - b.left;
        } );

        /*
        if ( this.leftmostPoint !== undefined ) {
            const segment = Segment.initFromPoint( this, this.leftmostPoint );
            segment.analysePointer();
            this.segments.push( segment );
        }
        */

        console.log( "dostal jsem tyto segmenty", this.segments );


    }

    public draw() {

        this.points.forEach( point => point.draw() );

        this.segments.forEach( segment => segment.draw() );

    }

    public cropSegments() {

        

    }




}