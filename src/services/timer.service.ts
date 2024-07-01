import { BehaviorSubject } from 'rxjs';
import { getStartTime } from '../helpers/dateTime.ts';

class TimerService {
	private timeFlowing$$ = new BehaviorSubject<boolean>(!!getStartTime());

	startTimer = () => {
		this.timeFlowing$$.next(true);
	};

	resetTimer = () => {
		this.timeFlowing$$.next(false);
	};

	timeState = () => this.timeFlowing$$.asObservable();
}

const timerService = new TimerService();
export default timerService;
