import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';

const express = require('express');
const cors = require('cors');


const { getDBInstance,
		getPatientHistory,
		getAllTransactions,
		savePatientHistory,
		savedTransactions,

} = require('../medical_record/data/utils');

 /* eslint-disable class-methods-use-this */
 /* eslint-disable  @typescript-eslint/no-empty-function */
 export class MedicalRecordPlugin extends BasePlugin {
	// private _channel!: BaseChannel;
	_server = undefined;
	_app = undefined;
	_channel!: BaseChannel;
	_db = undefined;
	_nodeInfo = undefined;



	public static get alias(): string {
		return 'medicalRecord';
	};


	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			author: 'moussa',
			version: '0.1.0',
			name: 'medicalRecord',
		};
	};


	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	public get defaults(): SchemaWithDefault {
		return {
			$id: '/plugins/plugin-medicalRecord/config',
			type: 'object',
			properties: {},
			required: [],
			default: {},
		}
	};


	public get events(): EventsDefinition {
		return [
			// 'block:created',
			// 'block:missed'
		];
	};


	public get actions(): ActionsDefinition {
		return {
		// 	hello: async () => { hello: 'world' },
		};
	};
	

	public async load(channel: BaseChannel): Promise<void> {
		this._app = express();
		this._channel = channel;
		this._db = await getDBInstance();
		this._nodeInfo = await this._channel.invoke('app:getNodeInfo');
		

		this._app.use(cors({origin: '*', methods: ['GET', 'POST', 'PUT'] }));
		this._app.use(express.join());

		this._app.get('/api/patient_cares', async (req, res) => {
			const patientAccounts = await this._channel.invoke('patient:getAllPatientAccounts');
			
		})
		// this._channel = channel;
		// this._channel.once('app:ready', () => {});
	};


	public async unload(): Promise<void> {

	}
}
