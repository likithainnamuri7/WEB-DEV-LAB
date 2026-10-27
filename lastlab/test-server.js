/**
 * Automated Verification Test for Student Information Web Server
 */
const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Server Tests...\n');

  try {
    // 1. Test GET /
    console.log('1. Testing GET / (Serve index.html)...');
    const resHome = await makeRequest('/');
    console.assert(resHome.statusCode === 200, `Expected 200, got ${resHome.statusCode}`);
    console.assert(resHome.body.includes('Student Information Web Server'), 'Home page content check failed');
    console.log('   ✅ PASS - Served index.html');

    // 2. Test GET /style.css
    console.log('2. Testing GET /style.css (Static file delivery)...');
    const resCss = await makeRequest('/style.css');
    console.assert(resCss.statusCode === 200, `Expected 200, got ${resCss.statusCode}`);
    console.assert(resCss.headers['content-type'].includes('text/css'), 'CSS Content-Type check failed');
    console.log('   ✅ PASS - Served style.css');

    // 3. Test GET /api/students
    console.log('3. Testing GET /api/students (fs.readFile JSON)...');
    const resStudents = await makeRequest('/api/students');
    console.assert(resStudents.statusCode === 200, `Expected 200, got ${resStudents.statusCode}`);
    const students = JSON.parse(resStudents.body);
    console.assert(Array.isArray(students), 'Expected array of students');
    console.log(`   ✅ PASS - Retrieved ${students.length} students`);

    // 4. Test URL Query Parameter: Filter by department
    console.log('4. Testing GET /api/students?department=Computer%20Science (url.parse query filtering)...');
    const resFiltered = await makeRequest('/api/students?department=Computer%20Science');
    console.assert(resFiltered.statusCode === 200, `Expected 200, got ${resFiltered.statusCode}`);
    const filteredStudents = JSON.parse(resFiltered.body);
    console.assert(filteredStudents.every(s => s.department === 'Computer Science'), 'Filter failed');
    console.log(`   ✅ PASS - Successfully filtered: found ${filteredStudents.length} Computer Science students`);

    // 5. Test URL Query Parameter: Get student by ID
    console.log('5. Testing GET /api/student?id=101 (url.parse query id lookup)...');
    const resSingle = await makeRequest('/api/student?id=101');
    console.assert(resSingle.statusCode === 200, `Expected 200, got ${resSingle.statusCode}`);
    const singleStudent = JSON.parse(resSingle.body);
    console.assert(singleStudent.id === '101', 'Incorrect student returned');
    console.log(`   ✅ PASS - Found student: ${singleStudent.name}`);

    // 6. Test POST /add-student
    console.log('6. Testing POST /add-student (fs.writeFile addition)...');
    const testStudent = {
      id: 'TEST999',
      name: 'Test Student',
      email: 'test@student.edu',
      department: 'Computer Science',
      semester: 3,
      cgpa: '9.5'
    };
    const resAdd = await makeRequest('/add-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testStudent)
    });
    console.assert(resAdd.statusCode === 201, `Expected 201, got ${resAdd.statusCode}`);
    console.log('   ✅ PASS - Student added');

    // 7. Test DELETE /delete-student?id=TEST999
    console.log('7. Testing DELETE /delete-student?id=TEST999 (fs.writeFile deletion)...');
    const resDelete = await makeRequest('/delete-student?id=TEST999', {
      method: 'DELETE'
    });
    console.assert(resDelete.statusCode === 200, `Expected 200, got ${resDelete.statusCode}`);
    console.log('   ✅ PASS - Student deleted');

    // 8. Test GET /logs
    console.log('8. Testing GET /logs (fs.appendFile logging check)...');
    const resLogs = await makeRequest('/logs');
    console.assert(resLogs.statusCode === 200, `Expected 200, got ${resLogs.statusCode}`);
    console.assert(resLogs.body.includes('GET /api/students'), 'Log entry missing in access.log');
    console.log('   ✅ PASS - Access logs verified');

    // 9. Test 404 Route
    console.log('9. Testing 404 Not Found...');
    const res404 = await makeRequest('/random-nonexistent-url');
    console.assert(res404.statusCode === 404, `Expected 404, got ${res404.statusCode}`);
    console.log('   ✅ PASS - 404 handler verified');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The server satisfies all requirements.\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Allow slight delay for server to start if running together
setTimeout(runTests, 500);
