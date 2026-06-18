
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/blog" | "/admin/dashboard" | "/admin/database" | "/admin/footer" | "/admin/forms" | "/admin/login" | "/admin/logs" | "/admin/media" | "/admin/navigation" | "/admin/pages" | "/admin/pages/[id]" | "/admin/roles" | "/admin/seo" | "/admin/settings" | "/admin/users" | "/api" | "/api/robots.txt" | "/api/sitemap.xml" | "/blog" | "/blog/[slug]" | "/contact" | "/[slug]";
		RouteParams(): {
			"/admin/pages/[id]": { id: string };
			"/blog/[slug]": { slug: string };
			"/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined; slug?: string | undefined };
			"/admin": { id?: string | undefined };
			"/admin/blog": Record<string, never>;
			"/admin/dashboard": Record<string, never>;
			"/admin/database": Record<string, never>;
			"/admin/footer": Record<string, never>;
			"/admin/forms": Record<string, never>;
			"/admin/login": Record<string, never>;
			"/admin/logs": Record<string, never>;
			"/admin/media": Record<string, never>;
			"/admin/navigation": Record<string, never>;
			"/admin/pages": { id?: string | undefined };
			"/admin/pages/[id]": { id: string };
			"/admin/roles": Record<string, never>;
			"/admin/seo": Record<string, never>;
			"/admin/settings": Record<string, never>;
			"/admin/users": Record<string, never>;
			"/api": Record<string, never>;
			"/api/robots.txt": Record<string, never>;
			"/api/sitemap.xml": Record<string, never>;
			"/blog": { slug?: string | undefined };
			"/blog/[slug]": { slug: string };
			"/contact": Record<string, never>;
			"/[slug]": { slug: string }
		};
		Pathname(): "/" | "/admin/blog" | "/admin/dashboard" | "/admin/database" | "/admin/footer" | "/admin/forms" | "/admin/login" | "/admin/logs" | "/admin/media" | "/admin/navigation" | "/admin/pages" | `/admin/pages/${string}` & {} | "/admin/roles" | "/admin/seo" | "/admin/settings" | "/admin/users" | "/api/robots.txt" | "/api/sitemap.xml" | "/blog" | `/blog/${string}` & {} | "/contact" | `/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}