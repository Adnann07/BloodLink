<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .field-value {
            background: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #667eea;
            border-radius: 5px;
        }
        .message-field {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #667eea;
            border-radius: 5px;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🩸 New Contact Form Submission</h1>
            <p>BloodLink - Save Lives, Donate Blood</p>
        </div>

        <div class="field">
            <div class="field-label">👤 Name:</div>
            <div class="field-value">{{ isset($name) ? $name : '' }}</div>
        </div>

        <div class="field">
            <div class="field-label">📧 Email:</div>
            <div class="field-value">{{ isset($email) ? $email : '' }}</div>
        </div>

        <div class="field">
            <div class="field-label">📞 Phone:</div>
            <div class="field-value">{{ isset($phone) ? $phone : 'Not provided' }}</div>
        </div>

        <div class="field">
            <div class="field-label">📋 Subject:</div>
            <div class="field-value">{{ isset($subject) ? $subject : '' }}</div>
        </div>

        <div class="field">
            <div class="field-label">💬 Message:</div>
            <div class="message-field">{{ isset($message) ? $message : '' }}</div>
        </div>

        <div class="footer">
            <p>This message was sent from the BloodLink contact form.</p>
            <p>Please respond to the sender at their earliest convenience.</p>
        </div>
    </div>
</body>
</html>
