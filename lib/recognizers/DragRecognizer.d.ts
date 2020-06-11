import CoordinatesRecognizer from './CoordinatesRecognizer';
import Controller from '../Controller';
import { UseGestureEvent, IngKey } from '../types';
export default class DragRecognizer extends CoordinatesRecognizer<'drag'> {
    ingKey: IngKey;
    wasTouch: boolean;
    constructor(controller: Controller, args: any[]);
    private isEventTypeTouch;
    private dragShouldStart;
    onDragStart: (event: UseGestureEvent) => void;
    startDrag(event: UseGestureEvent): void;
    onDragChange: (event: UseGestureEvent) => void;
    onDragEnd: (event: UseGestureEvent) => void;
    clean: () => void;
    onCancel: () => void;
    addBindings(): void;
}
