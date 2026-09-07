const BASE_URL = 'http://localhost:5000/api';

async function postJson(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  return { status: res.status, ok: res.ok, data: json };
}

async function runAuditTests() {
  const eventA_code = 'LR-DIP-04-UUHH';
  const timestamp = Date.now().toString().slice(-5);

  console.log('\n--- 150 Concurrent Students Performance Test ---');
  const requests = [];
  for (let i = 1; i <= 150; i++) {
    const r = `CON-${timestamp}-${String(i).padStart(3, '0')}`;
    requests.push(
      postJson(`${BASE_URL}/quiz/public-start`, {
        name: `Audit Student ${i}`,
        rollNumber: r,
        department: 'CSE',
        section: 'A',
        year: '1st Year',
        accessCode: eventA_code
      })
    );
  }

  const results = await Promise.all(requests);
  const success = results.filter((r) => r.ok && r.data.success);
  const fail = results.filter((r) => !r.ok);

  console.log(`Total 150 concurrent requests executed.`);
  console.log(`Successful attempts created: ${success.length}`);
  console.log(`Failed requests: ${fail.length}`);

  if (fail.length > 0) {
    console.log('Sample failure status & data:', fail[0]);
  }
}

runAuditTests();
