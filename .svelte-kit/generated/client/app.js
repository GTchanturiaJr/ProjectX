// in dev, this makes Vite inject its client as this module's first dependency,
// so that global constant replacements are installed before any other module
// (including user hooks) evaluates. In build it's inert.
import.meta.hot;




export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22')
];

export const server_loads = [];

export const dictionary = {
		"/": [~3],
		"/admin/blog": [5,[2]],
		"/admin/dashboard": [6,[2]],
		"/admin/database": [7,[2]],
		"/admin/footer": [8,[2]],
		"/admin/forms": [9,[2]],
		"/admin/login": [10,[2]],
		"/admin/logs": [11,[2]],
		"/admin/media": [12,[2]],
		"/admin/navigation": [13,[2]],
		"/admin/pages": [14,[2]],
		"/admin/pages/[id]": [15,[2]],
		"/admin/roles": [16,[2]],
		"/admin/seo": [17,[2]],
		"/admin/settings": [18,[2]],
		"/admin/users": [19,[2]],
		"/blog": [~20],
		"/blog/[slug]": [~21],
		"/contact": [~22],
		"/[slug]": [~4]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';