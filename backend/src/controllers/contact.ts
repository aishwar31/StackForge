import { Request, Response } from 'express';
import Message from '../models/Message';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other service you prefer
  auth: {
    user: process.env.EMAIL_USER || 'test@gmail.com',
    pass: process.env.EMAIL_PASS || 'password',
  },
});

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to DB
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // Send Email
    const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL || 'admin@stackforge.com',
      subject: `New Contact from ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Email sending failed:', mailError);
      // We still return 201 since message is saved to DB
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('submitContact Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
