import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('savedResults name email');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ savedResults: user.savedResults || [] });
  } catch (error) {
    console.error('Fetch saved results error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { semesters, scale, semesterName } = payload;

    if (!semesters || !Array.isArray(semesters)) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newResult = {
      id: payload.id || `result-${Date.now()}`,
      semesterName: semesterName || `Saved result ${user.savedResults.length + 1}`,
      scale: scale || '5.0',
      semesters,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    user.savedResults.push(newResult);
    await user.save();

    return NextResponse.json({
      message: 'Result saved successfully',
      result: newResult,
    });
  } catch (error) {
    console.error('Save result error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get('id');

    if (!resultId) {
      return NextResponse.json({ message: 'Result ID is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const initialLength = user.savedResults.length;
    user.savedResults = user.savedResults.filter((r: any) => {
      const id = r._id?.toString() || r.id;
      return id !== resultId;
    });

    if (user.savedResults.length === initialLength) {
      return NextResponse.json({ message: 'Result not found' }, { status: 404 });
    }

    await user.save();

    return NextResponse.json({
      message: 'Result deleted successfully',
      savedResults: user.savedResults,
    });
  } catch (error) {
    console.error('Delete result error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
