/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { NextResponse } from 'next/server';
import { csfd } from 'node-csfd-api';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get('q') ?? '';

	if (!query.trim()) {
		return NextResponse.json({ results: [] });
	}

	try {
		const results = await csfd.search(query);
		return NextResponse.json({ results });
	} catch (error) {
		console.error('CSFD search error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch data from CSFD' },
			{ status: 500 }
		);
	}
}
