export interface PatientModuleProps {
    selfPatient: Buffer;
    reverseLookup: Buffer;
};


export interface CreatePatientAccountAssetProps {
	readonly patientIdentificationNumber: string;
	readonly areaCode: string;
	readonly username: string;
};


export interface RegisteredPatientAccountsSchemaProps {
	readonly registeredPatientAccounts: RegisteredPatientAccount[]
};


export interface RegisteredPatientAccount {
	readonly id: Buffer,
	readonly ownerAddress: Buffer,
	readonly patientIdentificationNumber: string,
	readonly areaCode: string,
	readonly username: string,
};




