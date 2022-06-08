import { testing } from 'lisk-sdk';
import { CreatePatientAccountAsset } from '../../../../../src/app/modules/patient/assets/create_patient_account_asset';

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
					asset: {patientIdentificationNumber: "3301012022", areaCode: "33_France", username: "by.moussa.adh"},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});
				expect(() => transactionAsset.validate(context)).toThrow(
					'You may not use "." than for the domain'
				)
			});

			it('should throw error if username has more than one domain', () => {
				const context = testing.createValidateAssetContext({
					asset: {patientIdentificationNumber: "3301012022", areaCode: "33_France", username: "by.moussa"},
					transaction: {senderAddress: Buffer.alloc(0)} as any,
				});
				expect(() => transactionAsset.validate(context)).toThrow(
					'Invalid domain found "moussa". Valid domain is "adh"'
				)
			});




			it.todo('should be ok for valid schema');
		});
	});



	describe('apply', () => {
		describe('valid cases', () => {
			it.todo('should update the state store');
		});


		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
