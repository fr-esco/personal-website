import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { HlmCardConfig, injectHlmCardConfig } from './hlm-card.token';

@Directive({
	selector: '[hlmCard],hlm-card',
	host: {
		'data-slot': 'card',
		'[attr.data-size]': 'size()',
	},
})
export class HlmCard {
	private readonly _defaultConfig = injectHlmCardConfig();
	public readonly size = input<HlmCardConfig['size']>(this._defaultConfig.size);

	constructor() {
		// Use a real 1px border instead of a `ring` (box-shadow): rings drop
		// individual sides at fractional device-pixel ratios (visible in light
		// mode where the color is faint). A border renders every side reliably.
		classes(() => 'border border-border bg-card text-card-foreground gap-(--card-spacing) overflow-hidden rounded-none py-(--card-spacing) text-xs/relaxed [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none group/card flex flex-col');
	}
}
