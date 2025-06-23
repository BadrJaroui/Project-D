const sqlite3 = require('sqlite3');

export async function POST(request) {
  try {

    const { username, password } = await request.json();

    if (username === 'admin' && password === 'admin123') {
      return new Response(
        JSON.stringify({ success: true, message: 'Login successful' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid Login' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } 
  catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error with request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 