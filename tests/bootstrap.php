<?php
/**
 * PHPUnit bootstrap for Content Guidelines tests.
 *
 * @package ContentGuidelines
 */

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "WordPress test library not found. Set WP_TESTS_DIR or install via:\n";
	echo "  bash bin/install-wp-tests.sh wordpress_test root '' localhost latest\n";
	exit( 1 );
}

require_once $_tests_dir . '/includes/functions.php';

function _manually_load_content_guidelines() {
	require dirname( __DIR__ ) . '/content-guidelines.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_content_guidelines' );

require $_tests_dir . '/includes/bootstrap.php';
