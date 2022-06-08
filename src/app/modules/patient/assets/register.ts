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



