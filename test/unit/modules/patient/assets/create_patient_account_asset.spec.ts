import { StateStore } from 'lisk-sdk';
import { testing } from 'lisk-sdk';
import { CreatePatientAccountAsset } from '../../../../../src/app/modules/patient/assets/create_patient_account_asset';
import { PatientModuleProps } from '../../../../../src/app/modules/patient/assets/register';
import { PatientModule } from '../../../../../src/app/modules/patient/patient_module';


//const { getAllPatientAccounts } = require ('../../../../../src/app/modules/patient/data/utils');

//const { CHAIN_STATE_PATIENT_ACCOUNTS } = require ('../../../../../src/app/modules/patient/data/utils');

describe('CreatePatientAccountAsset', () => {
  let transactionAsset: CreatePatientAccountAsset;

	beforeEach(() => {
		transactionAsset = new CreatePatientAccountAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(1);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('createPatientAccount');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});



	describe('validate', () => {
		describe('schema validation', () => {
			it('should throw error if username has more than one domain', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "by.moussa.adh" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You may not use "." than for the domain'
				)
			});

			it('should throw error if username doesnt contain adh', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "by.moussa" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'Invalid domain found "moussa". Valid domain is "adh"'
				)
			});

			it('should throw error if user doesnt add his patient identification number', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "", areaCode: "33_FRANCE", username: "moussa.adh" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your identification number'
				)
			});

			it('should throw error if user doesnt add his area code', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", areaCode: "", username: "moussa.adh" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your areaCode, you can find it on https://skalleo.io'
				)
			});

			it('should throw error if username doesnt a username', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your username, please use "." only in front of "adh'
				)
			});

			it('should be ok for valid schema', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "moussa.adh" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).not.toThrow();
			});

		});
	});



	describe('apply', () => {
		let stateStore: StateStore;
		let account: any;
		let account1: any;
		let account2: any;
		let account3: any;
		let account4: any;
		let account5: any


		beforeEach(() => {
			account = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);
			account1 = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);
			account2 = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);
			account3 = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);
			account4 = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);
			account5 = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);

			stateStore = new testing.mocks.StateStoreMock({
				accounts: [account, account1, account2, account3, account4, account5],
			});

			jest.spyOn(stateStore.chain, 'get');
			jest.spyOn(stateStore.chain, 'set');
		});

		describe('valid cases', () => {
			it('should update the state store with patient account', async () => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "moussa.adh" },
					transaction: { senderAddress: account.address } as any,
				});

				await transactionAsset.apply(context);

				expect(stateStore.chain.networkIdentifier).toEqual(context.stateStore.chain.networkIdentifier);
				expect(stateStore.chain.set).toBe(context.stateStore.chain.set);
				expect(stateStore.chain.set).toHaveBeenCalledWith("patient: registeredPatientAccounts", expect.any(Buffer));
			});
		});


		describe('invalid cases', () => {
			it('should throw error if patient is already registered', async() => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "moussa.adh" },
					transaction: { senderAddress: account.address } as any,
				});

				const context1 = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "03301012022", areaCode: "221_SENEGAL", username: "m.adh" },
					transaction: { senderAddress: account.address } as any,
				});

				await transactionAsset.apply(context);

				await expect(() => transactionAsset.apply(context1)).rejects.toThrow(
					'You have already a patient account !'
				)

			});

			it('should throw error if patient identification number is already registered', async() => {
				const context2 = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "003301012022", areaCode: "221_SENEGAL", username: "mous.adh" },
					transaction: { senderAddress: account2.address } as any,
				});

				const context3 = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "003301012022", areaCode: "221_SENEGAL", username: "mouss.adh" },
					transaction: { senderAddress: account3.address } as any,
				});

				await transactionAsset.apply(context2);

				await expect(() => transactionAsset.apply(context3)).rejects.toThrow(
					'This patient identification number is already registered !'
				)

			});

			it('should throw error if username is already reserved', async() => {
				const context4 = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "0003301012022", areaCode: "221_SENEGAL", username: "mou.adh" },
					transaction: { senderAddress: account4.address } as any,
				});

				const context5 = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "00003301012022", areaCode: "33_France", username: "mou.adh" },
					transaction: { senderAddress: account5.address } as any,
				});

				await transactionAsset.apply(context4);

				await expect(() => transactionAsset.apply(context5)).rejects.toThrow(
					'This username is already reserved, please try another.'
				)

			});
		});
	});
});
