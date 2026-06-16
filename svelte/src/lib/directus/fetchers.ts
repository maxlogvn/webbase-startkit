// ─── Import ──────────────────────────────────────────────────────────────────

import {
	type BlockPost,
	type PageBlock,
	type Post,
	type Schema,
	type Page,
	type DirectusUser
} from '../types/directus-schema';
import { useDirectus } from './directus';
import {
	type QueryFilter,
	aggregate,
	readItem,
	readSingleton,
	withToken,
	readItems
} from '@directus/sdk';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface AuthProvider {
	id: string;
	provider: string;
	label: string;
	icon: string;
	enabled: boolean;
	sort: number;
	color?: string | null;
}

// ─── Constants: Page fields ──────────────────────────────────────────────────
const pageFields = [
	'title',
	'seo',
	'id',
	{
		blocks: [
			'id',
			'background',
			'collection',
			'item',
			'sort',
			'hide_block',
			{
				item: {
					block_richtext: ['id', 'tagline', 'headline', 'content', 'alignment'],
					block_gallery: [
						'id',
						'tagline',
						'headline',
						{ items: ['id', 'directus_file', 'sort'] as any }
					],
					block_pricing: [
						'id',
						'tagline',
						'headline',
						{
							pricing_cards: [
								'id',
								'title',
								'description',
								'price',
								'badge',
								'features',
								'is_highlighted',
								{
									button: [
										'id',
										'label',
										'variant',
										'url',
										'type',
										{ page: ['permalink'] },
										{ post: ['slug'] }
									]
								}
							]
						}
					],
					block_hero: [
						'id',
						'tagline',
						'headline',
						'description',
						'layout',
						'image',
						{
							button_group: [
								'id',
								{
									buttons: [
										'id',
										'label',
										'variant',
										'url',
										'type',
										{ page: ['permalink'] },
										{ post: ['slug'] }
									]
								}
							]
						}
					],
					block_posts: ['id', 'tagline', 'headline', 'collection', 'limit'],
					block_form: [
						'id',
						'tagline',
						'headline',
						{
							form: [
								'id',
								'title',
								'submit_label',
								'success_message',
								'on_success',
								'success_redirect_url',
								'is_active',
								{
									fields: [
										'id',
										'name',
										'type',
										'label',
										'placeholder',
										'help',
										'validation',
										'width',
										'choices',
										'required',
										'sort'
									]
								}
							]
						}
					]
				}
			}
		]
	}
] as const;

// ─── Constants: Post fields ──────────────────────────────────────────────────
const postFields = [
	'id',
	'title',
	'content',
	'status',
	'published_at',
	'image',
	'description',
	'slug',
	'seo',
	{
		author: ['id', 'first_name', 'last_name', 'avatar']
	}
] as const;

// ─── Fetchers: Page ──────────────────────────────────────────────────────────

/**
 * Fetches page data by permalink, including all nested blocks and dynamically fetching blog posts if required.
 */
export const fetchPageData = async (
	permalink: string,
	postPage = 1,
	token?: string,
	preview?: boolean
) => {
	const { getDirectus } = useDirectus();
	const directus = getDirectus();

	try {
		const pageData = (await directus.request(
			withToken(
				token as string,
				readItems('pages', {
					filter:
						preview && token
							? { permalink: { _eq: permalink } }
							: { permalink: { _eq: permalink }, status: { _eq: 'published' } },
					limit: 1,
					fields: pageFields,
					deep: {
						blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } }
					}
				})
			)
		)) as Page[];

		if (!pageData.length) {
			throw new Error('Page not found');
		}

		const page = pageData[0];

		// Dynamic Content Enhancement:
		// Some blocks need additional data fetched at runtime
		// This is where we enhance static block data with dynamic content
		if (Array.isArray(page.blocks)) {
			for (const block of page.blocks as PageBlock[]) {
				// Handle dynamic posts blocks - these blocks display a list of posts
				// The posts are fetched dynamically based on the block's configuration
				if (
					block.collection === 'block_posts' &&
					block.item &&
					typeof block.item !== 'string' &&
					'collection' in block.item &&
					block.item.collection === 'posts'
				) {
					const blockPost = block.item as BlockPost;
					const limit = blockPost.limit ?? 6; // Default to 6 posts if no limit specified

					// Fetch the actual posts data for this block
					// Always fetch published posts only (no preview mode for dynamic content)
					const posts: Post[] = await directus.request(
						readItems('posts', {
							fields: ['id', 'title', 'description', 'slug', 'image', 'published_at'],
							filter: { status: { _eq: 'published' } },
							sort: ['-published_at'],
							limit,
							page: postPage
						})
					);

					// Attach the fetched posts to the block for frontend rendering
					(block.item as BlockPost & { posts: Post[] }).posts = posts;
				}
			}
		}

		return page;
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Error('Failed to fetch page data', { cause: error });
	}
};

