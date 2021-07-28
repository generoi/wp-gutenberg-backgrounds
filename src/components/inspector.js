/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
  PanelColorSettings,
  withColors,
  InspectorAdvancedControls,
} from '@wordpress/block-editor';
import {
  ToggleControl,
} from '@wordpress/components';

const Inspector = ({ attributes, setAttributes, customBackgroundColor, setCustomBackgroundColor }) => {
  const { hasCustomBackgroundExpand } = attributes;

  return (
    <InspectorAdvancedControls>
      <PanelColorSettings
        title={ __('Color Settings', 'wp-gutenberg-backgrounds') }
        colorSettings={ [
          {
            value: customBackgroundColor.color,
            onChange: setCustomBackgroundColor,
            label: __('Background color', 'wp-gutenberg-backgrounds'),
          },
        ] }
      />

      { !!customBackgroundColor.color && (
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
