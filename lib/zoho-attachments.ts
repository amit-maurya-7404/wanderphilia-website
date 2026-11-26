import fs from 'fs';
import path from 'path';
import { getZohoAccessToken, getZohoApiUrl } from './zoho';

/**
 * Uploads a file buffer as an Attachment to any Zoho CRM module record (Leads, Deals, Finance, Operations)
 */
export async function uploadZohoRecordAttachment(
  moduleName: string,
  recordId: string,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string = 'image/jpeg'
): Promise<{ success: boolean; attachmentId?: string; error?: string }> {
  try {
    const accessToken = await getZohoAccessToken();
    const url = getZohoApiUrl(`/crm/v3/${moduleName}/${recordId}/Attachments`);

    const blob = new Blob([fileBuffer], { type: mimeType });
    const formData = new FormData();
    formData.append('file', blob, fileName);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Zoho CRM ${moduleName} Attachment Error]: Status ${response.status}:`, errorText);
      return { success: false, error: `Upload failed: ${response.statusText}` };
    }

    const data = await response.json();
    if (data.data && data.data[0] && data.data[0].status === 'success') {
      console.log(`[Zoho CRM Attachment Success] Uploaded ${fileName} to ${moduleName} ${recordId}`);
      return { success: true, attachmentId: data.data[0].details?.id };
    }

    return { success: false, error: JSON.stringify(data) };
  } catch (err: any) {
    console.error(`[Zoho CRM ${moduleName} Attachment Exception]:`, err);
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Resolves a file URL/path (disk path, data URL, or remote URL) and uploads as attachment to target Zoho records
 */
export async function uploadProofUrlToZohoRecords(
  fileUrlOrPath: string,
  defaultFileName: string,
  targetRecords: Array<{ module: string; id: string }>
): Promise<Array<{ module: string; id: string; success: boolean; attachmentId?: string }>> {
  const results: Array<{ module: string; id: string; success: boolean; attachmentId?: string }> = [];
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string' || !fileUrlOrPath.trim()) {
    return results;
  }

  const cleanUrl = fileUrlOrPath.trim();
  let buffer: Buffer | null = null;
  let mimeType = 'image/jpeg';
  let fileName = defaultFileName || `proof_${Date.now()}.jpg`;

  try {
    if (cleanUrl.startsWith('data:')) {
      const match = cleanUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        buffer = Buffer.from(match[2], 'base64');
        const ext = mimeType.split('/')[1] || 'jpg';
        if (!fileName.includes('.')) fileName = `${fileName}.${ext}`;
      }
    } else if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      const resp = await fetch(cleanUrl);
      if (resp.ok) {
        const ab = await resp.arrayBuffer();
        buffer = Buffer.from(ab);
        const ct = resp.headers.get('content-type');
        if (ct) mimeType = ct;
      }
    } else {
      // Local public file path (e.g. /images/uploads/...)
      const cleanedRel = cleanUrl.replace(/^\/+/, '').replace(/^public\//, '');
      const filePath = path.join(process.cwd(), 'public', cleanedRel);
      if (fs.existsSync(filePath)) {
        buffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.webp') mimeType = 'image/webp';
        else if (ext === '.pdf') mimeType = 'application/pdf';
        else mimeType = 'image/jpeg';
        fileName = path.basename(filePath);
      }
    }

    if (!buffer) {
      console.warn(`[Zoho Proof Upload] Could not resolve buffer for proof URL: ${cleanUrl.substring(0, 80)}`);
      return results;
    }

    for (const target of targetRecords) {
      if (!target.id || !target.module) continue;
      const res = await uploadZohoRecordAttachment(target.module, target.id, buffer, fileName, mimeType);
      results.push({
        module: target.module,
        id: target.id,
        success: res.success,
        attachmentId: res.attachmentId
      });
    }
  } catch (err) {
    console.error(`[Zoho Proof Upload Exception]:`, err);
  }

  return results;
}
