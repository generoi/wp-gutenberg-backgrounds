/**
 * External Dependencies
 */
import { assign } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { Fragment, createHigherOrderComponent } from '@wordpress/element';
import { getColorClass } from '@wordpress/editor';

/**
 * Internal Dependencies
 */
import Inspector from './components/inspector';
import './style.scss';

/**
 * Return if block supports custom background colors.
 *
 * @param {mixed} blockType
 * @return {bool} Background support
 */
function hasCustomBackgroundColor(blockType) {
  return hasBlockSupport(blockType, 'customBackgroundColor', true);
}

/**
 * @param {String} classes
 * @param {Object} attributes
 */
function applyClasses(classes, attributes) {
  const colorClass = getColorClass('background-color', attributes.customBackgroundColor);

  if (colorClass) {
    return classnames(classes, 'has-background', colorClass, {
      ['has-background-expanded']: attributes.hasCustomBackgroundExpand,
    });
  }
  return classes;
}

/**
 * Filters registered block settings, extending attributes with background settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
function addAttributes(settings) {
  if (hasCustomBackgroundColor(settings)) {
    settings.attributes = assign(settings.attributes, {
      customBackgroundColor: {
        type: 'string',
      },
      hasCustomBackgroundExpand: {
        type: 'bool',
        default: false,
      },
    } );
  }
  return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * background settings.
 *
 * @param {function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent(BlockEdit => {
  return props => {
    return (
      <Fragment>
        <BlockEdit {...props} />
        { props.isSelected && hasCustomBackgroundColor(props.name) && <Inspector {...{ ...props }} /> }
      </Fragment>
    );
  };
}, 'withInspectorControl');

/**
 * Override props assigned to save component to inject background atttributes
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function addSaveProps(extraProps, blockType, attributes) {
  if (hasCustomBackgroundColor(blockType)) {
    extraProps.className = applyClasses(extraProps.className, attributes);
  }
  return extraProps;
}

/**
 * Override the default block element to add background wrapper props.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
const withBackground = createHigherOrderComponent(BlockListBlock => {
  return props => {
    let wrapperProps = props.wrapperProps || {};

    if (hasCustomBackgroundColor(props.name)) {
      const attributes = props.block.attributes;

      wrapperProps = {
        ...wrapperProps,
        // @see https://github.com/WordPress/gutenberg/issues/7405
        'data-background-color': attributes.customBackgroundColor,
        'data-background-expanded': attributes.hasCustomBackgroundExpand,
      };
    }

    return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
  };
}, 'withBackground');

addFilter('blocks.registerBlockType', 'generoi/background/attribute', addAttributes);
addFilter('editor.BlockEdit', 'generoi/background/inspector', withInspectorControl);
addFilter('blocks.getSaveContent.extraProps', 'generoi/background/addClasses', addSaveProps);
addFilter('editor.BlockListBlock', 'generoi/background/withBackground', withBackground);
