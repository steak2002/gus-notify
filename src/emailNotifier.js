const nodemailer = require('nodemailer');
const { format, parseISO } = require('date-fns');

class EmailNotifier {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendNotification(newEvents) {
    try {
      const emailContent = this.formatEmailContent(newEvents);
      
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `🔥 ${newEvents.length} new gus event${newEvents.length > 1 ? 's' : ''} available!`,
        html: emailContent
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  formatEmailContent(events) {
    let html = `
      <h2>🔥 New Gus Events Available!</h2>
      <p>Hello! I found ${events.length} new gus event${events.length > 1 ? 's' : ''} at Vinterbad Bryggen:</p>
    `;

    events.forEach(event => {
      const eventDate = format(parseISO(event.startTimeUtc), 'EEEE, MMMM do, yyyy');
      const startTime = format(parseISO(event.startTimeUtc), 'HH:mm');
      const endTime = format(parseISO(event.endTimeUtc), 'HH:mm');
      const signupDeadline = format(parseISO(event.signUpDeadlineUtc), 'EEEE, MMMM do \'at\' HH:mm');
      
      html += `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background-color: #f9f9f9;">
          <h3 style="color: #188604; margin-top: 0;">${event.name}</h3>
          
          <p><strong>📅 Date:</strong> ${eventDate}</p>
          <p><strong>🕐 Time:</strong> ${startTime} - ${endTime}</p>
          <p><strong>📍 Location:</strong> ${event.locationName}</p>
          
          ${event.description ? `<p><strong>📝 Description:</strong></p><div>${event.description}</div>` : ''}
          
          <p><strong>👥 Spots:</strong> ${event.booked}/${event.maxAttendees} booked</p>
          ${event.waitingList > 0 ? `<p><strong>⏳ Waiting list:</strong> ${event.waitingList} people</p>` : ''}
          
          <p><strong>⏰ Signup deadline:</strong> ${signupDeadline}</p>
          
          ${event.responsible && event.responsible.length > 0 ? 
            `<p><strong>👤 Responsible:</strong> ${event.responsible[0].displayName}</p>` : ''}
          
          <p><strong>Status:</strong> <span style="color: ${event.status === 'scheduled' ? '#ff8c00' : '#188604'};">${event.status}</span></p>
        </div>
      `;
    });

    html += `
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        This notification was sent by your Gus Event Notifier.<br>
        Running on GitHub Actions with ❤️
      </p>
    `;

    return html;
  }
}

module.exports = EmailNotifier;
