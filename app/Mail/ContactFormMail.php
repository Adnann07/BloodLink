<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $contactData;

    /**
     * Create a new message instance.
     */
    public function __construct(array $contactData)
    {
        $this->contactData = $contactData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Form Submission - BloodLink',
        );
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $name = $this->contactData['name'] ?? 'Unknown';
        $email = $this->contactData['email'] ?? 'Unknown';
        $phone = $this->contactData['phone'] ?? 'Not provided';
        $subject = $this->contactData['subject'] ?? 'No subject';
        $message = $this->contactData['message'] ?? 'No message';

        $emailContent = "New Contact Form Submission - BloodLink\n\n";
        $emailContent .= "Name: " . $name . "\n";
        $emailContent .= "Email: " . $email . "\n";
        $emailContent .= "Phone: " . $phone . "\n";
        $emailContent .= "Subject: " . $subject . "\n\n";
        $emailContent .= "Message:\n" . $message . "\n\n";
        $emailContent .= "---\n";
        $emailContent .= "This message was sent from the BloodLink contact form.\n";
        $emailContent .= "Please respond to the sender at their earliest convenience.";

        return $this->subject('New Contact Form Submission - BloodLink')
                    ->html(nl2br($emailContent));
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
