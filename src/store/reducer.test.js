/**
 * Internal dependencies
 */
import reducer from './reducer';
import {
	SET_GUIDELINES,
	SET_DRAFT,
	SET_SAVING,
	SET_PUBLISHING,
	SET_ERROR,
	SET_REVISIONS,
	SET_TEST_RESULTS,
	SET_RUNNING_TEST,
} from './actions';

describe('reducer', () => {
	const defaultState = {
		active: null,
		draft: null,
		postId: null,
		updatedAt: null,
		revisionCount: 0,
		aiAvailable: false,
		isSaving: false,
		isPublishing: false,
		error: null,
		revisions: [],
		isRestoring: false,
		testResults: null,
		isRunningTest: false,
	};

	test('returns default state for unknown action', () => {
		expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(defaultState);
	});

	test('SET_GUIDELINES updates active, draft, postId, aiAvailable', () => {
		const payload = {
			active: { version: 1 },
			draft: { version: 1, notes: 'edited' },
			post_id: 42,
			updated_at: '2024-01-01',
			revision_count: 5,
			ai_available: true,
		};

		const state = reducer(defaultState, { type: SET_GUIDELINES, payload });

		expect(state.active).toEqual({ version: 1 });
		expect(state.draft).toEqual({ version: 1, notes: 'edited' });
		expect(state.postId).toBe(42);
		expect(state.revisionCount).toBe(5);
		expect(state.aiAvailable).toBe(true);
	});

	test('SET_GUIDELINES normalizes coreparagraph to core/paragraph', () => {
		const payload = {
			active: { blocks: { coreparagraph: { notes: 'test' } } },
			draft: null,
			post_id: null,
			updated_at: null,
			revision_count: 0,
			ai_available: false,
		};

		const state = reducer(defaultState, { type: SET_GUIDELINES, payload });

		expect(state.active.blocks).toEqual({
			'core/paragraph': { notes: 'test' },
		});
	});

	test('SET_DRAFT updates draft', () => {
		const draft = { version: 1, notes: 'new draft' };
		const state = reducer(defaultState, {
			type: SET_DRAFT,
			payload: draft,
		});

		expect(state.draft).toEqual(draft);
	});

	test('SET_DRAFT can set null', () => {
		const stateWithDraft = { ...defaultState, draft: { version: 1 } };
		const state = reducer(stateWithDraft, {
			type: SET_DRAFT,
			payload: null,
		});

		expect(state.draft).toBeNull();
	});

	test('SET_SAVING updates isSaving', () => {
		expect(
			reducer(defaultState, { type: SET_SAVING, payload: true }).isSaving
		).toBe(true);
		expect(
			reducer(defaultState, { type: SET_SAVING, payload: false }).isSaving
		).toBe(false);
	});

	test('SET_PUBLISHING updates isPublishing', () => {
		expect(
			reducer(defaultState, { type: SET_PUBLISHING, payload: true })
				.isPublishing
		).toBe(true);
	});

	test('SET_ERROR updates error', () => {
		expect(
			reducer(defaultState, {
				type: SET_ERROR,
				payload: 'Something failed',
			}).error
		).toBe('Something failed');
		expect(
			reducer(defaultState, { type: SET_ERROR, payload: null }).error
		).toBeNull();
	});

	test('SET_REVISIONS updates revisions', () => {
		const revisions = [{ id: 1 }, { id: 2 }];
		expect(
			reducer(defaultState, { type: SET_REVISIONS, payload: revisions })
				.revisions
		).toEqual(revisions);
	});

	test('SET_TEST_RESULTS updates testResults', () => {
		const results = { lint_results: { issues: [] } };
		expect(
			reducer(defaultState, { type: SET_TEST_RESULTS, payload: results })
				.testResults
		).toEqual(results);
	});

	test('SET_RUNNING_TEST updates isRunningTest', () => {
		expect(
			reducer(defaultState, { type: SET_RUNNING_TEST, payload: true })
				.isRunningTest
		).toBe(true);
	});
});
