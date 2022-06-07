import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

const {
	VALID_PATIENT_DOMAIN,
	createPatientAccount,
	getAllPatientAccounts,
	setAllPatientAccounts,

} = require("../data/utils")



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
		// OR verify it with apply we can look CHAIN_STATE_POOL_ACCOUNTS if the areaCode is available

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
		//create Patient account
		const senderAddress = transaction.senderAddress;
		const senderAccount = await stateStore.account.get(senderAddress);
		const areaCode = asset.areaCode;

		//Admit only one patient account per account
		if (senderAccount.patient.selfPatient) {
			throw new Error('You have already a patient account !')
		}

		//Verify if areaCode is valid
		if (!(areaCode in CHAIN_STATE_POOL_ACCOUNTS)) {
			throw new Error('Your area is not yet concerned, sorry !');
		}

		const patientAccount = createPatientAccount({
			patientIdentificationNumber: asset.patientIdentificationNumber,
        	areaCode: asset.areaCode,
        	username: asset.username,
        	ownerAddress: asset.ownerAddress,
			nonce: asset.nonce,
		});

		//update sender account with unique Patient ID
		senderAccount.patient.selfPatient = patientAccount;
		await stateStore.account.set(senderAddress, senderAccount);
		
		//save patient
		const allAccounts = await getAllPatientAccounts(stateStore);
		allAccounts.push(patientAccount);
		await setAllPatientAccounts(stateStore, allAccounts);






	}



}





