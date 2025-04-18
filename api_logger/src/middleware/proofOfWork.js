export async function proofOfWork(data) {
  const challenge = data.challenge;

  if (!challenge) {
    console.error('Challenge non trouvé dans les données!');
    return;
  }

  let nonce = 1;
  let hash = '';

  while (true) {
    const message = challenge + nonce;

    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);

    const hashBuffer = await crypto.subtle.digest('SHA-256', messageBytes);

    const hashArray = new Uint8Array(hashBuffer);
    hash = Array.from(hashArray)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    if (hash.startsWith('000')) {
      return { nonce };
    }

    nonce++;
  }
}
