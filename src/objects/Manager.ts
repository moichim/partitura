import { Line } from './Line';

import P5 from "p5";
import { Player } from './Player';

export class Manager {

    public lines: Line[] = [];

    protected tick: number = 0;
    protected frequency = 2;

    protected _editingLine?: Line;
    public get editingLine() {
        return this._editingLine;
    }

    protected _drawing: boolean = false;
    public get drawing() { return this._drawing; }

    public player = new Player( this );

    public setEditingLine(
        line: Line
    ) {
        this.editingLine?.finish();
        this._editingLine = line;
    }

    public constructor(
        public readonly p5: P5
    ) {}

    public startLineAt(
        x: number,
        y: number
    ) {
        this._drawing = true;
        const line = Line.initAt( this, this.p5.color( 255 ), x, y );
        this.setEditingLine( line );
        this.lines.push( line );
    }

    public update() {

        this.player.update();

        if ( this.tick === this.frequency ) {

            if ( this.drawing ) {
                this.editingLine.addPoint( this.p5.mouseX, this.p5.mouseY );
            }

            this.tick = 0;

        } else {
            this.tick = this.tick + 1;
        }
    }

    public draw() {
        this.lines.forEach( line => line.draw() );
        this.player.draw();
    }

    mouseReleased() {
        if ( this.drawing ) {
            this._drawing = false;
            this._editingLine.finish();
            this._editingLine = undefined;
        }
    }

}