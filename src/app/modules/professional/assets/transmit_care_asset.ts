import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class TransmitCareAsset extends BaseAsset {
	public name = 'transmitCare';
  public id = 2;

  // Define schema for asset
	public schema = {
    $id: 'professional/transmitCare-asset',
		title: 'TransmitCareAsset transaction asset for professional module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "transmitCare" apply hook is not implemented.');
	}
}
