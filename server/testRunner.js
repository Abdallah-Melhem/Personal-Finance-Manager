const fs = require('fs');
const path = require('path');

const runMasterTestSuite = async () => {
  console.log('====================================================');
  console.log('  PERSONAL FINANCE MANAGEMENT SYSTEM - MASTER TEST SUITE');
  console.log('  PHASE 12: COMPREHENSIVE END-TO-END VERIFICATION');
  console.log('====================================================\n');

  const baseURL = 'http://localhost:5000/api';
  const timestamp = Date.now();
  let passedCount = 0;
  let failedCount = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`  [FAIL] ${testName}: ${details}`);
      failedCount++;
    }
  };

  try {
    // ----------------------------------------------------
    // 1. REGISTRATION
    // ----------------------------------------------------
    console.log('--- 1. Testing Registration ---');
    const userAEmail = `userA_${timestamp}@test.com`;
    const userAPassword = 'Password123!';
    const regResA = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Alpha', email: userAEmail, password: userAPassword }),
    });
    const regDataA = await regResA.json();
    assert(regResA.status === 201 && regDataA.success && !!regDataA.token, 'User A registered successfully with JWT');
    assert(regDataA.user.password === undefined, 'Password is not exposed in registration response');
    const tokenA = regDataA.token;
    const userAId = regDataA.user._id;

    // Duplicate registration check
    const dupRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Alpha Dup', email: userAEmail, password: userAPassword }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 400 && dupData.success === false, 'Duplicate email registration correctly rejected');

    // Register User B for security/ownership tests
    const userBEmail = `userB_${timestamp}@test.com`;
    const userBPassword = 'Password123!';
    const regResB = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Beta', email: userBEmail, password: userBPassword }),
    });
    const regDataB = await regResB.json();
    assert(regResB.status === 201 && !!regDataB.token, 'User B registered for authorization checks');
    const tokenB = regDataB.token;

    // ----------------------------------------------------
    // 2. LOGIN
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Login ---');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userAEmail, password: userAPassword }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success && !!loginData.token, 'Valid login returns JWT and user profile');

    const badLoginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userAEmail, password: 'WrongPassword999' }),
    });
    assert(badLoginRes.status === 401, 'Invalid password correctly rejected with HTTP 401');

    // ----------------------------------------------------
    // 3. LOGOUT
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Logout ---');
    const logoutRes = await fetch(`${baseURL}/auth/logout`, { method: 'POST' });
    const logoutData = await logoutRes.json();
    assert(logoutRes.status === 200 && logoutData.success, 'Logout endpoint responds with HTTP 200 success');

    // ----------------------------------------------------
    // 4. PROTECTED ROUTES
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Protected Routes ---');
    const noTokenRes = await fetch(`${baseURL}/auth/me`);
    assert(noTokenRes.status === 401, 'Request without token rejected with HTTP 401');

    const badTokenRes = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: 'Bearer forged.token.value' },
    });
    assert(badTokenRes.status === 401, 'Request with forged token rejected with HTTP 401');

    const validTokenRes = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const validMeData = await validTokenRes.json();
    assert(validTokenRes.status === 200 && validMeData.user.email.toLowerCase() === userAEmail.toLowerCase(), 'Request with valid token returns user data');

    // ----------------------------------------------------
    // 5. TRANSACTION CRUD
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Transaction CRUD ---');
    // Create Income
    const tx1Res = await fetch(`${baseURL}/transactions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'income',
        amount: 5000,
        category: 'Salary',
        description: 'September Full-Time Salary',
        date: '2026-09-01',
      }),
    });
    const tx1Data = await tx1Res.json();
    assert(tx1Res.status === 201 && tx1Data.transaction.amount === 5000, 'Created income transaction ($5000)');
    const tx1Id = tx1Data.transaction._id;

    // Create Expense
    const tx2Res = await fetch(`${baseURL}/transactions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'expense',
        amount: 120.5,
        category: 'Food',
        description: 'Weekly Grocery Market',
        date: '2026-09-05',
      }),
    });
    const tx2Data = await tx2Res.json();
    assert(tx2Res.status === 201 && tx2Data.transaction.type === 'expense', 'Created expense transaction ($120.50)');
    const tx2Id = tx2Data.transaction._id;

    // Read list
    const listRes = await fetch(`${baseURL}/transactions`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const listData = await listRes.json();
    assert(listRes.status === 200 && listData.totalCount >= 2, 'Fetched user transaction list successfully');

    // Read single
    const singleRes = await fetch(`${baseURL}/transactions/${tx1Id}`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const singleData = await singleRes.json();
    assert(singleRes.status === 200 && singleData.transaction._id === tx1Id, 'Fetched single transaction by ID');

    // Update
    const updateRes = await fetch(`${baseURL}/transactions/${tx2Id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 150.0, description: 'Weekly Grocery + Treats' }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.transaction.amount === 150, 'Updated transaction amount to $150');

    // Delete
    const delRes = await fetch(`${baseURL}/transactions/${tx2Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(delRes.status === 200, 'Deleted transaction successfully');

    const getDeletedRes = await fetch(`${baseURL}/transactions/${tx2Id}`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(getDeletedRes.status === 404, 'Deleted transaction returns HTTP 404');

    // ----------------------------------------------------
    // 6. OWNERSHIP & SECURITY
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Ownership & Security ---');
    // User B tries to get User A's tx1
    const secGetRes = await fetch(`${baseURL}/transactions/${tx1Id}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(secGetRes.status === 403, 'Cross-user GET transaction rejected with HTTP 403');

    // User B tries to update User A's tx1
    const secPutRes = await fetch(`${baseURL}/transactions/${tx1Id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenB}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1 }),
    });
    assert(secPutRes.status === 403, 'Cross-user PUT transaction rejected with HTTP 403');

    // User B tries to delete User A's tx1
    const secDelRes = await fetch(`${baseURL}/transactions/${tx1Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(secDelRes.status === 403, 'Cross-user DELETE transaction rejected with HTTP 403');

    // User B transaction list must NOT contain User A records
    const secListRes = await fetch(`${baseURL}/transactions`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const secListData = await secListRes.json();
    assert(secListData.totalCount === 0, 'User B transaction history is strictly isolated (count = 0)');

    // ----------------------------------------------------
    // 7. SEARCH
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Search ---');
    // Seed extra items for User A
    await fetch(`${baseURL}/transactions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'expense', amount: 80, category: 'Transportation', description: 'Monthly Train Pass' }),
    });
    await fetch(`${baseURL}/transactions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'expense', amount: 65, category: 'Bills', description: 'Home Electric Utility' }),
    });

    const searchRes = await fetch(`${baseURL}/transactions?search=Train`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const searchData = await searchRes.json();
    assert(searchData.totalCount === 1 && searchData.transactions[0].description === 'Monthly Train Pass', 'Search by keyword "Train" found expected record');

    // ----------------------------------------------------
    // 8. FILTERS
    // ----------------------------------------------------
    console.log('\n--- 8. Testing Filters ---');
    // Filter by type
    const typeFilterRes = await fetch(`${baseURL}/transactions?type=expense`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const typeFilterData = await typeFilterRes.json();
    assert(typeFilterData.transactions.every((t) => t.type === 'expense'), 'Type filter returns only expense records');

    // Filter by category
    const catFilterRes = await fetch(`${baseURL}/transactions?category=Salary`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const catFilterData = await catFilterRes.json();
    assert(catFilterData.transactions.every((t) => t.category === 'Salary'), 'Category filter returns only Salary records');

    // ----------------------------------------------------
    // 9. PAGINATION
    // ----------------------------------------------------
    console.log('\n--- 9. Testing Pagination ---');
    const pageRes = await fetch(`${baseURL}/transactions?page=1&limit=2`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const pageData = await pageRes.json();
    assert(pageData.transactions.length <= 2 && pageData.totalPages >= 2 && pageData.currentPage === 1, 'Pagination correctly limits items and reports total pages');

    // ----------------------------------------------------
    // 10. DASHBOARD
    // ----------------------------------------------------
    console.log('\n--- 10. Testing Dashboard Endpoints ---');
    const dashSumRes = await fetch(`${baseURL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const dashSumData = await dashSumRes.json();
    assert(dashSumRes.status === 200 && dashSumData.summary.totalIncome === 5000, 'Dashboard summary returns accurate total income ($5000)');
    assert(dashSumData.summary.totalExpense === 145, 'Dashboard summary returns accurate total expenses ($145)');
    assert(dashSumData.summary.balance === 4855, 'Dashboard balance calculated accurately ($4855)');
    assert(dashSumData.summary.recentTransactions.length >= 1, 'Dashboard recent transactions list populated');

    const dashCatRes = await fetch(`${baseURL}/dashboard/categories`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const dashCatData = await dashCatRes.json();
    assert(dashCatRes.status === 200 && Array.isArray(dashCatData.categories), 'Dashboard category breakdown returns array');

    const dashMonthRes = await fetch(`${baseURL}/dashboard/monthly`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const dashMonthData = await dashMonthRes.json();
    assert(dashMonthRes.status === 200 && Array.isArray(dashMonthData.monthly), 'Dashboard monthly statistics returns array');

    // ----------------------------------------------------
    // 11. USER PROFILE
    // ----------------------------------------------------
    console.log('\n--- 11. Testing User Profile ---');
    const profGetRes = await fetch(`${baseURL}/users/profile`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const profGetData = await profGetRes.json();
    assert(profGetRes.status === 200 && profGetData.user.name === 'User Alpha', 'Profile details retrieved');

    // Update name
    const profPutRes = await fetch(`${baseURL}/users/profile`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Alpha Renamed' }),
    });
    const profPutData = await profPutRes.json();
    assert(profPutData.user.name === 'User Alpha Renamed', 'Profile name updated successfully');

    // Change Password
    const pwRes = await fetch(`${baseURL}/users/password`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: userAPassword, newPassword: 'NewPassword321!' }),
    });
    assert(pwRes.status === 200, 'Password changed successfully');

    // Login with new password
    const newLoginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userAEmail, password: 'NewPassword321!' }),
    });
    assert(newLoginRes.status === 200, 'Authenticated successfully with newly updated password');

    // Upload avatar
    const samplePngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    const blob = new Blob([samplePngBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('profilePicture', blob, 'avatar-test.png');
    const avatarRes = await fetch(`${baseURL}/users/profile-picture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: formData,
    });
    const avatarData = await avatarRes.json();
    assert(avatarRes.status === 200 && avatarData.profilePicture.startsWith('/uploads/'), 'Avatar uploaded via Multer and returned relative path');

    // ----------------------------------------------------
    // 12. VALIDATION
    // ----------------------------------------------------
    console.log('\n--- 12. Testing Validation Rules ---');
    const valRegRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'badmail', password: '12' }),
    });
    assert(valRegRes.status === 400, 'Registration input validation rejects invalid payload');

    const valTxRes = await fetch(`${baseURL}/transactions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'invalidType', amount: -100, category: 'NotReal' }),
    });
    assert(valTxRes.status === 400, 'Transaction input validation rejects invalid type/amount/category');

    // ----------------------------------------------------
    // 13. ERROR HANDLING
    // ----------------------------------------------------
    console.log('\n--- 13. Testing Centralized Error Handling ---');
    const err404Res = await fetch(`${baseURL}/unhandled-route-abc`);
    const err404Data = await err404Res.json();
    assert(err404Res.status === 404 && err404Data.success === false, 'Unhandled API route captured by centralized notFound middleware (404)');

    const errCastRes = await fetch(`${baseURL}/transactions/invalid-id-format`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(errCastRes.status === 400, 'Malformed ObjectId handled gracefully without 500 crash');

    // ----------------------------------------------------
    // FINAL SUMMARY
    // ----------------------------------------------------
    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log('====================================================');

    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution fatal error:', err);
    process.exit(1);
  }
};

runMasterTestSuite();
