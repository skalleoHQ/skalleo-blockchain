import { 
	Application, 
	//PartialApplicationConfig, 
	configDevnet, 
	genesisBlockDevnet, 
	utils,

} from 'lisk-sdk';

import { registerModules } from './modules';
import { registerPlugins } from './plugins';

const EMPTY_BUFFER = Buffer.alloc(0);



//update genesis block timestamp
genesisBlockDevnet.header.timestamp = 0_0;

//update genesis block accounts to include patient and professional module attributes
genesisBlockDevnet.header.asset.accounts =  genesisBlockDevnet.header.asset.accounts.map(
	(a) => 
			utils.objects.mergeDeep({}, a, {
				patient: {
					selfPatient: EMPTY_BUFFER,
					reverseLookup: EMPTY_BUFFER,
				},
				professional: {
					selfProfessional: EMPTY_BUFFER,
					reverseLookup: EMPTY_BUFFER,
				},
			}),
);

//update application config to include unique label
//and communityIdentifier to mitigate transaction replay
const appConfig = utils.objects.mergeDeep({}, configDevnet, {
	label: 'skalleo-app',
	genesisConfig: {communityIdentifier: 'SKA'},
	logger: {
		consoleLogLevel: 'info',
	}
})	


/*export const getApplication = (
	genesisBlock: Record<string, unknown>,
	config: PartialApplicationConfig,
): Application => {}*/
	const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

	//register our modules and plugins
	registerModules(app);
	registerPlugins(app);
	
	//run app
	app
		.run()
		.then(() => console.info('Skalleo blockchain running...'))
		.catch(console.error)

