import releases from '../data/mainland-downloads.json';

export function initMainlandDownload() {
  const link = document.querySelector<HTMLAnchorElement>('#modal-download-mainland');
  const box = document.querySelector<HTMLElement>('#mainland-progress');
  if (!link || !box || link.dataset.ready) return;
  link.dataset.ready = 'true';
  const status = box.querySelector<HTMLElement>('[role="status"]')!;
  const progress = box.querySelector<HTMLProgressElement>('progress')!;
  const cancel = box.querySelector<HTMLButtonElement>('button')!;
  const save = box.querySelector<HTMLAnchorElement>('a')!;
  const language = document.documentElement.lang;
  const copy = language.startsWith('zh') ? {
    loading: '正在下载，请保持页面打开', saving: '下载完成，正在保存 APK。若未自动保存，请点击“保存 APK”。',
    failed: '下载失败，请重试或使用“直接下载”。', cancelled: '下载已取消。', save: '保存 APK', cancel: '取消',
  } : language.startsWith('ja') ? {
    loading: 'ダウンロード中。このページを開いたままにしてください', saving: 'ダウンロード完了。保存が始まらない場合は「APKを保存」を押してください。',
    failed: '失敗しました。再試行するか「直接ダウンロード」をご利用ください。', cancelled: 'キャンセルしました。', save: 'APKを保存', cancel: 'キャンセル',
  } : {
    loading: 'Downloading. Keep this page open', saving: 'Download complete. If saving does not start, select Save APK.',
    failed: 'Download failed. Retry or use Direct Download.', cancelled: 'Download cancelled.', save: 'Save APK', cancel: 'Cancel',
  };
  save.textContent = copy.save;
  cancel.textContent = copy.cancel;
  let controller: AbortController | null = null;
  let objectUrl: string | null = null;
  cancel.addEventListener('click', () => controller?.abort());
  // Closing the dialog stops the transfer instead of leaving it running unseen.
  const stop = () => controller?.abort();
  document.getElementById('close-download')?.addEventListener('click', stop);
  document.getElementById('download-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) stop();
  });
  window.addEventListener('pagehide', () => {
    stop();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, { once: true });

  link.addEventListener('click', async event => {
    event.preventDefault();
    if (controller) return;
    const release = releases.find(entry => entry.url === link.href);
    if (!release) return;
    controller = new AbortController();
    const signal = controller.signal;
    link.setAttribute('aria-disabled', 'true');
    box.hidden = false;
    save.hidden = true;
    cancel.hidden = false;
    progress.hidden = false;
    progress.value = 0;
    progress.max = release.bytes;
    status.textContent = copy.loading;
    if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
    try {
      const response = await fetch(release.url, { signal, mode: 'cors', credentials: 'omit' });
      if (!response.ok || !response.body) throw new Error('Download unavailable');
      const reader = response.body.getReader();
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      let received = 0;
      let lastPaint = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > release.bytes) { await reader.cancel(); throw new Error('Incorrect APK size'); }
        chunks.push(new Uint8Array(value));
        if (performance.now() - lastPaint > 100) {
          progress.value = received;
          status.textContent = `${copy.loading} · ${Math.floor(received / release.bytes * 100)}%`;
          lastPaint = performance.now();
        }
      }
      if (received !== release.bytes) throw new Error('Incomplete APK');
      const blob = new Blob(chunks, { type: 'application/vnd.android.package-archive' });
      const bytes = await blob.arrayBuffer();
      if (new Uint8Array(bytes)[0] !== 0x50 || new Uint8Array(bytes)[1] !== 0x4b) throw new Error('Not an APK');
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
      if (hash !== release.sha256) throw new Error('APK checksum mismatch');
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      objectUrl = URL.createObjectURL(blob);
      const build = new URL(release.apk, location.origin).searchParams.get('build');
      const filename = release.apk.split('?')[0].split('/').pop()!;
      save.download = build ? filename.replace(/\.apk$/, `_build${build}.apk`) : filename;
      save.href = objectUrl;
      save.hidden = false;
      progress.value = release.bytes;
      status.textContent = copy.saving;
      save.click();
    } catch {
      progress.hidden = true;
      status.textContent = signal.aborted ? copy.cancelled : copy.failed;
    } finally {
      controller = null;
      link.removeAttribute('aria-disabled');
      cancel.hidden = true;
    }
  });
}
