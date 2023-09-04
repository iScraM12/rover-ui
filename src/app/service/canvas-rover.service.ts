import { Injectable } from '@angular/core';
import { CoordinateCanvasConversionService } from './coordinate-canvas-conversion.service';
import { RotationContext } from '../model/rotation-context';
import { Coordinate } from '../model/coordinate';

@Injectable({
  providedIn: 'root',
})
export class CanvasRoverService {
  constructor(
    private coordinateCanvasConversionService: CoordinateCanvasConversionService
  ) {}

  public cleanContext(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  public drawGrid(ctx: CanvasRenderingContext2D, color: string) {
    ctx.lineCap = 'round';
    this.drawLine(
      ctx,
      0,
      ctx.canvas.height / 2,
      ctx.canvas.width,
      ctx.canvas.height / 2,
      color,
      1
    );
    this.drawLine(
      ctx,
      ctx.canvas.width / 2,
      0,
      ctx.canvas.width / 2,
      ctx.canvas.height,
      color,
      1
    );
  }

  public drawLine(
    ctx: CanvasRenderingContext2D,
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number,
    strokeStyle: string,
    lineWidth: number
  ): void {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(xFrom, yFrom);
    ctx.lineTo(xTo, yTo);
    ctx.stroke();
  }

  public drawLegacyPosition(
    ctx: CanvasRenderingContext2D,
    coordinateTo: Coordinate,
    roverSize: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(
      coordinateTo.positionHorizontal - roverSize / 2,
      coordinateTo.positionVertical - roverSize / 2,
      roverSize,
      roverSize
    );
  }

  public drawRover(
    ctx: CanvasRenderingContext2D,
    angle: number,
    roverHeight: number,
    roverColor: string,
    x: number,
    y: number
  ) {
    const heightBow = (roverHeight / 7) * 4;
    const heightStarboard = (roverHeight / 7) * 3;
    const width = (roverHeight / 7) * 4;

    const rotationContext = {
      angle,
      centerX: x,
      centerY: y,
    } as RotationContext;

    const roverBow = this.coordinateCanvasConversionService.rotatePoint(
      x,
      y - heightBow,
      rotationContext
    );
    const sternStarboard = this.coordinateCanvasConversionService.rotatePoint(
      x + width / 2,
      y + heightStarboard,
      rotationContext
    );
    const sternCenter = this.coordinateCanvasConversionService.rotatePoint(
      x,
      y + roverHeight / 7,
      rotationContext
    );
    const sternPortside = this.coordinateCanvasConversionService.rotatePoint(
      x - width / 2,
      y + heightStarboard,
      rotationContext
    );

    ctx.beginPath();
    ctx.moveTo(roverBow.x, roverBow.y);
    ctx.lineTo(sternStarboard.x, sternStarboard.y);
    ctx.lineTo(sternCenter.x, sternCenter.y);
    ctx.lineTo(sternPortside.x, sternPortside.y);
    ctx.closePath();

    ctx.fillStyle = roverColor;
    ctx.fill();
  }
}
