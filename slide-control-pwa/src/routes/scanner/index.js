import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style.scss';

import QrScanner from 'qr-scanner';
QrScanner.WORKER_PATH = '/assets/qr-scanner-worker.js';

export default class Scanner extends Component {

	scanCode() {

		this.props.showSnackbar(
			'This On-Device-Scanner is an experimental feature and will not work on all devices',
			null,
			6000,
			() => console.warn('woopsie')
		);

		this.scanner = new QrScanner(this.video, result => {
			if (result.split('/')[0] !== 'slide-control-firebase.firebaseapp.com' || result.split('/')[1] !== 'controller') this.props.showSnackbar(
				'Scanned code not readable: "' + result + '"',
				null,
				3500,
				() => console.warn('wait what')
			);
			else if (result.split('/')[2] && !isNaN(parseInt(result.split('/')[2], 10))) {
				this.scanner.stop();
				route(`/controller/${parseInt(result.split('/')[2], 10)}`);
			}
		});
		this.scanner.setInversionMode('invert');
		this.scanner.start();
		this.video.style.display = 'block';
		this.scanWindow.style.display = 'block';
	}

	componentDidMount() {
		if (!window.Worker) this.props.showSnackbar(
			'Seems like your browser does not support WebWorkers, hence cannot read QR codes',
			'BACK',
			7000,
			() => route('/')
		);
		else QrScanner.hasCamera().then(hasCamera => hasCamera ? this.scanCode() : this.props.showSnackbar(
			'Seems like your device has no camera to be accessed',
			'BACK',
			4500,
			() => route('/')
		));
	}

	componentWillUnmount() {
		if (this.scanner) this.scanner.stop();
	}

	render() {
		return (
			<div class={style.scanner}>
				<center class={style.loader}>
					<svg class="{style.loader}" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" stroke="#77bc00">
						<g fill="none" fill-rule="evenodd" stroke-width="2">
							<circle cx="22" cy="22" r="9.99165">
								<animate
									attributeName="r"
									begin="0s" dur="1.8s"
									values="1; 20"
									calcMode="spline"
									keyTimes="0; 1"
									keySplines="0.165, 0.84, 0.44, 1"
									repeatCount="indefinite"
								/>
								<animate
									attributeName="stroke-opacity"
									begin="0s" dur="1.8s"
									values="1; 0"
									calcMode="spline"
									keyTimes="0; 1"
									keySplines="0.3, 0.61, 0.355, 1"
									repeatCount="indefinite"
								/>
							</circle>
							<circle cx="22" cy="22" r="19.2798">
								<animate
									attributeName="r"
									begin="-0.9s" dur="1.8s"
									values="1; 20"
									calcMode="spline"
									keyTimes="0; 1"
									keySplines="0.165, 0.84, 0.44, 1"
									repeatCount="indefinite"
								/>
								<animate
									attributeName="stroke-opacity"
									begin="-0.9s" dur="1.8s"
									values="1; 0"
									calcMode="spline"
									keyTimes="0; 1"
									keySplines="0.3, 0.61, 0.355, 1"
									repeatCount="indefinite"
								/>
							</circle>
						</g>
					</svg>
				</center>
				<video muted playsinline ref={video => this.video = video} />
				<div ref={div => this.scanWindow = div} class={style.scanWindow} />
			</div>
		);
	}
}