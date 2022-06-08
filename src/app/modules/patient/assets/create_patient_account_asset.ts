import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { CreatePatientAccountAssetProps } from './register';
import { PatientModuleProps } from './register';


const {
	VALID_PATIENT_DOMAIN,
	createPatientAccount,
	getAllPatientAccounts,
	setAllPatientAccounts,

} = require("../data/utils")




export class CreatePatientAccountAsset extends BaseAsset<CreatePatientAccountAssetProps> {
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

	public validate({ asset }: ValidateAssetContext<CreatePatientAccountAssetProps>): void {

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
		// OR verify it with apply: we can look CHAIN_STATE_POOL_ACCOUNTS if the areaCode is available

		/**
		 * */
		

		// Verify if username is valid
		const chunks = asset.username.split(/\./);

		if (chunks.length > 2) {
			throw new Error('You may not use "." than for the domain');
		};

		if (!VALID_PATIENT_DOMAIN.includes(chunks[1])) {
			throw new Error(`Invalid domain found "${chunks[1]}". Valid domain is "${VALID_PATIENT_DOMAIN.join()}"`);
		};
		

	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<CreatePatientAccountAssetProps>): Promise<void> {
	
		const senderAddress = transaction.senderAddress;
		const senderAccount = await stateStore.account.get<PatientModuleProps>(senderAddress);

		const patientAccounts = await getAllPatientAccounts(stateStore);
	
		//Each patientIdentificationNumber has only one account
		const patientIdentificationNumberIndex = patientAccounts.findIndex((t) => t.id.equals(asset.patientIdentificationNumber));
		if (patientIdentificationNumberIndex >= 0) {
			throw new Error('You have already a patient account !')
		}

		//Verify if domain is unique
		const patientUsernameIndex = patientAccounts.findIndex((t) => t.id.equals(asset.username));
		if (patientUsernameIndex >= 0) {
			throw new Error('This username is already reserved, please try another.')
		}

		//Admit only one patient account by the way
		if (senderAccount.selfPatient) {
			throw new Error('You have already a patient account !')
		}

		//Verify if areaCode is valid

		/*const areaCodeIndex = poolAccounts.findIndex((t) => t.id.equals(asset.areaCode));
		if (areaCodeIndex >= 0) {
			throw new Error('Your area is not yet concerned, sorry !');
		}*/

		//create patient account
		const patientAccount = createPatientAccount({
			patientIdentificationNumber: asset.patientIdentificationNumber,
        	areaCode: asset.areaCode,
        	username: asset.username,
        	ownerAddress: senderAddress,
			nonce: transaction.nonce,
		});

		//update user account with unique username and his personal patient account
		senderAccount.selfPatient = patientAccount;
		senderAccount.reverseLookup = patientAccount.username;
		await stateStore.account.set(senderAddress, senderAccount);
		
		//save patient in database
		const allAccounts = await getAllPatientAccounts(stateStore);
		allAccounts.push(patientAccount);
		await setAllPatientAccounts(stateStore, allAccounts);

	}

}



module.exports = {
	CreatePatientAccountAsset,
}



