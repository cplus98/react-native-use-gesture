import DistanceAngleRecognizer from './DistanceAngleRecognizer';
import Controller from '../Controller';
import { UseGestureEvent, IngKey } from '../types';
export default class PinchRecognizer extends DistanceAngleRecognizer<'pinch'> {
    ingKey: IngKey;
    constructor(controller: Controller, args: any[]);
    private pinchShouldStart;
    onPinchStart: (event: UseGestureEvent) => void;
    onPinchChange: (event: UseGestureEvent) => void;
    onPinchEnd: (event: UseGestureEvent) => void;
    onCancel: () => void;
    updateTouchData: (event: UseGestureEvent) => void;
    addBindings(): void;
}
