<?php
/**
 * Tests for Lint_Checker.
 *
 * @package ContentGuidelines
 */

use ContentGuidelines\Lint_Checker;

/**
 * @covers \ContentGuidelines\Lint_Checker
 */
class Test_Lint_Checker extends \WP_UnitTestCase {

	/**
	 * Test empty content returns empty results.
	 */
	public function test_empty_content_returns_empty_results() {
		$guidelines = array(
			'vocabulary' => array(
				'avoid'  => array( 'badword' ),
				'prefer' => array( 'goodword' ),
			),
		);

		$result = Lint_Checker::check( '', $guidelines );

		$this->assertSame( array(), $result['issues'] );
		$this->assertSame( array(), $result['suggestions'] );
	}

	/**
	 * Test empty guidelines returns empty results.
	 */
	public function test_empty_guidelines_returns_empty_results() {
		$result = Lint_Checker::check( 'Some content to check.', array() );

		$this->assertSame( array(), $result['issues'] );
	}

	/**
	 * Test vocabulary avoid terms are detected.
	 */
	public function test_vocabulary_avoid_detects_terms() {
		$content    = 'This text contains the badword and nothing else.';
		$guidelines  = array(
			'vocabulary' => array(
				'avoid' => array( 'badword' ),
			),
		);

		$result = Lint_Checker::check( $content, $guidelines );

		$this->assertCount( 1, $result['issues'] );
		$this->assertSame( 'vocabulary_avoid', $result['issues'][0]['type'] );
		$this->assertSame( 'badword', $result['issues'][0]['term'] );
	}

	/**
	 * Test vocabulary avoid with word boundaries (no partial match).
	 */
	public function test_vocabulary_avoid_uses_word_boundaries() {
		$content   = 'The word badwordly is different from badword.';
		$guidelines = array(
			'vocabulary' => array(
				'avoid' => array( 'badword' ),
			),
		);

		$result = Lint_Checker::check( $content, $guidelines );

		$this->assertCount( 1, $result['issues'] );
		$this->assertSame( 1, $result['issues'][0]['count'] );
	}

	/**
	 * Test vocabulary avoid with array format (term + note).
	 */
	public function test_vocabulary_avoid_array_format() {
		$content   = 'Avoid using jargon here.';
		$guidelines = array(
			'vocabulary' => array(
				'avoid' => array(
					array( 'term' => 'jargon', 'note' => 'Use plain language' ),
				),
			),
		);

		$result = Lint_Checker::check( $content, $guidelines );

		$this->assertCount( 1, $result['issues'] );
		$this->assertSame( 'jargon', $result['issues'][0]['term'] );
	}

	/**
	 * Test readability stats are calculated.
	 */
	public function test_readability_calculates_stats() {
		$content   = 'First sentence. Second sentence. Third sentence.';
		$guidelines = array(
			'voice_tone' => array( 'readability' => 'general' ),
		);

		$result = Lint_Checker::check( $content, $guidelines );

		$this->assertArrayHasKey( 'word_count', $result['stats'] );
		$this->assertArrayHasKey( 'sentence_count', $result['stats'] );
		$this->assertArrayHasKey( 'avg_words_per_sentence', $result['stats'] );
		$this->assertSame( 3, $result['stats']['sentence_count'] );
	}

	/**
	 * Test readability issue when sentences exceed threshold.
	 */
	public function test_readability_issue_when_exceeding_threshold() {
		$content   = 'This is a very long sentence that intentionally exceeds the general readability threshold of around twenty words per sentence for the general audience target.';
		$guidelines = array(
			'voice_tone' => array( 'readability' => 'general' ),
		);

		$result = Lint_Checker::check( $content, $guidelines );

		$this->assertGreaterThan( 0, count( $result['issues'] ) );
		$readability_issue = null;
		foreach ( $result['issues'] as $issue ) {
			if ( 'readability' === $issue['type'] ) {
				$readability_issue = $issue;
				break;
			}
		}
		$this->assertNotNull( $readability_issue );
	}

	/**
	 * Test copy rules urgency detection when donts mention urgency.
	 */
	public function test_copy_rules_detects_urgency_phrases() {
		$content   = 'Act now! Limited time offer.';
		$guidelines = array(
			'copy_rules' => array(
				'donts' => array( 'No urgency or pressure tactics' ),
			),
		);

		$result = Lint_Checker::check( $content, $guidelines );

		$this->assertGreaterThan( 0, count( $result['issues'] ) );
	}

	/**
	 * Test copy rules superlative detection when donts mention best.
	 */
	public function test_copy_rules_detects_superlatives() {
		$content   = 'We are the best in the industry.';
		$guidelines = array(
			'copy_rules' => array(
				'donts' => array( 'Avoid superlatives like best' ),
			),
		);

		$result = Lint_Checker::check( $content, $guidelines );

		$this->assertGreaterThan( 0, count( $result['issues'] ) );
	}

	/**
	 * Test result structure.
	 */
	public function test_result_has_required_keys() {
		$result = Lint_Checker::check( 'Test content.', array( 'vocabulary' => array() ) );

		$this->assertArrayHasKey( 'issues', $result );
		$this->assertArrayHasKey( 'suggestions', $result );
		$this->assertArrayHasKey( 'stats', $result );
		$this->assertIsArray( $result['issues'] );
		$this->assertIsArray( $result['suggestions'] );
		$this->assertIsArray( $result['stats'] );
	}
}
