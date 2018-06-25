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
        colorValue={ customBackgroundColor.value }
        title={ __('Background Color') }
        onChange={ setCustomBackgroundColor }
      />

      { !!customBackgroundColor.value && (
        <ToggleControl
          key='togglecontrol'
          label={ __('Expand the full viewport width') }
          checked={ !!hasCustomBackgroundExpand }
          onChange={ () => setAttributes({ hasCustomBackgroundExpand: !hasCustomBackgroundExpand }) }
        />
      ) }
    </InspectorAdvancedControls>
  );
};

export default withColors({ customBackgroundColor: 'background-color' })(Inspector);
