import {BillingService} from './api/billing';
import {InfoService} from './api/info';
import {EmecefConfig} from './api/config';

/**
 * Point d'entrée principal de la librairie.
 *
 * @example
 * // Via paramètres explicites
 * const client = new EmecefClient({
 *   baseUrl: 'https://your-emecef-host.com/sygmef-emcf/api',
 *   token: 'your-bearer-token',
 * });
 *
 * @example
 * // Via variables d'environnement (EMECEF_BASE_URL, EMECEF_TOKEN)
 * const client = new EmecefClient();
 *
 * await client.billing.createInvoice({ ... });
 * await client.info.getTaxGroups();
 */
export class EmecefClient {
    public readonly billing: BillingService;
    public readonly info: InfoService;

    constructor(config?: Partial<EmecefConfig>) {
        this.billing = new BillingService(config);
        this.info = new InfoService(config);
    }
}
