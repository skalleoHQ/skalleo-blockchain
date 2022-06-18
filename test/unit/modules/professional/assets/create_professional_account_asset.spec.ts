import { StateStore, testing } from 'lisk-sdk';
import { CreateProfessionalAccountAsset } from '../../../../../src/app/modules/professional/assets/create_professional_account_asset';
import { ProfessionalModuleProps } from '../../../../../src/app/modules/professional/assets/register';
import { ProfessionalModule } from '../../../../../src/app/modules/professional/professional_module';

describe('CreateProfessionalAccountAsset', () => {
  let transactionAsset: CreateProfessionalAccountAsset;

	beforeEach(() => {
		transactionAsset = new CreateProfessionalAccountAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(1);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('createProfessionalAccount');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
			it('should if username has more than one domain', () => {
				const context = testing.createValidateAssetContext({
					asset: { professionalIdentificationNumber: "3301012022", areaCode: "33_FRANCE", username: "PharmaciePorteD.Aix.pro" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You may not use "." than for the domain'
				)
			});

			it('should throw error if username doesnt contain pro', () => {
				const context = testing.createValidateAssetContext({
					asset: { professionalIdentificationNumber: "3301012022", areaCode: "33_FRANCE", username: "PharmaciePorteD.Aix" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'Invalid domain found "Aix". Valid domain is "pro"'
				)
			});

			it('should throw error if user doesnt add his professional identification number', () => {
				const context = testing.createValidateAssetContext({
					asset: { professionalIdentificationNumber: "", areaCode: "33_FRANCE", username: "PharmaciePorteDAix.pro" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your identification number'
				)
			});

			it('should throw error if user doesnt add his area code', () => {
				const context = testing.createValidateAssetContext({
					asset: { professionalIdentificationNumber: "3301012022", areaCode: "", username: "PharmaciePorteDAix.pro" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your areaCode, you can find it on https://skalleo.io'
				)
			});

			it('should throw error if username doesnt a username', () => {
				const context = testing.createValidateAssetContext({
					asset: { professionalIdentificationNumber: "3301012022", areaCode: "33_FRANCE", username: "" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				})

				expect(() => transactionAsset.validate(context)).toThrow(
					'You must enter your username, please use "." only in front of "pro'
				)
			});

			it('should be ok for valid schema', () => {
				const context = testing.createValidateAssetContext({
					asset: { professionalIdentificationNumber: "3301012022", areaCode: "33_FRANCE", username: "PharmaciePorteDAix.pro" },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				})

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
			account = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);
			account1 = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);
			account2 = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);
			account3 = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);
			account4 = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);
			account5 = testing.fixtures.createDefaultAccount<ProfessionalModuleProps>([ProfessionalModule]);

			stateStore = new testing.mocks.StateStoreMock({
				accounts: [account, account1, account2, account3, account4, account5],
			});

			jest.spyOn(stateStore.chain, 'get');
			jest.spyOn(stateStore.chain, 'set');
		});

		describe('valid cases', () => {
			it('should update the state store with professional account', async () => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { professionalIdentificationNumber: "3301012022", areaCode: "33_FRANCE", username: "PharmaciePorteDAix.pro" },
					transaction: { senderAddress: account.address } as any,
				});

				await transactionAsset.apply(context);

				expect(stateStore.chain.networkIdentifier).toEqual(context.stateStore.chain.networkIdentifier);
				expect(stateStore.chain.set).toBe(context.stateStore.chain.set);
				expect(stateStore.chain.set).toHaveBeenCalledWith("professional: registeredProfessionalAccounts", expect.any(Buffer))
			});
		});

		describe('invalid cases', () => {
			it('should throw error if professional is already registered', async() => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { professionalIdentificationNumber: "3301012022", areaCode: "221_SENEGAL", username: "CliniqueNdiaye.pro" },
					transaction: { senderAddress: account.address } as any,
				});

				const context1 = testing.createApplyAssetContext({
					stateStore,
					asset: { professionalIdentificationNumber: "03301012022", areaCode: "221_SENEGAL", username: "OptiqueSud.pro" },
					transaction: { senderAddress: account.address } as any,
				});

				await transactionAsset.apply(context);

				await expect(() => transactionAsset.apply(context1)).rejects.toThrow(
					'You have already a professional account !'
				)

			});

			it('should throw error if professional identification number is already registered', async() => {
				const context2 = testing.createApplyAssetContext({
					stateStore,
					asset: { professionalIdentificationNumber: "003301012022", areaCode: "221_SENEGAL", username: "PharmacieBourguyba.pro" },
					transaction: { senderAddress: account2.address } as any,
				});

				const context3 = testing.createApplyAssetContext({
					stateStore,
					asset: { professionalIdentificationNumber: "003301012022", areaCode: "221_SENEGAL", username: "PharmacieAlmadies.pro" },
					transaction: { senderAddress: account3.address } as any,
				});

				await transactionAsset.apply(context2);

				await expect(() => transactionAsset.apply(context3)).rejects.toThrow(
					'This professional identification number is already registered !'
				)
			});

			it('should throw error if username is already reserved', async() => {
				const context4 = testing.createApplyAssetContext({
					stateStore,
					asset: { professionalIdentificationNumber: "0003301012022", areaCode: "221_SENEGAL", username: "CliniqueNdiaye.pro" },
					transaction: { senderAddress: account4.address } as any,
				});

				const context5 = testing.createApplyAssetContext({
					stateStore,
					asset: { professionalIdentificationNumber: "00003301012022", areaCode: "33_France", username: "CliniqueNdiaye.pro" },
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
