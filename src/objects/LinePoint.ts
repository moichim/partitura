import { Line } from "./Line";

export class LinePoint {

    public nextPoint?: LinePoint;
    protected previousPoint?: LinePoint;

    public get p5() {
        return this.line.manager.p5;
    }

    constructor(
        public readonly line: Line,
        public x: number,
        public y: number
    ) {
        this.previousPoint = this.line.lastPoint;
    }

    isWithin(
        x: number,
        y: number
    ) {

        const w = this.line.width  / 2;
        return x > ( this.x - w )
            && x < ( this.x + w )
            && y > ( this.y - w )
            && y < ( this.y + w );
    }

    public draw() {

        this.p5.push();

        this.p5.translate( this.x, this.y );

        this.p5.noStroke();

        this.p5.fill( this.line.color );

        this.p5.ellipseMode( this.p5.CENTER );

        this.p5.circle( 0, 0, this.line.width );

        if ( this.nextPoint !== undefined ) {

            const diff = {
                x: this.nextPoint.x - this.x,
                y: this.nextPoint.y - this.y
            };

            this.p5.stroke( this.line.color );
            this.p5.noFill();

            this.p5.line( 0, 0, diff.x, diff.y );

        }


        this.p5.pop();

    }

    setNextPoint(
        point: LinePoint
    ) {
        this.nextPoint = point;
    }

    public static placeAt() {}

    public isLeftOf( point: LinePoint ) {
        return this.x < point.x;
    }

    public isRightOf( point: LinePoint ) {
        return this.x >= point.x;
    }


    public leftNeighbours(): LinePoint[] {
        const result: LinePoint[] = [];

        if ( this.previousPoint && this.isRightOf( this.previousPoint ) ) {
            result.push( this.previousPoint );
        }

        if ( this.nextPoint && this.isRightOf( this.nextPoint ) ) {
            result.push( this.nextPoint );
        }

        return result;
    }

    public rightNeighbours(): LinePoint[] {
        const result: LinePoint[] = [];

        if ( this.previousPoint !== undefined && this.isLeftOf( this.previousPoint ) ) {
            result.push( this.previousPoint );
        }

        if ( this.nextPoint !== undefined && this.isLeftOf( this.nextPoint ) ) {
            result.push( this.nextPoint );
        }

        return result;
    }


    public analysePoint():PointAnalysisResult {


        if ( this.nextPoint === undefined ) {
            return {};
        }

        const right = this.rightNeighbours();
        const left = this.leftNeighbours();

        if ( left.length === 2 || right.length === 2 ) {

            if ( left.length === 2 ) {
                return {
                    newSegmentFrom: left[1]
                }
            } else if ( right.length === 2 ) {
                return {
                    newSegmentFrom: right[1]
                }
            }

        }

        return {
            nextInLine: this.nextPoint
        }

    }

}

type PointAnalysisResult = {
    nextInLine?: LinePoint,
    newSegmentFrom?: LinePoint
}