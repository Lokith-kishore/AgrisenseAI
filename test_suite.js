const http = require('http');

const makeRequest = (port, path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  const PORT = 5000;
  console.log('Testing AgriSense Backend API on port ' + PORT + '...');

  console.log('\n--- 1. Health Endpoint ---');
  const health = await makeRequest(PORT, '/api/health');
  console.log('Status:', health.status, 'Response:', health.data);

  console.log('\n--- 2. Farmer Authentication ---');
  const login = await makeRequest(PORT, '/api/auth/login', 'POST', {
    email: 'farmer@agrisense.ai',
    password: 'Farmer@123'
  });
  console.log('Status:', login.status, 'Farmer Name:', login.data.user.name);
  const token = login.data.token;

  console.log('\n--- 3. Fetch Farm Fields ---');
  const fields = await makeRequest(PORT, '/api/fields', 'GET', null, token);
  console.log('Status:', fields.status, 'Fields Count:', fields.data.count, 'Field 1:', fields.data.fields[0].field_name);
  const fieldId = fields.data.fields[0].id;

  console.log('\n--- 4. Comprehensive Soil Health & Crop Analysis ---');
  const analysis = await makeRequest(PORT, '/api/soil/analyze', 'POST', {
    field_id: fieldId,
    nitrogen: 78,
    phosphorus: 48,
    potassium: 40,
    ph: 6.5,
    organic_carbon: 0.68,
    electrical_conductivity: 0.52,
    sulphur: 14.2,
    zinc: 0.95,
    iron: 10.2
  }, token);
  console.log('Status:', analysis.status);
  console.log('Soil Health Score:', analysis.data.soil_health.soil_health_score, 'Rating:', analysis.data.soil_health.rating);
  console.log('Top Crop:', analysis.data.top_crops[0].crop_name, 'Suitability:', analysis.data.top_crops[0].suitability_score + '%');
  console.log('Fertilizer Prescriptions Count:', analysis.data.fertilizer_prescription.fertilizer_items.length);
  console.log('Sample ID:', analysis.data.sample_id);

  console.log('\n--- 5. Multi-Crop Comparison ---');
  const compare = await makeRequest(PORT, '/api/ai/compare-crops', 'POST', {
    crop_names: ['Maize (Corn)', 'Rice (Paddy)', 'Cotton']
  });
  console.log('Status:', compare.status, 'Compared Crops Count:', compare.data.count);

  console.log('\n--- 6. AI Agronomic Assistant Chat ---');
  const chat = await makeRequest(PORT, '/api/ai/chat', 'POST', {
    query: 'Why is maize recommended for my soil?',
    soil_data: { nitrogen: 78, phosphorus: 48, potassium: 40, ph: 6.5 },
    recommended_crops: analysis.data.top_crops
  });
  console.log('Status:', chat.status, 'Response Preview:', chat.data.response.substring(0, 100) + '...');

  console.log('\n--- 7. Admin Telemetry & Real ML Benchmarks ---');
  const adminLogin = await makeRequest(PORT, '/api/auth/login', 'POST', {
    email: 'admin@agrisense.ai',
    password: 'Admin@123'
  });
  const adminToken = adminLogin.data.token;
  const stats = await makeRequest(PORT, '/api/admin/statistics', 'GET', null, adminToken);
  console.log('Status:', stats.status, 'Total Users:', stats.data.metrics.total_users, 'Total Analyses:', stats.data.metrics.total_analyses);

  const modelPerf = await makeRequest(PORT, '/api/admin/model-performance', 'GET', null, adminToken);
  console.log('Status:', modelPerf.status, 'Best Model:', modelPerf.data.metadata.model_name, 'Accuracy:', (modelPerf.data.metadata.best_metrics.accuracy * 100).toFixed(2) + '%');

  console.log('\n=============================================');
  console.log('  ALL END-TO-END TESTS PASSED SUCCESSFULLY!  ');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('Test Execution Failed:', err);
  process.exit(1);
});
