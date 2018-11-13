import express from 'express';
import helmet from 'helmet';
import RateLimit from 'express-slow-down';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';

export default {
	init () {
		CR.app = express();
		if (CR.conf.trustLocalProxy) {
			// Use the real IP of loopbacks. For users behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
			CR.app.set('trust proxy', 'loopback');
			CR.app.enable('trust proxy');
		}

		if (CR.argv.helmet) {
			CR.app.use(helmet());
		} else {
			CR.log.warn("Helmet malŝaltita");
		}

		if (!CR.argv.cache) {
			CR.cacheEnabled = false;
			CR.log.warn("Cache malŝaltita");
		}

		let limiterMax = 0;
		if (CR.argv.limiter) {
			limiterMax = this.conf.loginLimit.max;
		} else {
			CR.log.warn("Ensalutlimigo malŝaltita");
		}
		CR.limiter = new RateLimit({
			windowMs: CR.conf.loginLimit.time * 1000,
			max: limiterMax,
			delayMs: CR.conf.loginLimit.delay,
			onLimitReached: (req, res, next) => {
				res.setHeader('Retry-After', Math.ceil(CR.conf.loginLimit.time));
				next(new Error('tooManyRequests'))
			},
			message: 'Tro da ensalutprovoj, bonvolu reprovi poste.'
		});

		CR.app.use(cookieParser());
		CR.app.use(bodyParser.urlencoded({ extended: true }));
		CR.app.use(bodyParser.json());

		if (!CR.conf.sessionSecret) {
			CR.log.error("Neniu session secret difinita en agordoj");
			process.exit(1);
		}
		CR.app.use(expressSession({
			resave: false,
			saveUninitialized: false,
			secret: CR.conf.sessionSecret,
			name: 'CR_SESSION'
		}));

		CR.app.use(passport.initialize());
		CR.app.use(passport.session());
		CR.app.use(flash());

		CR.app.listen(CR.conf.servers.http.port, () => {
			CR.log.info("HTTP-servilo pretas je :%s", CR.conf.servers.http.port);
		});
	}
}
