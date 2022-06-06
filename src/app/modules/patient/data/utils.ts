import { codec, cryptography } from 'lisk-sdk';

const VALID_PATIENT_DOMAIN = ['adh'];

const registeredPatientAccountsSchema = {
    $id: 'patient/registeredPatients',
    type: 'object',
    required: ['registeredPatientAccounts'],
    properties: {
        registeredPatientAccounts: {
            type: 'array',
            fieldNumber: 1,
            items: {
                type: 'object',
                required: ['id', 'ownerAddress', 'patientIdentificationNumber', 'areaCode', 'username'],
                properties: {
                    
                } 
            }
        }
    }
}


















module.exports = {
    VALID_PATIENT_DOMAIN,
}

