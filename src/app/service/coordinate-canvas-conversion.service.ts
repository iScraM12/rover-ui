import { RotationContext } from '../model/rotation-context';
import { Coordinate } from '../model/coordinate';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoordinateCanvasConversionService {
  public toCanvasCoordinate(
    roverCoordinate: Coordinate,
    canvasWidth: number,
    canvasHeight: number,
    roverAreaWidth: number,
    roverAreaHeight: number
  ): Coordinate {
    if (!roverCoordinate) {
      return null;
    }

    const relativeHorizontal =
      roverCoordinate.positionHorizontal / roverAreaWidth;
    const relativeVertical = roverCoordinate.positionVertical / roverAreaHeight;

    const canvasWidthCenter = canvasWidth / 2;
    const canvasHeightCenter = canvasHeight / 2;

    return {
      positionHorizontal:
        relativeHorizontal * canvasWidthCenter + canvasWidthCenter,
      positionVertical:
        canvasHeight -
        relativeVertical * canvasHeightCenter -
        canvasHeightCenter,
      orientationAngle: roverCoordinate.orientationAngle,
    } as Coordinate;
  }

  public rotatePoint(x: number, y: number, rotationContext: RotationContext) {
    // https://www.matheboard.de/archive/460078/thread.html

    const radianMeasure = (rotationContext.angle / 180) * Math.PI;

    return {
      x:
        rotationContext.centerX +
        (x - rotationContext.centerX) * Math.cos(radianMeasure) -
        (y - rotationContext.centerY) * Math.sin(radianMeasure),
      y:
        rotationContext.centerY +
        (x - rotationContext.centerX) * Math.sin(radianMeasure) +
        (y - rotationContext.centerY) * Math.cos(radianMeasure),
    };
  }
}
