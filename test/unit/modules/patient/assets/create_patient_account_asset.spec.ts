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
					asset: {patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "by.moussa.adh"},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You may not use "." than for the domain'
				)
			});

			it('should throw error if username doesnt contain adh', () => {
				const context = testing.createValidateAssetContext({
					asset: {patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "by.moussa"},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'Invalid domain found "moussa". Valid domain is "adh"'
				)
			});

			it('should throw error if user doesnt add his patient identification number', () => {
				const context = testing.createValidateAssetContext({
					asset: {patientIdentificationNumber: "", areaCode: "33_FRANCE", username: "moussa.adh"},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your identification number'
				)
			});

			it('should throw error if user doesnt add his area code', () => {
				const context = testing.createValidateAssetContext({
					asset: {patientIdentificationNumber: "3301012022", areaCode: "", username: "moussa.adh"},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your areaCode, you can find it on https://skalleo.io'
				)
			});

			it('should throw error if username doesnt a username', () => {
				const context = testing.createValidateAssetContext({
					asset: {patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: ""},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});
				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your username, please use "." only in front of "adh'
				)
			});

			it('should be ok for valid schema', () => {
				const context = testing.createValidateAssetContext({
					asset: {patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "moussa.adh"},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});

				expect(() => transactionAsset.validate(context)).not.toThrow();
			});

		});
	});



	describe('apply', () => {
		let stateStore: StateStore;
		let account: any;

		beforeEach(() => {
			account = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);

			stateStore = new testing.mocks.StateStoreMock({
				accounts: [account],
			});

			jest.spyOn(stateStore.chain, 'get');
			jest.spyOn(stateStore.chain, 'set');
		});

		describe('valid cases', () => {
			it('should update the state store with patient account', async () => {
				/*const username = "moussa.adh";
				const allAccounts = await getAllPatientAccounts(stateStore);
				const accountIndex = allAccounts.findIndex((t) => t.id.equals(username));
				const patientAccount = allAccounts[accountIndex];
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: {patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "moussa.adh"},
					transaction: {senderAddress: account.address} as any,
				});

				await transactionAsset.apply(context);

				expect(stateStore.chain.set).toHaveBeenCalledWith(
					context.stateStore
					);*/
			});
		});


		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
