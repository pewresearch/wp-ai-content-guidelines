/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { pencil, sparkles } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store';

/**
 * Default empty guidelines structure.
 */
const DEFAULT_GUIDELINES = {
	version: 1,
	brand_context: {
		site_description: '',
		audience: '',
		primary_goal: '',
		topics: [],
	},
	voice_tone: {
		tone_traits: [],
		pov: '',
		readability: 'general',
		example_good: '',
		example_avoid: '',
	},
	copy_rules: {
		dos: [],
		donts: [],
		formatting: [],
	},
	vocabulary: {
		prefer: [],
		avoid: [],
	},
	image_style: {
		dos: [],
		donts: [],
		text_policy: '',
	},
	notes: '',
};

/**
 * Empty state component shown when no guidelines exist.
 *
 * @return {JSX.Element} Empty state component.
 */
export default function EmptyState() {
	const [isGenerating, setIsGenerating] = useState(false);
	const { setDraft, generateDraft } = useDispatch(STORE_NAME);
	const { aiAvailable, isSaving } = useSelect(
		(select) => ({
			aiAvailable: select(STORE_NAME).getAiAvailable(),
			isSaving: select(STORE_NAME).isSaving(),
		}),
		[]
	);

	const handleStartWriting = () => {
		setDraft({ ...DEFAULT_GUIDELINES });
	};

	const handleGenerate = async () => {
		setIsGenerating(true);
		try {
			await generateDraft();
		} finally {
			setIsGenerating(false);
		}
	};

	const isLoading = isSaving || isGenerating;

	return (
		<div className="content-guidelines-empty-state">
			<div className="content-guidelines-empty-state__icon">
				<span role="img" aria-label="pencil">
					📝
				</span>
			</div>

			<h2 className="content-guidelines-empty-state__title">
				{__('Set Content Guidelines', 'content-guidelines')}
			</h2>

			<p className="content-guidelines-empty-state__description">
				{__(
					"Guidelines keep AI outputs consistent with your site's voice and brand. Define your tone, rules, and vocabulary once, and AI features will use them automatically.",
					'content-guidelines'
				)}
			</p>

			<div className="content-guidelines-empty-state__actions">
				{aiAvailable && (
					<Button
						variant="primary"
						icon={sparkles}
						onClick={handleGenerate}
						isBusy={isLoading}
						disabled={isLoading}
					>
						{__('Generate from site content', 'content-guidelines')}
					</Button>
				)}
				<Button
					variant={aiAvailable ? 'secondary' : 'primary'}
					icon={pencil}
					onClick={handleStartWriting}
					disabled={isLoading}
				>
					{__('Start writing', 'content-guidelines')}
				</Button>
			</div>

			<p className="content-guidelines-empty-state__note">
				{aiAvailable
					? __(
							'AI will analyze your site and generate a first draft you can edit.',
							'content-guidelines'
						)
					: __(
							'AI-powered generation requires an AI provider plugin.',
							'content-guidelines'
						)}
			</p>
		</div>
	);
}
