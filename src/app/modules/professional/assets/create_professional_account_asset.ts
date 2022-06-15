import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

import { CreateProfessionalAccountAssetProps } from './register';


export class CreateProfessionalAccountAsset extends BaseAsset<CreateProfessionalAccountAssetProps> {
	public name = 'createProfessionalAccount';
  	public id = 1;

  // Define schema for asset
	public schema = {
    $id: 'professional/createProfessionalAccount-asset',
		title: 'CreateProfessionalAccountAsset transaction asset for professional module',
		type: 'object',
		required: ['professionalIdentificationNumber', 'areaCode', 'username'],
		properties: {
			professionalIdentificationNumber: {
				dataType: 'string',
				fieldNumber: 1,
			},
			username: {
				dataType: 'string',
				fieldNumber: 2,
			},
			areaCode: {
				dataType: 'string',
				fieldNumber: 3,
			}
		},
  	};



	public validate({ asset }: ValidateAssetContext<CreateProfessionalAccountAssetProps>): void {
		// Validate your asset
	}

	// eslint-disable-next-line @typescript-eslint/require-await
  	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<CreateProfessionalAccountAssetProps>): Promise<void> {
		throw new Error('Asset "createProfessionalAccount" apply hook is not implemented.');
	}


}
