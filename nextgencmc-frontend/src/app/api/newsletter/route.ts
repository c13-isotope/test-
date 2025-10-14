import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // ✅ Log to console
    console.log('🚀 NEWSLETTER SUBSCRIPTION RECEIVED!');
    console.log('📧 Email:', email);
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('----------------------------------------');

    // ✅ Send newsletter notification
    await sendNewsletterNotification(email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

async function sendNewsletterNotification(email: string) {
  try {
    // Option 1: FormSubmit for newsletter
    const formSubmitResponse = await fetch('https://formsubmit.co/ajax/abhishek@nextgencmc.org', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        type: 'Newsletter Subscription',
        _subject: 'New Newsletter Subscriber',
      })
    });

    if (formSubmitResponse.ok) {
      console.log('✅ Newsletter notification sent via FormSubmit');
      return;
    }

    console.log('📧 Newsletter data:', {
      to: 'abhishek@nextgencmc.org',
      email: email,
      type: 'Newsletter Subscription'
    });

  } catch (error) {
    console.log('ℹ️ Newsletter service not configured yet. Data logged to console.');
  }
}