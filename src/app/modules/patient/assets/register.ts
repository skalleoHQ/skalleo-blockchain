export interface PatientModuleProps {
    selfPatient: 'bytes';
    reverseLookup: 'bytes';
};


export interface CreatePatientAccountAssetProps {
	patientIdentificationNumber: string;
	areaCode: string;
	username: string;
};


export interface RegisteredPatientAccountsSchemaProps {
	registeredPatientAccounts: []
};


export interface RegisteredPatientAccount {
	id: 'bytes',
	ownerAddress: 'bytes',
	patientIdentificationNumber:'string',
	areaCode: 'string',
	username: 'string',
};