// ── fetchPageDataById — Fetch page version cụ thể

/**
 * Fetches page data by id and version
 */
export const fetchPageDataById = async (
	id: string,
	version: string,
	token: string | undefined
): Promise<Page> => {
	if (!id || id.trim() === '') {
		throw new Error('Invalid id: id must be a non-empty string');
	}
	if (!version || version.trim() === '') {
		throw new Error('Invalid version: version must be a non-empty string');
	}

	const { getDirectus } = useDirectus();
	const directus = getDirectus();
	try {
		return (await directus.request(
			withToken(
				token as string,
				readItem('pages', id, {
					version,
					fields: pageFields,
					deep: {
						blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } }
					}
				})
			)
		)) as Page;
	} catch (error) {
		console.error('Error fetching versioned page:', error);
		throw new Error('Failed to fetch versioned page', { cause: error });
	}
};

// ── getPageIdByPermalink — Trả id page từ slug

/**
 * Helper function to get page ID by permalink
 */
export const getPageIdByPermalink = async (permalink: string, token: string | undefined) => {
	if (!permalink || permalink.trim() === '') {
		throw new Error('Invalid permalink: permalink must be a non-empty string');
	}

	const { getDirectus } = useDirectus();
	const directus = getDirectus();

	try {
		const pageData = (await directus.request(
			withToken(
				token as string,
				readItems('pages', {
					filter: { permalink: { _eq: permalink } },
					limit: 1,
					fields: ['id']
				})
			)
		)) as Pick<Page, 'id'>[];

		return pageData.length > 0 ? pageData[0].id : null;
	} catch (error) {
		console.error('Error getting page ID:', error);

		return null;
	}
};

// ── getPostIdBySlug — Trả id post từ slug

/**
 * Helper function to get post ID by slug
 */
export const getPostIdBySlug = async (slug: string, token: string | undefined) => {
	if (!slug || slug.trim() === '') {
		throw new Error('Invalid slug: slug must be a non-empty string');
	}

	const { getDirectus } = useDirectus();
	const directus = getDirectus();

	try {
		const postData = (await directus.request(
			withToken(
				token as string,
				readItems('posts', {
					filter: { slug: { _eq: slug } },
					limit: 1,
					fields: ['id']
				})
			)
		)) as Pick<Post, 'id'>[];

		return postData.length > 0 ? postData[0].id : null;
	} catch (error) {
		console.error('Error getting post ID:', error);

		return null;
	}
};

// ─── Fetchers: Post ──────────────────────────────────────────────────────────

// ── fetchPostByIdAndVersion — Fetch post version cụ thể

/**
 * Fetches a single blog post by ID and version
 */
export const fetchPostByIdAndVersion = async (
	id: string,
	version: string,
	slug: string,
	token: string | undefined
): Promise<{ post: Post; relatedPosts: Post[] }> => {
	if (!id || id.trim() === '') {
		throw new Error('Invalid id: id must be a non-empty string');
	}
	if (!version || version.trim() === '') {
		throw new Error('Invalid version: version must be a non-empty string');
	}
	if (!slug || slug.trim() === '') {
		throw new Error('Invalid slug: slug must be a non-empty string');
	}

	const { getDirectus } = useDirectus();
	const directus = getDirectus();

	try {
		const [postData, relatedPosts] = await Promise.all([
			directus.request(
				withToken(
					token as string,
					readItem('posts', id, {
						version,
						fields: postFields
					})
				)
			),
			directus.request(
				readItems('posts', {
					filter: { slug: { _neq: slug }, status: { _eq: 'published' } },
					limit: 2,
					fields: ['id', 'title', 'slug', 'image']
				})
			)
		]);

		return { post: postData as Post, relatedPosts: relatedPosts as Post[] };
	} catch (error) {
		console.error('Error fetching versioned post:', error);
		throw new Error('Failed to fetch versioned post', { cause: error });
	}
};

