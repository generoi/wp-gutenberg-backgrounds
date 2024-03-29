<?php
/*
Plugin Name:        Gutenberg Backgrounds for Blocks
Plugin URI:         http://genero.fi
Description:        Add a background option to every Gutenberg block
Version:            1.0.0
Author:             Genero
Author URI:         http://genero.fi/
License:            MIT License
License URI:        http://opensource.org/licenses/MIT
*/
namespace GeneroWP\Gutenberg\Backgrounds;

use Puc_v4_Factory;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use GeneroWP\Common\Singleton;
use GeneroWP\Common\Assets;

if (!defined('ABSPATH')) {
    exit;
}

if (file_exists($composer = __DIR__ . '/vendor/autoload.php')) {
    require_once $composer;
}


class Plugin
{
    use Singleton;
    use Assets;

    public $version = '1.0.0';
    public $plugin_name = 'wp-gutenberg-backgrounds';
    public $plugin_path;
    public $plugin_url;
    public $github_url = 'https://github.com/generoi/wp-gutenberg-backgrounds';

    public function __construct()
    {
        $this->plugin_path = plugin_dir_path(__FILE__);
        $this->plugin_url = plugin_dir_url(__FILE__);

        Puc_v4_Factory::buildUpdateChecker($this->github_url, __FILE__, $this->plugin_name);

        add_action('plugins_loaded', [$this, 'init']);
    }

    public function init()
    {
        add_action('enqueue_block_assets', [$this, 'block_assets']);
        add_action('enqueue_block_editor_assets', [$this, 'block_editor_assets']);
        add_action('init', [$this, 'load_textdomain']);
        add_action('init', [$this, 'alter_registered_blocks'], 100);
    }

    public function alter_registered_blocks()
    {
        foreach (\WP_Block_Type_Registry::get_instance()->get_all_registered() as $blockType) {
            // @todo no native support for support.
            if (!isset($blockType->supports['customBackgroundColor']) || $blockType->supports['customBackgroundColor']) {
                $blockType->attributes['customBackgroundColor'] = [
                    'type' => 'string',
                ];
                $blockType->attributes['hasCustomBackgroundExpand'] = [
                    'type' => 'boolean',
                    'default' => false,
                ];
                if ($blockType->is_dynamic()) {
                    $blockType->original_render_callback = $blockType->render_callback;
                    $blockType->render_callback = function ($attributes, ...$args) use ($blockType) {
                        if (!empty($attributes['customBackgroundColor'])) {
                            $attributes['classes'][] = 'has-background';
                            $attributes['classes'][] = 'has-' . $attributes['customBackgroundColor'] . '-background-color';
                        }
                        if (!empty($attributes['hasCustomBackgroundExpand'])) {
                            $attributes['classes'][] = 'has-background-expanded';
                        }
                        return (string) call_user_func($blockType->original_render_callback, $attributes, ...$args);
                    };
                }
            }
        }
    }

    public function block_assets()
    {
        $this->enqueueStyle("{$this->plugin_name}/block/css", 'dist/style.css', []);
    }

    public function block_editor_assets()
    {
        $this->enqueueScript("{$this->plugin_name}/js", 'dist/index.js', ['wp-editor', 'lodash', 'wp-hooks', 'wp-blocks', 'wp-components', 'wp-i18n', 'wp-element']);
        wp_set_script_translations("{$this->plugin_name}/js", $this->plugin_name);
    }

    public function load_textdomain()
    {
        // WP Performance Pack
        include __DIR__ . '/languages/javascript.php';

        load_plugin_textdomain($this->plugin_name, false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
}

Plugin::getInstance();
