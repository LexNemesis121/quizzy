import { BehaviorSubject } from 'rxjs';

class TimerService {
	private timeFlowing$$ = new BehaviorSubject<boolean>(false);

	startTimer = () => {
		console.log('called');
		this.timeFlowing$$.next(true);
	}

	resetTimer = () => {
		this.timeFlowing$$.next(false);
	}

	timeState = () => this.timeFlowing$$.asObservable()
}

const timerService = new TimerService();
export default timerService;