// ─── Fetchers: Site data ─────────────────────────────────────────────────────

/**
 * Fetches global site data, header navigation, and footer navigation.
 */
export const fetchSiteData = async () => {
	const { getDirectus } = useDirectus();
	const directus = getDirectus();

	try {
		const [globals, headerNavigation, footerNavigation] = await Promise.all([
			directus.request(
				readSingleton('globals', {
					fields: [
						'id',
						'title',
						'description',
						'logo',
						'logo_dark_mode',
						'social_links',
						'accent_color',
						'favicon'
					]
				})
			),
			directus.request(
				readItem('navigation', 'main', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								{
									page: ['permalink'],
									children: ['id', 'title', 'url', { page: ['permalink'] }]
								}
							]
						}
					],
					deep: { items: { _sort: ['sort'] } }
				})
			),
			directus.request(
				readItem('navigation', 'footer', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								{
									page: ['permalink'],
									children: ['id', 'title', 'url', { page: ['permalink'] }]
								}
							]
						}
					]
				})
			)
		]);

		return { globals, headerNavigation, footerNavigation };
	} catch (error) {
		console.error('Error fetching site data:', error);
		throw new Error('Failed to fetch site data', { cause: error });
	}
};

// ── fetchPostBySlug — Fetch post từ slug, có support draft/preview

/**
 * Fetches a single blog post by slug and related blog posts excluding the given ID. Handles live preview mode.
 */
export const fetchPostBySlug = async (
	slug: string,
	options: { draft?: boolean; token?: string }
): Promise<{ post: Post | null; relatedPosts: Post[] }> => {
	const { getDirectus } = useDirectus();
	const directus = getDirectus();
	const { draft, token } = options || {};

	try {
		const filter: QueryFilter<Schema, Post> =
			token || draft
				? { slug: { _eq: slug } }
				: { slug: { _eq: slug }, status: { _eq: 'published' } };

		const [posts, relatedPosts] = await Promise.all([
			directus.request<Post[]>(
				withToken(
					token as string,
					readItems<Schema, 'posts', any>('posts', {
						filter,
						limit: 1,
						fields: postFields
					})
				)
			),
			directus.request<Post[]>(
				withToken(
					token as string,
					readItems<Schema, 'posts', any>('posts', {
						filter: { slug: { _neq: slug }, status: { _eq: 'published' } },
						limit: 2,
						fields: ['id', 'title', 'slug', 'image']
					})
				)
			)
		]);

		const post: Post | null = posts.length > 0 ? (posts[0] as Post) : null;

		return { post, relatedPosts };
	} catch (error) {
		console.error('Error in fetchPostBySlug:', error);
		throw new Error('Failed to fetch blog post and related posts', { cause: error });
	}
};

// ── fetchRelatedPosts — Fetch bài viết liên quan

/**
 * Fetches related blog posts excluding the given ID.
 */
export const fetchRelatedPosts = async (excludeId: string) => {
	const { getDirectus } = useDirectus();
	const directus = getDirectus();

	try {
		const relatedPosts = (await directus.request(
			readItems('posts', {
				filter: { status: { _eq: 'published' }, id: { _neq: excludeId } },
				fields: ['id', 'title', 'image', 'slug'],
				limit: 2
			})
		)) as Post[];

		return relatedPosts;
	} catch (error) {
		console.error('Error fetching related posts:', error);
		throw new Error('Failed to fetch related posts', { cause: error });
	}
};

// ── fetchAuthorById — Fetch thông tin tác giả

/**
 * Fetches author details by ID.
 */
export const fetchAuthorById = async (authorId: string) => {
	const { getDirectus, readUser } = useDirectus();
	const directus = getDirectus();

	try {
		const author = (await directus.request(
			readUser(authorId, {
				fields: ['first_name', 'last_name', 'avatar']
			})
		)) as DirectusUser;

		return author;
	} catch (error) {
		console.error(`Error fetching author with ID "${authorId}":`, error);
		throw new Error(`Failed to fetch author with ID "${authorId}"`, { cause: error });
	}
};

