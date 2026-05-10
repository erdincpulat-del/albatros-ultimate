import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const inquiries = await prisma.inquiry.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        boat: true,
        week: true,
      },
    });

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error("INQUIRIES GET ERROR:", error);

    return NextResponse.json(
      { error: "Inquiry listesi alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      message,
      notes,
      boatId,
      weekId,
      guestCount,
      routePreference,
      skipperRequired,
      type,
    } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Ad Soyad ve Email zorunlu" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        fullName,
        email,
        phone,
        message,
        notes,
        boatId,
        weekId,
        guestCount,
        routePreference,
        skipperRequired: Boolean(skipperRequired),
        type: type ?? "CHARTER",
        status: "NEW",
      },
      include: {
        boat: true,
        week: true,
      },
    });

    if (weekId) {
      await prisma.charterAvailability.update({
        where: { id: weekId },
        data: {
          inquiryCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error("INQUIRIES POST ERROR:", error);

    return NextResponse.json(
      { error: "Inquiry oluşturulamadı" },
      { status: 500 }
    );
  }
}