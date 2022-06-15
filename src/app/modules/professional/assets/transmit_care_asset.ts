import assert = require('assert');
import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { ProfessionalModuleProps, TransmitCareAssetProps } from './register';

const {
	VALID_PATIENT_DOMAIN,
	getAllPatientAccounts,

} = require ('../../patient/assets/register')


export class TransmitCareAsset extends BaseAsset<TransmitCareAssetProps> {
	public name = 'transmitCare';
  	public id = 2;

  // Define schema for asset
	public schema = {
    $id: 'professional/transmitCare-asset',
		title: 'TransmitCareAsset transaction asset for professional module',
		type: 'object',
		required: ['patientIdentificationNumber', 'reverseLookup', 'areaCode', 'medicalRecord'],
		properties: {
			patientIdentificationNumber: {
				dataType: 'string',
				fieldNumber: 1,
			},
			reverseLookup: {
				dataType: 'string',
				fieldNumber: 2,
			},
			areaCode: {
				dataType: 'string',
				fieldNumber: 3
			},
			medicalRecord: {
				dataType: 'string',
				fieldNumber: 4,
			},
		},
	};

	public validate({ asset }: ValidateAssetContext<TransmitCareAssetProps>): void {

		if (!asset.patientIdentificationNumber) {
			throw new Error('You must enter identification number of your patient');
		}

		if (!asset.reverseLookup) {
			throw new Error('You must enter username of your patient');
		}

		const chunks = asset.reverseLookup.split(/\./);

		if (chunks.length > 2) {
			throw new Error('You may not use "." than for the domain');
		};

		if (!VALID_PATIENT_DOMAIN.includes(chunks[1])) {
			throw new Error(`Invalid domain found "${chunks[1]}". Valid domain is "${VALID_PATIENT_DOMAIN.join()}"`);
		};

		if (!asset.areaCode) {
			throw new Error('You must enter areaCode of your patient');
		}

		//This medicalRecord will be used only to update patient's medical record in his national database
		if (!asset.medicalRecord) {
			throw new Error('Please update medicalRecord of your patient !')
		}

		//Must implement procedure in order to send medicalRecord to national database

	}

	// eslint-disable-next-line @typescript-eslint/require-await
  	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<TransmitCareAssetProps>): Promise<void> {
		const senderAddress = transaction.senderAddress;
		const senderAccount = stateStore.account.get<ProfessionalModuleProps>(senderAddress);
		
		const patientAccounts = await getAllPatientAccounts(stateStore);

		const patientIdentificationNumberIndex = patientAccounts.findIndex((t) => t.patientIdentificationNumber === asset.patientIdentificationNumber);
		if (patientIdentificationNumberIndex < 0) {
			throw new Error('Patient not found !');	
		}

		const patientReverseLookupIndex = patientAccounts.findIndex((t) => t.username === asset.reverseLookup);
		if (patientReverseLookupIndex < 0) {
			throw new Error('Patient not found !');
		}

		/*const patientAreaCodeIndex = patientAccounts.findIndex((t) => t.areaCode === asset.areaCode);
		if (patientAreaCodeIndex < 0) {
			throw new Error('Patient not found !');
		}*/
		//assert(patientReverseLookupIndex === patientAreaCodeIndex); impossible because areaCode not unique

		if(patientIdentificationNumberIndex !== patientReverseLookupIndex) {
			throw new Error('Patient not found !');
		}

		//const patientAccount = patientAccounts[patientIdentificationNumberIndex];
		
		//Must implement verification procedure for medical record 




	}





}
