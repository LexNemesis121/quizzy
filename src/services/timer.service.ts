import { BehaviorSubject } from 'rxjs';

class TimerService {
	private timeFlowing$$ = new BehaviorSubject<boolean>(false);

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
