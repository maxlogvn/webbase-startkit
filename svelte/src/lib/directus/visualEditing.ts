// ─── Import ──────────────────────────────────────────────────────────────────

import { browser } from '$app/environment';
import { page } from '$app/state';
import { setAttr as basesetAttr } from '@directus/visual-editing';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ApplyOptions {
	collection: string;
	item: string | number;
	fields?: string | string[];
	mode?: 'modal' | 'popover' | 'drawer';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ── Gán thuộc tính Visual Editing cho element
// Chỉ kích hoạt khi đang ở browser và visual-editing đã được bật
export const setAttr = (options: ApplyOptions) => {
	if (browser && sessionStorage.getItem('visual-editing') === 'true') {
		return basesetAttr({
			...options
		});
	}
};

// ── Bật Visual Editing mode
// Lưu trạng thái vào sessionStorage để các request sau có thể nhận biết
export const enableVisualEditing = () => {
	if (browser && page.data.visualEditingEnabled) {
		sessionStorage.setItem('visual-editing', 'true');
	}
};

export default setAttr;
