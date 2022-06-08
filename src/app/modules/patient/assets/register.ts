export interface PatientModuleProps {
    selfPatient: 'bytes';
    reverseLookup: 'string';
};


export interface CreatePatientAccountAssetProps {
	patientIdentificationNumber: string;
	areaCode: string;
	username: string;
};


export interface RegisteredPatientAccountsSchemaProps {
	registeredPatientAccounts: []
};



