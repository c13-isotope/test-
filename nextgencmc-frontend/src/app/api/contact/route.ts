import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // ✅ Log to console (for debugging)
    console.log('🚀 CONTACT FORM SUBMISSION RECEIVED!');
    console.log('📧 Name:', name);
    console.log('📧 Email:', email);
    console.log('📧 Message:', message);
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('----------------------------------------');

    // ✅ Send email using Webhook/Email Service (No Nodemailer needed)
    await sendEmailNotification(name, email, message);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! I will get back to you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

// Email function using Webhook/Email service
async function sendEmailNotification(name: string, email: string, message: string) {
  try {
    // Option 1: Use EmailJS (Free tier available)
    const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'YOUR_SERVICE_ID', // Get from EmailJS
        template_id: 'YOUR_TEMPLATE_ID', // Get from EmailJS  
        user_id: 'YOUR_USER_ID', // Get from EmailJS
        template_params: {
          from_name: name,
          from_email: email,
          message: message,
          to_email: 'abhishek@nextgencmc.org',
        }
      })
    });

    if (emailJsResponse.ok) {
      console.log('✅ Email sent via EmailJS');
      return;
    }

    // Option 2: Use FormSubmit (Free, no registration needed)
    const formSubmitResponse = await fetch('https://formsubmit.co/ajax/abhishek@nextgencmc.org', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: `New Contact Form Submission from ${name}`,
      })
    });

    if (formSubmitResponse.ok) {
      console.log('✅ Email sent via FormSubmit');
      return;
    }

    console.log('📧 Email data (you can set up email service later):', {
      to: 'abhishek@nextgencmc.org',
      from: email,
      subject: `New Contact from ${name}`,
      message: message
    });

  } catch (error) {
    console.log('ℹ️ Email service not configured yet. Data logged to console.');
  }
}