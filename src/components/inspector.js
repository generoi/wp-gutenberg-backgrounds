/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
  PanelColor,
  withColors,
  InspectorAdvancedControls,
} from '@wordpress/editor';
import {
  ToggleControl,
} from '@wordpress/components';

const Inspector = ({ attributes, setAttributes, customBackgroundColor, setCustomBackgroundColor }) => {
  const { hasCustomBackgroundExpand } = attributes;

  return (
    <InspectorAdvancedControls>
      <PanelColor
        key='custombackgroundcolorcontrol'
        colorValue={ customBackgroundColor.value }
        title={ __('Background Color', 'wp-gutenberg-backgrounds') }
        onChange={ setCustomBackgroundColor }
      />

      { !!customBackgroundColor.value && (
        <ToggleControl
          key='togglecontrol'
          label={ __('Expand the full viewport width', 'wp-gutenberg-backgrounds') }
          checked={ !!hasCustomBackgroundExpand }
          onChange={ () => setAttributes({ hasCustomBackgroundExpand: !hasCustomBackgroundExpand }) }
        />
      ) }
    </InspectorAdvancedControls>
  );
};

export default withColors({ customBackgroundColor: 'background-color' })(Inspector);
