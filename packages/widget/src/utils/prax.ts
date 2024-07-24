import {
  createPromiseClient,
  PromiseClient,
  Transport,
} from '@connectrpc/connect';
import { PenumbraProviderNotAvailableError } from '@penumbra-zone/client';
import {
  assertGlobalPresent,
  assertProviderConnected,
  getPenumbraPort,
} from '@penumbra-zone/client/create';
import { jsonOptions, PenumbraService } from '@penumbra-zone/protobuf';
import {
  ChannelTransportOptions,
  createChannelTransport,
} from '@penumbra-zone/transport-dom/create';

const prax_id = 'lkpmkhpnhknhmibgnmmhdhgdilepfghe';
const prax_origin = `chrome-extension://${prax_id}`;

export const getPraxOrigin = () => prax_origin;

export const getPraxManifest = () => getPenumbraManifest(prax_origin);

export const isPraxConnected = () => {
  try {
    assertProviderConnected(prax_origin);
    return true;
  } catch {
    return false;
  }
};

export const isPraxInstalled = async () => {
  try {
    await assertProviderManifest(prax_origin);
    return true;
  } catch {
    return false;
  }
};

export const throwIfPraxNotConnected = () =>
  assertProviderConnected(prax_origin);

export const throwIfPraxNotInstalled = async () =>
  assertProviderManifest(prax_origin);

export const requestPraxAccess = () =>
  assertProvider(prax_origin).then((p) => p.request());

export const createPraxTransport = () =>
  createPenumbraChannelTransportSync(prax_origin, { jsonOptions });

let praxTransport: Transport | undefined;
export const createPraxClient = <T extends PenumbraService>(
  service: T
): PromiseClient<T> =>
  createPromiseClient(service, (praxTransport ??= createPraxTransport()));

export const getPenumbraManifest = async (
  penumbraOrigin: string,
  signal?: AbortSignal
): Promise<PenumbraManifest> => {
  const manifestJson = await assertProviderManifest(penumbraOrigin, signal);
  if (!isPenumbraManifest(manifestJson)) {
    throw new TypeError('Invalid manifest');
  }
  return manifestJson;
};

/** Currently, Penumbra manifests are chrome extension manifest v3. There's no type
 * guard because manifest format is enforced by chrome. This type only describes
 * fields we're interested in as a client.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/manifest#keys
 */
export interface PenumbraManifest {
  /**
   * manifest id is present in production, but generally not in dev, because
   * they are inserted by chrome store tooling. chrome extension id are simple
   * hashes of the 'key' field, an extension-specific public key.
   *
   * developers may configure a public key in dev, and the extension id will
   * match appropriately, but will not be present in the manifest.
   *
   * the extension id is also part of the extension's origin URI.
   *
   * @see https://developer.chrome.com/docs/extensions/reference/manifest/key
   * @see https://web.archive.org/web/20120606044635/http://supercollider.dk/2010/01/calculating-chrome-extension-id-from-your-private-key-233
   */
  id?: string;
  key?: string;

  // these are required
  name: string;
  version: string;
  description: string;

  // these are optional, but might be nice to have
  homepage_url?: string;
  options_ui?: { page: string };
  options_page?: string;

  // icons are not indexed by number, but by a stringified number. they may be
  // any square size but the power-of-two sizes are typical. the chrome store
  // requires a '128' icon.
  icons: Record<`${number}`, string> & {
    ['128']: string;
  };
}

export const isPenumbraManifest = (mf: unknown): mf is PenumbraManifest =>
  mf !== null &&
  typeof mf === 'object' &&
  'name' in mf &&
  typeof mf.name === 'string' &&
  'version' in mf &&
  typeof mf.version === 'string' &&
  'description' in mf &&
  typeof mf.description === 'string' &&
  'icons' in mf &&
  typeof mf.icons === 'object' &&
  mf.icons !== null &&
  '128' in mf.icons &&
  mf.icons['128'] === 'string';

/**
 * Synchronously create a channel transport for the specified provider, or the
 * first available provider if unspecified.
 *
 * Will always succeed, but the transport may fail if the provider is not
 * present, or if the provider rejects the connection.
 *
 * Confirms presence of the provider's manifest.  Will attempt to request
 * approval if connection is not already active.
 *
 * @param requireProvider optional string identifying a provider origin
 * @param transportOptions optional `ChannelTransportOptions` without `getPort`
 */
export const createPenumbraChannelTransportSync = (
  requireProvider?: string,
  transportOptions: Omit<ChannelTransportOptions, 'getPort'> = { jsonOptions }
): Transport =>
  createChannelTransport({
    ...transportOptions,
    getPort: () => getPenumbraPort(requireProvider),
  });

/**
 * Given a specific origin, identify the relevant injection, and confirm its
 * manifest is actually present or throw.  An `undefined` origin is accepted but
 * will throw.
 */
export const assertProviderManifest = async (
  providerOrigin?: string,
  signal?: AbortSignal
) => {
  // confirm the provider injection is present
  const provider = assertProviderRecord(providerOrigin);

  let manifest: unknown;

  try {
    // confirm the provider manifest is located at the expected origin
    if (new URL(provider.manifest).origin !== providerOrigin) {
      throw new Error('Manifest located at unexpected origin');
    }

    // confirm the provider manifest can be fetched, and is json
    const req = await fetch(provider.manifest, { signal });
    manifest = await req.json();

    if (!manifest) {
      throw new Error(`Cannot confirm ${providerOrigin} is real.`);
    }
  } catch (e) {
    if (signal?.aborted !== true) {
      console.warn(e);
      throw new PenumbraProviderNotAvailableError(providerOrigin);
    }
  }

  return manifest;
};

/**
 * Given a specific origin, identify the relevant injection or throw.  An
 * `undefined` origin is accepted but will throw.
 */
export const assertProviderRecord = (providerOrigin?: string) => {
  const provider =
    providerOrigin &&
    assertGlobalPresent()[assertStringIsOrigin(providerOrigin)];
  if (!provider) {
    throw new PenumbraProviderNotAvailableError(providerOrigin);
  }
  return provider;
};

export const assertStringIsOrigin = (s?: string) => {
  if (!s || new URL(s).origin !== s) {
    throw new TypeError('Invalid origin');
  }
  return s;
};

export const assertProvider = (providerOrigin?: string) =>
  assertProviderManifest(providerOrigin).then(() =>
    assertProviderRecord(providerOrigin)
  );
