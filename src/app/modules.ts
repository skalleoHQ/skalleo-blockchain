/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { PatientModule } from "./modules/patient/patient_module";
import { ProfessionalModule } from "./modules/professional/professional_module";

// ts-expect-error Unused variable error happens here until at least one module is registered
export const registerModules = (app: Application): void => {
    app.registerModule(PatientModule);
    app.registerModule(ProfessionalModule);
};
