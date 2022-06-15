import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

import { CreateProfessionalAccountAssetProps, ProfessionalModuleProps } from './register';

const { 
	VALID_PROFESSIONAL_DOMAIN,
	getAllProfessionalAccounts,
	createProfessionalAccount,
	setAllPatientAccounts,

} = require ('../data/utils')


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
		// Verify if client fill professional Identification Number box
		if (!asset.professionalIdentificationNumber) {
			throw new Error('You must enter your identification number');
		};

		// Must implement checking identity procedure (redirect the client to his national database for example and verify identity)

		/**
		 * */ 

		// Verify if client fill areaCode box
		if (!asset.areaCode) {
			throw new Error('You must enter your areaCode, you can find it on https://skalleo.io');
		};

		// Implement checking areaCode procedure (redirect the client to his national database for example and verify if this zone is concerned)
		// OR verify it with apply: we can look CHAIN_STATE_POOL_ACCOUNTS if the areaCode is available

		/**
		 * */
		
		// Verify if professional fill username box
		if (!asset.username) {
			throw new Error('You must enter your username, please use "." only in front of "pro');
		};

		// Verify if username is valid
		const chunks = asset.username.split(/\./);

		if (chunks.length > 2) {
			throw new Error('You may not use "." than for the domain');
		};

		if (!VALID_PROFESSIONAL_DOMAIN.includes(chunks[1])) {
			throw new Error(`Invalid domain found "${chunks[1]}". Valid domain is "${VALID_PROFESSIONAL_DOMAIN.join()}"`);
		};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
  	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<CreateProfessionalAccountAssetProps>): Promise<void> {
		
		const senderAddress = transaction.senderAddress;
		const senderAccount = await stateStore.account.get<ProfessionalModuleProps>(senderAddress);

		const professionalAccounts = await getAllProfessionalAccounts(stateStore);

		//Admit only one professional account by the way
		if (senderAccount.selfProfessional || senderAccount.reverseLookup) {
			throw new Error('You have already a professional account !')
		}

		//Each professionalIdentificationNumber has only one account
		const professionalIdentificationNumberIndex = professionalAccounts.findIndex((t) => t.professionalIdentificationNumber === (asset.professionalIdentificationNumber));
		if (professionalIdentificationNumberIndex >= 0) {
			throw new Error('This professional identification number is already registered !')
		}

		//Verify if username is unique
		const professionalUsernameIndex = professionalAccounts.findIndex((t) => t.username === (asset.username));
		if (professionalUsernameIndex >= 0) {
			throw new Error('This username is already reserved, please try another.')
		}

		//Verify if areaCode is valid

		/*const areaCodeIndex = poolAccounts.findIndex((t) => t.areaCode === (asset.areaCode));
		if (areaCodeIndex >= 0) {
			throw new Error('Your area is not yet concerned, sorry !');
		}*/

		//create professional account
		const professionalAccount = createProfessionalAccount({
			professionalIdentificationNumber: asset.professionalIdentificationNumber,
        	areaCode: asset.areaCode,
        	username: asset.username,
        	ownerAddress: senderAddress,
			nonce: transaction.nonce,
		});

		//update user account with unique username and his personal professional account
		senderAccount.selfProfessional = professionalAccount;
		senderAccount.reverseLookup = professionalAccount.username;
		await stateStore.account.set(senderAddress, senderAccount);
		
		//save professional in database
		const allAccounts = await getAllProfessionalAccounts(stateStore);
		allAccounts.push(professionalAccount);
		await setAllPatientAccounts(stateStore, allAccounts);

	}

}




module.exports = {
	CreateProfessionalAccountAsset,
}
