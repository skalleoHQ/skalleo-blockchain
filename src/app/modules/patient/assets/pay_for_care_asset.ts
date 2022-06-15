import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';




export class PayForCareAsset extends BaseAsset {
	public name = 'payForCare';
  	public id = 2;


	
  // Define schema for asset
	public schema = {
		$id: 'patient/payForCare-asset',
			title: 'PayForCareAsset transaction asset for patient module',
			type: 'object',
			required: ['patientReverseLookup', 'professionalReverseLookup', 'medicalRecordId'],
			properties: {
				patientReverseLookup: {
					dataType: 'bytes',
					fieldNumber: 1,
				},
				professionalReverseLookup: {
					dataType: 'bytes',
					fieldNumber: 2,
				},
				medicalRecordId: {
					dataType: 'bytes',
					fieldNumber: 3,
				},
			},
	};



	public validate({ asset }: ValidateAssetContext<{}>): void {
		// Validate your asset
	}



		// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
			throw new Error('Asset "payForCare" apply hook is not implemented.');
	}





}