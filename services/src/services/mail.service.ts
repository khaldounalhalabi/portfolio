import nodemailer, { type Transporter } from "nodemailer";

import { config } from "../config.js";

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export class MailService {
  private static instance?: MailService;

  private readonly transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });
  }

  public static make(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }

    return MailService.instance;
  }

  public async sendContactMessage(payload: ContactMessage): Promise<void> {
    const subject = payload.subject?.trim()
      ? `Portfolio contact: ${payload.subject.trim()}`
      : `Portfolio contact from ${payload.name}`;

    const textBody = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.subject ? `Subject: ${payload.subject}` : null,
      "",
      payload.message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin: 0 0 12px;">New portfolio contact message</h2>
        <p style="margin: 0 0 4px;"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p style="margin: 0 0 4px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        ${payload.subject ? `<p style="margin: 0 0 4px;"><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
        <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(payload.message)}</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: config.contactFromAddress,
      to: config.contactToAddress,
      // Pass a structured address object so nodemailer encodes/sanitizes the
      // display name and address itself (it strips CR/LF from address objects),
      // instead of hand-building `Name <email>` which would bypass that. The
      // name/email are also CRLF-rejected at both validation layers.
      replyTo: { name: payload.name, address: payload.email },
      subject,
      text: textBody,
      html: htmlBody,
    });
  }
}
