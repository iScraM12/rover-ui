import { Coordinate } from '../../model/coordinate';
import { RoverSimulatorService } from '../../service/rover-simulator.service';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  of,
  timer,
  zip,
  Observable,
  BehaviorSubject,
  ReplaySubject,
  from,
} from 'rxjs';
import {
  map,
  take,
  startWith,
  filter,
  switchMap,
  tap,
  reduce,
} from 'rxjs/operators';
import { CoordinateCanvasConversionService } from 'src/app/service/coordinate-canvas-conversion.service';
import { CanvasRoverService } from 'src/app/service/canvas-rover.service';

@Component({
  selector: 'app-visual-rover',
  templateUrl: './visual-rover.component.html',
  styleUrls: ['./visual-rover.component.css'],
})
export class VisualRoverComponent implements OnInit, AfterViewInit {
  public commands = '';

  @ViewChild('roverAreaCanvas') public roverAreaCanvas: ElementRef<
    HTMLCanvasElement
  >;
  @ViewChild('roverCanvas') public roverCanvas: ElementRef<HTMLCanvasElement>;

  private roverAreaContext: CanvasRenderingContext2D;
  private roverContext: CanvasRenderingContext2D;

  @Input() public roverAreaWwidth = 666;
  @Input() public roverAreaHeight = 500;
  @Input() public remoteRoverAreaWidth = 30;
  @Input() public removeRoverAreaHeight = 20;

  @Input() public roverSize = 20;
  @Input() public roverLegacyPositionSize = 6;
  @Input() public orientationRoverSize = 100;
  @Input() public gridColor = '#dddddd';
  @Input() public roverColor = '#ff7f00';
  @Input() public roverLegacyPositionColor = '#888';

  constructor(
    private canvasRoverService: CanvasRoverService,
    private coordinateCanvasConversionService: CoordinateCanvasConversionService,
    private roverSimulatorService: RoverSimulatorService
  ) {}

  ngOnInit() {}

  public ngAfterViewInit(): void {
    const roverAreaCanvasElement: HTMLCanvasElement = this.roverAreaCanvas
      .nativeElement;
    this.roverAreaContext = roverAreaCanvasElement.getContext('2d');
    roverAreaCanvasElement.width = this.roverAreaWwidth;
    roverAreaCanvasElement.height = this.roverAreaHeight;

    const roverCanvasElement: HTMLCanvasElement = this.roverCanvas
      .nativeElement;
    this.roverContext = roverCanvasElement.getContext('2d');
    roverCanvasElement.width = this.orientationRoverSize;
    roverCanvasElement.height = this.orientationRoverSize;
  }

  public simulateRoverCommands(): void {
    const startAt = null as Coordinate;

    console.log(this.commands);
    const roverCommands = [...this.commands].map((commandChar) => {
      switch (commandChar) {
        case 'f':
          return 'MOVE_FORWARD';
        case 'b':
          return 'MOVE_BACKWARD';
        case 'r':
          return 'ROTATE_RIGHT';
        case 'l':
          return 'ROTATE_LEFT';
        default:
          return 'MOVE_FORWARD';
      }
    });
    console.log(roverCommands);

    const lastCoordinateSubject = this.commandsToCoordinates(roverCommands);

    const roverMovements = this.asDelayedObservable(
      this.roverAreaContext,
      lastCoordinateSubject,
      startAt,
      500,
      roverCommands
    );
    this.drawRoverOrientation(this.roverContext, roverMovements);
    this.drawPositions(this.roverAreaContext, roverMovements);
  }

