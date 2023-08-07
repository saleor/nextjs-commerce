import { FlattenedJWSInput, createRemoteJWKSet, flattenedVerify } from 'jose';
import { NextRequest } from 'next/server';
import { WebhookSubscriptionSubscription } from './generated/graphql';

const getJwksUrlFromSaleorApiUrl = (saleorApiUrl: string) =>
  `${new URL(saleorApiUrl).origin}/.well-known/jwks.json`;

export const verifySignature = async (req: NextRequest, endpoint: string) => {
  const signature = req.headers.get('saleor-signature');
  const saleorApiUrl = req.headers.get('saleor-api-url');

  if (!signature) {
    console.warn('Missing signature header');
    return null;
  }
  const [header, , jwsSignature] = signature.split('.');
  if (!jwsSignature || !header) {
    console.warn('Signature is invalid');
    return null;
  }
  if (!saleorApiUrl) {
    console.warn('Missing saleor-api-url header');
    return null;
  }
  try {
    const url1 = new URL(saleorApiUrl);
    const url2 = new URL(endpoint);
    if (url1.origin !== url2.origin) {
      console.warn('saleor-api-url header is not the same as the request origin');
      return null;
    }
  } catch {
    console.warn('saleor-api-url header is not a valid URL');
    return null;
  }

  const rawBody = await req.text();
  const jws: FlattenedJWSInput = {
    protected: header,
    payload: rawBody,
    signature: jwsSignature,
  };

  try {
    const remoteJwks = createRemoteJWKSet(new URL(getJwksUrlFromSaleorApiUrl(endpoint)));
    await flattenedVerify(jws, remoteJwks);
  } catch {
    console.warn('Signature is invalid');
    return null;
  }

  try {
    const json = JSON.parse(rawBody);
    if ('event' in json) {
      return json.event as WebhookSubscriptionSubscription['event'];
    }
    return json as WebhookSubscriptionSubscription['event'];
  } catch (err) {
    console.warn('Body is not a valid JSON', err);
    return null;
  }
};
