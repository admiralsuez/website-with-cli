/**
 * @fileOverview This file configures and exports the Genkit AI instance.
 */
import {genkit} from 'genkit';
import {googleAI} from 'genkit/googleai';
import {firebase} from 'genkit/firebase';

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
      apiVersion: ['v1beta'],
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
