import { testing } from 'lisk-sdk';
import { TransmitCareAsset } from '../../../../../src/app/modules/professional/assets/transmit_care_asset';

describe('TransmitCareAsset', () => {
  let transactionAsset: TransmitCareAsset;

	beforeEach(() => {
		transactionAsset = new TransmitCareAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(2);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('transmitCare');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
			it('should throw error if patientIdentificationNumber box is empty', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "", reverseLookup: "moussa.adh", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problèmes" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter identification number of your patient'
				)
			});

			it('should throw error if reverseLookup is empty', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problèmes" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter username of your patient'
				)
			});

			it('should throw error if areaCode is empty', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "moussa.adh", areaCode: "", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problèmes" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter areaCode of your patient'
				)
			});

			it('should throw error if careSpecs is empty', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "moussa.adh", areaCode: "221_SENEGAL", 
						careSpecifications: "" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'Please update the cares specifications of your patient !'
				)
			});

			it('should throw error if reverseLookup is not right', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "by.moussa.adh", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problèmes" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You may not use "." than for the domain'
				)
			});

			it('should throw error if reverseLookup is not right', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "by.moussa", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problèmes" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'Invalid domain found "moussa". Valid domain is "adh"'
				)
			});

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
