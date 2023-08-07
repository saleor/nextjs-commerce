import { revalidate } from 'lib/saleor';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<Response> {
  return revalidate(req);
}
