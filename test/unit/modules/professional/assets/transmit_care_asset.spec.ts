import { StateStore, testing } from 'lisk-sdk';
import { CreatePatientAccountAsset } from '../../../../../src/app/modules/patient/assets/create_patient_account_asset';
import { PatientModuleProps } from '../../../../../src/app/modules/patient/assets/register';
import { PatientModule } from '../../../../../src/app/modules/patient/patient_module';
import { ProfessionalModuleProps } from '../../../../../src/app/modules/professional/assets/register';
import { TransmitCareAsset } from '../../../../../src/app/modules/professional/assets/transmit_care_asset';
import { ProfessionalModule } from '../../../../../src/app/modules/professional/professional_module';

describe('TransmitCareAsset', () => {
  let transactionAsset: TransmitCareAsset;
  let createPatientAccountAsset: CreatePatientAccountAsset;

	beforeEach(() => {
		transactionAsset = new TransmitCareAsset();
		createPatientAccountAsset = new CreatePatientAccountAsset(); 
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
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter identification number of your patient'
				)
			});

			it('should throw error if reverseLookup is empty', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter username of your patient'
				)
			});

			it('should throw error if areaCode is empty', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "moussa.adh", areaCode: "", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
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
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You may not use "." than for the domain'
				)
			});

			it('should throw error if reverseLookup is not right', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "by.moussa", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'Invalid domain found "moussa". Valid domain is "adh"'
				)
			});

			it('should be ok for valid schema', () => {
				const context = testing.createValidateAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "moussa.adh", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				expect(() => transactionAsset.validate(context)).not.toThrow();
			});

		});
	});

	describe('apply', () => {
		let stateStore: StateStore;
		let account: any;
		let account1: any;
		let proAccount: any;
		let proAccount1: any;

		beforeEach(() => {
			account = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);
			account1 = testing.fixtures.createDefaultAccount<PatientModuleProps>([PatientModule]);
			proAccount = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);
			proAccount1 = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);

			stateStore = new testing.mocks.StateStoreMock({
				accounts: [account, account1, proAccount, proAccount1],
			});

			jest.spyOn(stateStore.chain, 'get');
			jest.spyOn(stateStore.chain, 'set');
		})

		describe('valid cases', () => {
			it('should update the state store with the care transmitted', async() => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "moussa.adh" },
					transaction: { senderAddress: account.address } as any,
				});

				await createPatientAccountAsset.apply(context);

				const context1 = testing.createApplyAssetContext({
					stateStore,
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "moussa.adh", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
					transaction: { senderAddress: proAccount.address } as any
				})

				await transactionAsset.apply(context1);
				
				expect(stateStore.chain.networkIdentifier).toEqual(context1.stateStore.chain.networkIdentifier);
				expect(stateStore.chain.set).toBe(context1.stateStore.chain.set);
				expect(stateStore.chain.set).toHaveBeenCalledWith("professional: recordedCare", expect.any(Buffer))

			});
		});

		describe('invalid cases', () => {
			/*it('should throw error patient not found', async() => {
				const context = testing.createApplyAssetContext({
					asset: { patientIdentificationNumber: "3301012022", reverseLookup: "moussa.adh", areaCode: "221_SENEGAL", 
						careSpecifications: "Juste un examen de prévention, Conclusion: le patient ne présente aucun problème" },
					transaction: { senderAddress: Buffer.alloc(0) } as any
				})

				await transactionAsset.apply(context);

				await expect(() => transactionAsset.apply(context)).rejects.toThrow(
					'Patient not found !'
				)
			});*/



		});

	});

});
