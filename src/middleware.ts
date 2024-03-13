import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const uri = new URL(request.url);
  console.log(`==> ${uri.pathname}`);

  const response = NextResponse.next()
  response.headers.set('bb', 'bb-0000111');
  return response;
}