// ── fetchPaginatedPosts — Fetch post phân trang (client-side)

/**
 * Fetches paginated blog posts. - Runs Client side
 */
export const fetchPaginatedPosts = async (limit: number, page: number): Promise<Post[]> => {
	const { getDirectus } = useDirectus();
	const directus = getDirectus();
	try {
		const response = (await directus.request(
			readItems('posts', {
				limit,
				page,
				sort: ['-published_at'],
				fields: ['id', 'title', 'description', 'slug', 'image'],
				filter: { status: { _eq: 'published' } }
			})
		)) as Post[];

		return response;
	} catch (error) {
		console.error('Error fetching paginated posts:', error);
		throw new Error('Failed to fetch paginated posts', { cause: error });
	}
};

// ── fetchTotalPostCount — Đếm tổng số post published

/**
 * Fetches the total number of published blog posts.
 */
export const fetchTotalPostCount = async (): Promise<number> => {
	const { getDirectus } = useDirectus();
	const directus = getDirectus();

	try {
		const response = await directus.request(
			aggregate('posts', {
				aggregate: { count: '*' },
				filter: { status: { _eq: 'published' } }
			})
		);

		return Number(response[0]?.count) || 0;
	} catch (error) {
		console.error('Error fetching total post count:', error);

		return 0;
	}
};

// ─── Fetchers: Auth ─────────────────────────────────────────────────────────

/** Goi Directus REST API truc tiep cho collection khong nam trong Schema. */
async function directusFetch<T>(
	path: string,
	token?: string,
	init?: RequestInit
): Promise<T | null> {
	try {
		const headers: Record<string, string> = { 'Content-Type': 'application/json' };
		if (token) headers['Authorization'] = `Bearer ${token}`;

		const res = await fetch(`${PUBLIC_DIRECTUS_URL}${path}`, { ...init, headers });
		if (!res.ok) return null;
		const json = await res.json();
		return json.data as T;
	} catch (err) {
		console.error(`[directusFetch] ${path} failed:`, err);
		return null;
	}
}

/** Lay danh sach auth_providers (chi enabled). */
export const fetchAuthProviders = async (token?: string): Promise<AuthProvider[] | null> => {
	return directusFetch<AuthProvider[]>(
		'/items/auth_providers?filter[enabled][_eq]=true&sort[]=sort',
		token
	);
};

/** Lay danh sach tat ca auth_providers (admin). */
export const fetchAllAuthProviders = async (token: string): Promise<AuthProvider[] | null> => {
	return directusFetch<AuthProvider[]>('/items/auth_providers?sort[]=sort&limit=-1', token);
};

/** Cap nhat auth_provider (admin toggle). */
export const updateAuthProvider = async (
	token: string,
	id: string,
	data: Partial<AuthProvider>
): Promise<void> => {
	const result = await directusFetch<{ id: string }>(`/items/auth_providers/${id}`, token, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (!result) {
		throw new Error('Failed to update auth provider');
	}
};

/** Lay thong tin user hien tai. */
export const fetchCurrentUser = async (token: string): Promise<DirectusUser | null> => {
	const { getDirectus, withToken, readMe } = useDirectus();
	const directus = getDirectus();

	try {
		const user = (await directus.request(
			withToken(
				token,
				readMe({
					fields: ['id', 'email', 'first_name', 'avatar']
				})
			)
		)) as DirectusUser;

		return user;
	} catch (error) {
		console.error('[fetcher] fetchCurrentUser failed:', error);
		return null;
	}
};

/** Cap nhat thong tin user hien tai. */
export const updateCurrentUser = async (
	token: string,
	data: { first_name?: string; email?: string }
): Promise<void> => {
	const { getDirectus, withToken, updateMe } = useDirectus();
	const directus = getDirectus();

	try {
		await directus.request(withToken(token, updateMe(data)));
	} catch (error) {
		console.error('[fetcher] updateCurrentUser failed:', error);
		throw error;
	}
};
