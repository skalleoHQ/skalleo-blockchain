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
}




