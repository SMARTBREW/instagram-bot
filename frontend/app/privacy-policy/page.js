export const metadata = {
  title: 'Privacy Policy - Instagram DM Automation',
  description: 'Privacy Policy for Instagram DM Automation by SMARTBREW',
};

export default function PrivacyPolicy() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      background: '#f0e9d3',
      minHeight: '100vh',
    }}>
      <div style={{
        background: '#f5cd4c',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
      }}>
        <h1 style={{ margin: 0, color: '#000000', borderBottom: 'none' }}>Privacy Policy</h1>
        <p style={{ margin: '10px 0 5px 0', fontWeight: 600 }}>Instagram DM Automation Tool</p>
        <p style={{ margin: 0, fontWeight: 600 }}>Business: SMARTBREW</p>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>Last Updated: December 3, 2025</p>
      </div>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        1. Introduction
      </h2>
      <p>
        This Privacy Policy describes how SMARTBREW&apos;s Instagram DM Automation application (&quot;we&quot;, &quot;our&quot;, &quot;the App&quot;, or &quot;SMARTBREW&quot;) collects, 
        uses, and protects information when you use our Instagram messaging support tool. This application is designed to help businesses manage 
        Instagram Direct Messages through a centralized web interface.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        2. Information We Collect
      </h2>
      <p>Our application collects the following types of information:</p>
      <ul>
        <li><strong>Instagram Account Information:</strong> When you connect your Instagram Business Account, we store your Instagram Business ID, 
        account username, and page access token (stored securely server-side).</li>
        <li><strong>Instagram Messages:</strong> We receive and store Direct Messages sent to your connected Instagram Business Account, including 
        message content, sender information (Instagram user ID and username), timestamps, and any attachments.</li>
        <li><strong>Instagram Profile Data:</strong> We retrieve and display profile information (username, name, biography, followers count, 
        profile picture, and media posts) for accounts that interact with your business account.</li>
        <li><strong>User Account Information:</strong> For users of our web interface, we collect email address, password (hashed), and name 
        for authentication purposes.</li>
      </ul>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        3. How We Use Your Information
      </h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Receive and display Instagram Direct Messages in our web interface</li>
        <li>Send replies to Instagram users on behalf of your connected business account</li>
        <li>Display profile information to help support team members identify and assist customers</li>
        <li>Provide authentication and access control for our web application</li>
        <li>Improve our service and troubleshoot technical issues</li>
      </ul>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        4. Data Storage and Security
      </h2>
      <p>
        All data is stored securely in our database hosted on MongoDB Atlas. We implement industry-standard security measures including:
      </p>
      <ul>
        <li>Encrypted data transmission (HTTPS)</li>
        <li>Secure storage of access tokens and credentials</li>
        <li>Authentication and authorization controls</li>
        <li>Regular security updates and monitoring</li>
      </ul>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        5. Data Sharing
      </h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. We may share data with:
      </p>
      <ul>
        <li><strong>Meta (Facebook/Instagram):</strong> We use Meta&apos;s Instagram Graph API to receive and send messages, and to retrieve profile 
        information. This is necessary for the core functionality of our application.</li>
        <li><strong>Service Providers:</strong> We use MongoDB Atlas for database hosting. They process data on our behalf under strict 
        data processing agreements.</li>
      </ul>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        6. Meta Platform Data
      </h2>
      <p>
        Our application uses the following Meta Platform Data:
      </p>
      <ul>
        <li><strong>instagram_basic permission:</strong> We retrieve Instagram user profile information (username, name, biography, followers count, 
        profile picture, and media posts) to display in our support interface.</li>
        <li><strong>instagram_manage_messages permission:</strong> We receive Instagram Direct Messages via webhooks and send replies via the 
        Instagram Graph API.</li>
      </ul>
      <p>
        All Meta Platform Data is used solely for providing messaging support functionality and is not shared with third parties except as 
        necessary for service operation (e.g., database hosting).
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        7. Your Rights
      </h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data stored in our system</li>
        <li>Request deletion of your account and associated data</li>
        <li>Disconnect your Instagram account at any time</li>
        <li>Request a copy of your data</li>
      </ul>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        8. Data Retention
      </h2>
      <p>
        We retain your data for as long as your account is active or as needed to provide our services. You can request deletion of your 
        account and data at any time by contacting us.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        9. Children&apos;s Privacy
      </h2>
      <p>
        Our service is not intended for users under the age of 13. We do not knowingly collect information from children under 13.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        10. Changes to This Privacy Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
        and updating the &quot;Last Updated&quot; date.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        11. Contact Us
      </h2>
      <div style={{
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '20px',
        borderLeft: '4px solid #f5cd4c',
      }}>
        <p style={{ marginTop: 0, fontWeight: 600 }}>SMARTBREW - Instagram DM Automation</p>
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
        <p>
          <strong>Business Name:</strong> SMARTBREW<br />
          <strong>App Name:</strong> Instagram DM Automation<br />
          <strong>App URL:</strong> https://instagram-bot-xmt8.onrender.com<br />
          <strong>Frontend URL:</strong> https://instagram-bot-rust.vercel.app<br />
          <strong>Contact:</strong> Please contact us through the Meta Developer Portal for this app
        </p>
        <p>
          This privacy policy applies to the Instagram DM Automation application developed by SMARTBREW, 
          which provides Instagram messaging support tools for businesses.
        </p>
      </div>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        12. Compliance
      </h2>
      <p>
        This application complies with Meta&apos;s Platform Terms and Instagram API policies. We follow all requirements for handling Instagram 
        Platform Data and maintain appropriate security measures to protect user information.
      </p>
    </div>
  );
}

