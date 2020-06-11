import DistanceAngleRecognizer from './DistanceAngleRecognizer';
import Controller from '../Controller';
import { UseGestureEvent, IngKey, Vector2 } from '../types';
import { noop } from '../utils/utils';
import { getGenericEventData, getTwoTouchesEventData } from '../utils/event';

export default class PinchRecognizer extends DistanceAngleRecognizer<'pinch'> {
	ingKey = 'pinching' as IngKey;

	constructor(controller: Controller, args: any[]) {
		super('pinch', controller, args);
	}

	private pinchShouldStart = (event: UseGestureEvent) => {
		const { touches } = getGenericEventData(event);
		return this.enabled && touches === 2 && this.state._active === false;
	};

	onPinchStart = (event: UseGestureEvent) => {
		if (!this.pinchShouldStart(event)) return;

		const { values, origin } = getTwoTouchesEventData(event);

		this.updateSharedState(getGenericEventData(event));

		const startState = {
			...this.getStartGestureState(values, event),
			...this.getGenericPayload(event, true),
		};

		this.updateGestureState({
			...startState,
			...this.getMovement(values, startState),
			origin,
			cancel: () => this.onCancel(),
		});

		this.fireGestureHandler();
	};

	onPinchChange = (event: UseGestureEvent): void => {
		const { canceled, timeStamp, _active } = this.state;
		if (canceled || !_active) return;
		const genericEventData = getGenericEventData(event);
		if (genericEventData.touches !== 2 || event.nativeEvent.timestamp === timeStamp) return;

		this.updateSharedState(genericEventData);

		const { values, origin } = getTwoTouchesEventData(event);
		const kinematics = this.getKinematics(values, event);

		this.updateGestureState({
			...this.getGenericPayload(event),
			...kinematics,
			origin,
			cancel: () => this.onCancel(),
		});

		this.fireGestureHandler();
	};

	onPinchEnd = (event: UseGestureEvent): void => {
		if (!this.state.active) return;
		this.state._active = false;
		this.updateSharedState({ down: false, touches: 0 });

		this.updateGestureState({
			...this.getGenericPayload(event),
			...this.getMovement(this.state.values),
		});
		this.fireGestureHandler();
	};

	onCancel = (): void => {
		this.state._active = false;
		this.updateGestureState({ canceled: true, cancel: noop });
		this.updateSharedState({ down: false, touches: 0 });

		requestAnimationFrame(() => this.fireGestureHandler());
	};

	updateTouchData = (event: UseGestureEvent): void => {
		if (!this.enabled || event.nativeEvent.touches.length !== 2 || !this.state._active) return;
		const { origin } = getTwoTouchesEventData(event);
		this.state.origin = origin;
	};

	addBindings(): void {
		this.controller.addBindings('onTouchStart', this.onPinchStart);
		this.controller.addBindings('onTouchMove', this.onPinchChange);
		this.controller.addBindings(['onTouchEnd', 'onTouchCancel'], this.onPinchEnd);
	}
}
