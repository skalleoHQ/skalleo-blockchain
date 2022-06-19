export interface ProfessionalModuleProps{
    selfProfessional: Buffer,
    reverseLookup: Buffer
};


export interface CreateProfessionalAccountAssetProps {
    readonly professionalIdentificationNumber: string;
    readonly areaCode: string;
    readonly username: string;
};


export interface RegisteredProfessionalAccountsSchemaProps {
    readonly registeredProfessionalAccounts: [];
};


export interface RegisteredProfessionalAccount {
    readonly id: Buffer;
    readonly ownerAddress: Buffer;
    readonly professionalIdentificationNumber: string;
    readonly areaCode: string;
    readonly username: string;
};

export interface TransmitCareAssetProps {
    readonly patientIdentificationNumber: string;
    readonly reverseLookup: string;
    readonly areaCode: string;
    readonly careSpecifications: string;
};


export interface RecordedCareSchemaProps {
    readonly recordedCare: [];
};

export interface ARecordedCare {
    readonly id: Buffer,
    readonly senderAddress: Buffer,
    readonly patientIdentificationNumber: string,
    readonly reverseLookup: string,
    readonly areaCode: string,
    readonly careSpecifications: string
}

