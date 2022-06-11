export interface PatientModuleProps {
    readonly selfPatient: Buffer;
    readonly reverseLookup: Buffer;
};


export interface CreatePatientAccountAssetProps {
	readonly patientIdentificationNumber: string;
	readonly areaCode: string;
	readonly username: string;
};


export interface RegisteredPatientAccountsSchemaProps {
	readonly registeredPatientAccounts: []
};


export interface RegisteredPatientAccount {
	readonly id: Buffer,
	readonly ownerAddress: Buffer,
	readonly patientIdentificationNumber: string,
	readonly areaCode: string,
	readonly username: string,
};



