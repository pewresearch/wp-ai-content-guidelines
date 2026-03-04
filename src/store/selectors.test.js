/**
 * Internal dependencies
 */
import {
	getActive,
	getDraft,
	hasDraft,
	getCurrentGuidelines,
	getAiAvailable,
	hasGuidelines,
	draftHasChanges,
	getSection,
} from './selectors';

describe('selectors', () => {
	describe('getActive', () => {
		test('returns active from state', () => {
			const active = { version: 1 };
			expect(getActive({ active })).toEqual(active);
		});

		test('returns undefined when active not in state', () => {
			expect(getActive({})).toBeUndefined();
		});
	});

	describe('getDraft', () => {
		test('returns draft from state', () => {
			const draft = { version: 1 };
			expect(getDraft({ draft })).toEqual(draft);
		});

		test('returns null when draft is null', () => {
			expect(getDraft({ draft: null })).toBeNull();
		});
	});

	describe('hasDraft', () => {
		test('returns true when draft exists', () => {
			expect(hasDraft({ draft: { version: 1 } })).toBe(true);
		});

		test('returns false when draft is null', () => {
			expect(hasDraft({ draft: null })).toBe(false);
		});
	});

	describe('getCurrentGuidelines', () => {
		test('returns draft when draft exists', () => {
			const draft = { version: 1 };
			expect(getCurrentGuidelines({ draft, active: {} })).toEqual(draft);
		});

		test('returns active when draft is null', () => {
			const active = { version: 1 };
			expect(getCurrentGuidelines({ draft: null, active })).toEqual(
				active
			);
		});

		test('returns null when both are null', () => {
			expect(
				getCurrentGuidelines({ draft: null, active: null })
			).toBeNull();
		});
	});

	describe('getAiAvailable', () => {
		test('returns true when aiAvailable is true', () => {
			expect(getAiAvailable({ aiAvailable: true })).toBe(true);
		});

		test('returns false when aiAvailable is false', () => {
			expect(getAiAvailable({ aiAvailable: false })).toBe(false);
		});
	});

	describe('hasGuidelines', () => {
		test('returns true when active exists', () => {
			expect(hasGuidelines({ active: {}, draft: null })).toBe(true);
		});

		test('returns true when draft exists', () => {
			expect(hasGuidelines({ active: null, draft: {} })).toBe(true);
		});

		test('returns false when both are null', () => {
			expect(hasGuidelines({ active: null, draft: null })).toBe(false);
		});
	});

	describe('draftHasChanges', () => {
		test('returns false when no draft', () => {
			expect(draftHasChanges({ draft: null, active: {} })).toBe(false);
		});

		test('returns true when draft exists but no active', () => {
			expect(draftHasChanges({ draft: {}, active: null })).toBe(true);
		});

		test('returns false when draft equals active', () => {
			const same = { version: 1 };
			expect(draftHasChanges({ draft: same, active: same })).toBe(false);
		});

		test('returns true when draft differs from active', () => {
			expect(
				draftHasChanges({
					draft: { version: 2 },
					active: { version: 1 },
				})
			).toBe(true);
		});
	});

	describe('getSection', () => {
		test('returns section from draft when draft exists', () => {
			const draft = { brand_context: { site_description: 'Test' } };
			expect(getSection({ draft, active: {} }, 'brand_context')).toEqual({
				site_description: 'Test',
			});
		});

		test('returns null when no guidelines', () => {
			expect(
				getSection({ draft: null, active: null }, 'brand_context')
			).toBeNull();
		});
	});
});
