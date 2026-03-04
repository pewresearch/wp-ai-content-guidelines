<?php
/**
 * Tests for Context_Packet_Builder.
 *
 * @package ContentGuidelines
 */

use ContentGuidelines\Context_Packet_Builder;

/**
 * @covers \ContentGuidelines\Context_Packet_Builder
 */
class Test_Context_Packet_Builder extends \WP_UnitTestCase {

	/**
	 * Test get_packet returns expected structure when no guidelines exist.
	 */
	public function test_get_packet_empty_structure_when_no_guidelines() {
		$result = Context_Packet_Builder::get_packet();

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'packet_text', $result );
		$this->assertArrayHasKey( 'packet_structured', $result );
		$this->assertArrayHasKey( 'guidelines_id', $result );
		$this->assertArrayHasKey( 'revision_id', $result );
		$this->assertArrayHasKey( 'updated_at', $result );
		$this->assertSame( '', $result['packet_text'] );
		$this->assertSame( array(), $result['packet_structured'] );
		$this->assertNull( $result['guidelines_id'] );
	}

	/**
	 * Test get_packet accepts task parameter.
	 */
	public function test_get_packet_accepts_task_parameter() {
		$result = Context_Packet_Builder::get_packet( array( 'task' => 'headline' ) );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'packet_text', $result );
	}

	/**
	 * Test get_packet accepts use parameter.
	 */
	public function test_get_packet_accepts_use_parameter() {
		$result = Context_Packet_Builder::get_packet( array( 'use' => 'draft' ) );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'packet_structured', $result );
	}
}