  private commandsToCoordinates(
    roverCommands: string[]
  ): Observable<Coordinate> {
    const lastCoordinateSubject = new BehaviorSubject<Coordinate>({
      positionHorizontal: 0,
      positionVertical: 0,
      orientationAngle: 0,
    } as Coordinate);

    const coordinates = zip(
      from(roverCommands),
      lastCoordinateSubject.asObservable()
    )
      .pipe(
        switchMap(([command, lastCoordinate]) => {
          return this.roverSimulatorService.simulateCommand(
            command,
            lastCoordinate
          );
        }),
        tap((smth) => console.log(smth))
      )
      .subscribe((coordinate) => lastCoordinateSubject.next(coordinate));

    return lastCoordinateSubject.asObservable();
  }

  private asDelayedObservable(
    ctx: CanvasRenderingContext2D,
    roverCoordinates: Observable<Coordinate>,
    startAt: Coordinate,
    delayDuration: number,
    roverCommands: string[]
  ) {
    const canvasCoordinates = roverCoordinates.pipe(
      map((coordinate) => this.mapToCanvasCoordinate(ctx, coordinate))
    );
    const lastCoordinates = canvasCoordinates.pipe(
      startWith(this.mapToCanvasCoordinate(ctx, startAt))
    );

    return zip(
      lastCoordinates,
      canvasCoordinates,
      timer(0, delayDuration).pipe(take(roverCommands.length + 1))
    ).pipe(
      map(([coordinateFrom, coordinateTo, _]) => [
        coordinateFrom,
        coordinateTo,
      ]),
      tap(([coordinateFrom, coordinateTo]) => console.log(coordinateTo))
    );
  }

  private drawRoverOrientation(
    ctx: CanvasRenderingContext2D,
    roverMovements: Observable<Coordinate[]>
  ) {
    roverMovements
      .pipe(
        filter(
          ([coordinateFrom, coordinateTo]) =>
            coordinateFrom?.orientationAngle !== coordinateTo?.orientationAngle
        )
      )
      .subscribe(([coordinateFrom, coordinateTo]) => {
        this.canvasRoverService.cleanContext(ctx);

        const canvasCenterX = ctx.canvas.width / 2;
        const canvasCenterY = ctx.canvas.height / 2;

        this.canvasRoverService.drawRover(
          ctx,
          coordinateTo.orientationAngle,
          (ctx.canvas.width / 10) * 6,
          this.roverColor,
          canvasCenterX,
          canvasCenterY
        );
        this.canvasRoverService.drawRover(
          ctx,
          coordinateTo.orientationAngle,
          (ctx.canvas.width / 10) * 3,
          '#000000',
          canvasCenterX,
          canvasCenterY
        );
      });
  }

  private drawPositions(
    ctx: CanvasRenderingContext2D,
    roverMovements: Observable<Coordinate[]>
  ) {
    const legacyPositions = [] as Coordinate[];
    roverMovements.subscribe(([coordinateFrom, coordinateTo]) => {
      this.canvasRoverService.cleanContext(ctx);
      this.canvasRoverService.drawGrid(ctx, this.gridColor);

      legacyPositions
        .filter(
          (legacyPosition) =>
            legacyPosition.positionHorizontal !==
              coordinateTo.positionHorizontal ||
            legacyPosition.positionVertical !== coordinateTo.positionVertical
        )
        .forEach((legacyPosition) => {
          this.canvasRoverService.drawLegacyPosition(
            this.roverAreaContext,
            legacyPosition,
            this.roverLegacyPositionSize,
            this.roverLegacyPositionColor
          );
        });

      legacyPositions.push(coordinateTo);

      this.canvasRoverService.drawRover(
        ctx,
        coordinateTo.orientationAngle,
        this.roverSize,
        this.roverColor,
        coordinateTo.positionHorizontal,
        coordinateTo.positionVertical
      );
    });
  }

  private mapToCanvasCoordinate(
    ctx: CanvasRenderingContext2D,
    value: Coordinate
  ): Coordinate {
    return this.coordinateCanvasConversionService.toCanvasCoordinate(
      value,
      ctx.canvas.width,
      ctx.canvas.height,
      this.remoteRoverAreaWidth,
      this.removeRoverAreaHeight
    );
  }
}
