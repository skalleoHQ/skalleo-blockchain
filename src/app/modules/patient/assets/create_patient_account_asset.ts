import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

import { VALID_PATIENT_DOMAIN } from '../data/create_patient_account';



export class CreatePatientAccountAsset extends BaseAsset {
	public name = 'createPatientAccount';
  	public id = 1;

  // Define schema for asset
	public schema = {
    $id: 'patient/createPatientAccount-asset',
		title: 'CreatePatientAccountAsset transaction asset for patient module',
		type: 'object',
		required: ['patientIdentificationNumber', 'areaCode', 'username'],
		properties: {
			patientIdentificationNumber: {
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
			},
		},
  	};

	public validate({ asset }: ValidateAssetContext<{}>): void {
		// Verify if client fill patient Identification Number box
		if (!asset.patientIdentificationNumber) {
			throw new Error('You must enter your identification number');
		};

		// Implement checking identity procedure (redirect the client to national database for example and verify identity)

		/**
		 * */ 

		// Verify if client fill areaCode box
		if (!asset.areaCode) {
			throw new Error('You must enter your areaCode, you can find it on https://skalleo.io');
		};

		// Implement checking areaCode procedure (redirect the client to national database for example and verify if this zone is concerned)

		/**
		 * */
		

		// Verify if username is valid
		const chunks = asset.username.split(/\./);

		if (chunks.length > 2) {
			throw new Error('You may not use "." than for the domain');
		};

		if (!VALID_PATIENT_DOMAIN.includes(chunks[1])) {
			throw new Error(`Invalid domain found "${chunks[1]}". Valid TLDs are "${VALID_PATIENT_DOMAIN.join()}"`);
		};

	

		

	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
			throw new Error('Asset "createPatientAccount" apply hook is not implemented.');
	}



}





