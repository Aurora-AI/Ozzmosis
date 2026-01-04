import * as vercelBlob from "@vercel/blob";

/**
 * Adapter para isolar @vercel/blob do resto do app.
 * Em testes, este módulo pode ser mockado.
 */
export const blobClient = {
  put: (...args: Parameters<typeof vercelBlob.put>) => {
    if (!vercelBlob.put) throw new Error('blobClient.put unavailable (missing @vercel/blob.put)');
    // @ts-expect-error runtime-guarded
    return vercelBlob.put(...args);
  },
  del: (...args: Parameters<typeof vercelBlob.del>) => {
    if (!vercelBlob.del) throw new Error('blobClient.del unavailable (missing @vercel/blob.del)');
    // @ts-expect-error runtime-guarded
    return vercelBlob.del(...args);
  },
  head: (...args: Parameters<typeof vercelBlob.head>) => {
    if (!vercelBlob.head) throw new Error('blobClient.head unavailable (missing @vercel/blob.head)');
    // @ts-expect-error runtime-guarded
    return vercelBlob.head(...args);
  },
  list: (...args: Parameters<typeof vercelBlob.list>) => {
    if (!vercelBlob.list) throw new Error('blobClient.list unavailable (missing @vercel/blob.list)');
    // @ts-expect-error runtime-guarded
    return vercelBlob.list(...args);
  },
};

export type BlobClient = typeof blobClient;
