import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { StudentProfile } from '@/types';

export const dynamic = 'force-dynamic';

const defaultProfile: StudentProfile = {
  faculty: 'Not set',
  department: 'Not set',
  level: '',
  matricNumber: '',
  graduationYear: '',
  targetClass: '',
  carryoverCourses: 0,
  probationStatus: 'On Track',
};

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
    const user = await User.findById(decoded.userId).select('studentProfile name email');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      profile: user.studentProfile || defaultProfile,
    });
  } catch (error) {
    console.error('Fetch student profile error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    const sanitizedProfile: StudentProfile = {
      faculty: typeof payload.faculty === 'string' && payload.faculty.trim() ? payload.faculty.trim() : 'Not set',
      department: typeof payload.department === 'string' && payload.department.trim() ? payload.department.trim() : 'Not set',
      level: typeof payload.level === 'string' ? payload.level.trim() : '',
      matricNumber: typeof payload.matricNumber === 'string' ? payload.matricNumber.trim() : '',
      graduationYear: typeof payload.graduationYear === 'string' ? payload.graduationYear.trim() : '',
      targetClass: typeof payload.targetClass === 'string' ? payload.targetClass.trim() : '',
      carryoverCourses: Math.max(0, parseInt(payload.carryoverCourses, 10) || 0),
      probationStatus: typeof payload.probationStatus === 'string' && payload.probationStatus.trim() ? payload.probationStatus.trim() : 'On Track',
    };

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.studentProfile = sanitizedProfile;
    await user.save();

    return NextResponse.json({
      message: 'Academic profile saved successfully',
      profile: user.studentProfile,
    });
  } catch (error) {
    console.error('Save student profile error:', error);
    return NextResponse.json({ message: 'Failed to save academic profile' }, { status: 500 });
  }
}
