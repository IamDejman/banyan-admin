import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock user data - In a real application, this would come from a database
const MOCK_USERS = [
  {
    id: '1',
    email: 'agent@example.com',
    password: 'password123',
    name: 'John Agent',
    role: 'CLAIMS_AGENT',
  },
  {
    id: '2',
    email: 'manager@example.com',
    password: 'password123',
    name: 'Sarah Manager',
    role: 'MANAGER',
  },
  {
    id: '3',
    email: 'financial@example.com',
    password: 'password123',
    name: 'Mike Financial',
    role: 'FINANCIAL_OFFICER',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from response
    const userWithoutPassword = { ...user, password: undefined };
    delete userWithoutPassword.password;

    // In a real application, you would generate a JWT token here
    const token = 'mock-jwt-token';

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 