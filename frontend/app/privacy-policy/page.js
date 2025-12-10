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
        This Privacy Policy describes how SMARTBREW (&quot;we&quot;, &quot;our&quot;, &quot;the Company&quot;, or &quot;SMARTBREW&quot;) collects, 
        uses, and protects information when you use our Instagram DM Automation application. This application, developed and operated by SMARTBREW, 
        is designed to help businesses manage Instagram Direct Messages through a centralized web interface.
      </p>
      <p>
        <strong>About SMARTBREW:</strong> SMARTBREW is the business entity that owns and operates the Instagram DM Automation application. 
        This privacy policy applies specifically to the Instagram DM Automation tool available at 
        https://instagram-bot-rust.vercel.app and https://instagram-bot-xmt8.onrender.com.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        2. Information We Collect
      </h2>
      <p>Our application collects the following types of information:</p>
      <ul>
        <li><strong>Instagram Business Account Information:</strong> When you connect your Instagram Business Account to our service, we store 
        your Instagram Business ID, account username, page ID, and page access token (stored securely server-side and encrypted).</li>
        <li><strong>Instagram Direct Messages:</strong> We receive and store Direct Messages sent to your connected Instagram Business Account 
        via Meta&apos;s webhook system. This includes message content, sender information (Instagram user ID and username fetched via instagram_basic 
        permission), message IDs, timestamps, and any attachments (images, videos, files).</li>
        <li><strong>Instagram User Profile Data:</strong> We retrieve and display profile information for Instagram users who send messages to your 
        business account. This includes username, name, biography, followers count, profile picture, and media posts (retrieved via instagram_basic 
        permission using Meta&apos;s business_discovery API).</li>
        <li><strong>User Account Information:</strong> For users of our web interface, we collect email address, password (hashed using bcrypt), 
        name, and role for authentication and access control purposes.</li>
        <li><strong>Technical Information:</strong> We may collect IP addresses, browser information, and usage logs for security and troubleshooting 
        purposes.</li>
      </ul>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        3. How We Use Your Information
      </h2>
      <p><strong>Legal Basis for Processing:</strong> We process your data based on your consent when you connect your Instagram account, 
      and for the performance of our service contract to provide messaging support functionality.</p>
      <p>We use the collected information to:</p>
      <ul>
        <li>Receive and display Instagram Direct Messages in our web interface via Meta&apos;s webhook system</li>
        <li>Send replies to Instagram users on behalf of your connected business account using Meta&apos;s Instagram Graph API</li>
        <li>Display profile information (retrieved via instagram_basic permission) to help support team members identify and assist customers</li>
        <li>Provide authentication and access control for our web application</li>
        <li>Store conversation history and message threads for your business account</li>
        <li>Improve our service, troubleshoot technical issues, and ensure security</li>
      </ul>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        4. Data Storage and Security
      </h2>
      <p>
        All data is stored securely in our database hosted on MongoDB Atlas (cloud database service). Data may be stored in servers located 
        outside your country of residence. We implement industry-standard security measures including:
      </p>
      <ul>
        <li>Encrypted data transmission (HTTPS/TLS) for all API communications</li>
        <li>Secure storage of access tokens and credentials (encrypted at rest)</li>
        <li>Password hashing using bcrypt with salt rounds</li>
        <li>Authentication and authorization controls (JWT-based access tokens)</li>
        <li>Regular security updates and monitoring</li>
        <li>Access logging and audit trails</li>
        <li>Rate limiting to prevent abuse</li>
      </ul>
      <p>
        <strong>Data Breach Notification:</strong> In the event of a data breach that may affect your personal information, we will notify 
        affected users and relevant authorities as required by applicable law.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        5. Data Sharing and Third Parties
      </h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. We may share data with:
      </p>
      <ul>
        <li><strong>Meta (Facebook/Instagram):</strong> We use Meta&apos;s Instagram Graph API to receive and send messages, and to retrieve profile 
        information. This is necessary for the core functionality of our application. Meta Platform Data is shared with Meta as required by 
        their API terms and policies.</li>
        <li><strong>Service Providers:</strong> We use MongoDB Atlas (MongoDB, Inc.) for database hosting and data storage. They process data on 
        our behalf under strict data processing agreements and are located in the United States. They act as data processors and are contractually 
        obligated to protect your data.</li>
        <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation, or to 
        protect our rights and the safety of our users.</li>
      </ul>
      <p>
        <strong>International Data Transfers:</strong> Your data may be transferred to and stored in servers located outside your country of 
        residence, including the United States (MongoDB Atlas). We ensure appropriate safeguards are in place for such transfers.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        6. Meta Platform Data
      </h2>
      <p>
        Our application uses the following Meta Platform Data obtained through Meta&apos;s Instagram Graph API:
      </p>
      <ul>
        <li><strong>instagram_basic permission:</strong> We retrieve Instagram user profile information (username, name, biography, followers count, 
        profile picture, and media posts) using Meta&apos;s business_discovery API endpoint. This data is displayed in our support interface to 
        help team members identify and assist customers.</li>
        <li><strong>instagram_manage_messages permission:</strong> We receive Instagram Direct Messages via Meta&apos;s webhook system and send 
        replies via the Instagram Graph API. This includes message content, sender IDs, timestamps, and attachments.</li>
      </ul>
      <p>
        <strong>Use of Meta Platform Data:</strong> All Meta Platform Data is used solely for providing messaging support functionality. We do not 
        use this data for advertising, marketing, or any purpose other than delivering our messaging support service. Meta Platform Data is not 
        shared with third parties except as necessary for service operation (database hosting with MongoDB Atlas, which acts as our data processor).
      </p>
      <p>
        <strong>Data Minimization:</strong> We only collect and store the minimum Meta Platform Data necessary to provide our messaging support 
        functionality. We do not collect data beyond what is required for the core service.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        7. Your Rights and How to Exercise Them
      </h2>
      <p>You have the following rights regarding your personal data:</p>
      <ul>
        <li><strong>Right to Access:</strong> You can request access to your personal data stored in our system, including your account information, 
        connected Instagram accounts, and stored messages.</li>
        <li><strong>Right to Deletion:</strong> You can request deletion of your account and all associated data, including Instagram account 
        connections, stored messages, and conversation history.</li>
        <li><strong>Right to Disconnect:</strong> You can disconnect your Instagram account from our service at any time through the web interface 
        or by contacting us.</li>
        <li><strong>Right to Data Portability:</strong> You can request a copy of your data in a machine-readable format.</li>
        <li><strong>Right to Rectification:</strong> You can update or correct your account information at any time.</li>
        <li><strong>Right to Object:</strong> You can object to certain processing of your data, subject to legal limitations.</li>
      </ul>
      <p>
        <strong>How to Exercise Your Rights:</strong> To exercise any of these rights, please contact us through the Meta Developer Portal for 
        this app or use the account management features in our web interface. We will respond to your request within 30 days.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        8. Data Retention and Deletion
      </h2>
      <p>
        We retain your data for as long as your account is active or as needed to provide our services. Specifically:
      </p>
      <ul>
        <li><strong>Account Data:</strong> Retained while your account is active. Deleted within 30 days of account deletion request.</li>
        <li><strong>Instagram Messages:</strong> Retained while your account is connected. Deleted when you disconnect your Instagram account or 
        delete your account.</li>
        <li><strong>Instagram Profile Data:</strong> Cached temporarily for display purposes. Refreshed when new messages are received.</li>
        <li><strong>Access Tokens:</strong> Retained while your Instagram account is connected. Deleted immediately upon disconnection.</li>
      </ul>
      <p>
        You can request deletion of your account and all associated data at any time by contacting us or using the account deletion feature in 
        our web interface. Upon deletion, all your data will be permanently removed from our systems within 30 days, except where we are required 
        to retain certain information by law.
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
        <p>
          <strong>Business Entity:</strong> SMARTBREW<br />
          <strong>App Name:</strong> Instagram DM Automation<br />
          <strong>App Developer:</strong> SMARTBREW<br />
          <strong>Backend API URL:</strong> https://instagram-bot-xmt8.onrender.com<br />
          <strong>Web Application URL:</strong> https://instagram-bot-rust.vercel.app<br />
          <strong>Privacy Policy URL:</strong> https://instagram-bot-rust.vercel.app/privacy-policy<br />
          <strong>Contact Method:</strong> Please contact us through the Meta Developer Portal for this app (App ID: 1399394331530640)
        </p>
        <p>
          <strong>Connection to App:</strong> This privacy policy applies specifically to the Instagram DM Automation application 
          developed and operated by SMARTBREW. The application is accessible at the URLs listed above and provides Instagram messaging 
          support tools for businesses. SMARTBREW is the business entity that owns, develops, and operates this application.
        </p>
        <p>
          If you have any questions about this Privacy Policy, our data practices, or wish to exercise your rights, please contact 
          us through the Meta Developer Portal for this app.
        </p>
      </div>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        12. Cookies and Tracking
      </h2>
      <p>
        Our web application uses authentication tokens (JWT) stored in your browser&apos;s local storage for session management. 
        We do not use cookies for tracking or advertising purposes. The authentication tokens are necessary for the functionality 
        of our service and are deleted when you log out.
      </p>

      <h2 style={{ color: '#000000', marginTop: '30px', borderBottom: '2px solid #f5cd4c', paddingBottom: '5px' }}>
        13. Compliance with Meta Platform Terms
      </h2>
      <p>
        This application complies with Meta&apos;s Platform Terms, Instagram API policies, and Developer Policies. We follow all 
        requirements for handling Instagram Platform Data, including:
      </p>
      <ul>
        <li>Using Meta Platform Data solely for providing our messaging support service</li>
        <li>Not using Meta Platform Data for advertising or marketing purposes</li>
        <li>Maintaining appropriate security measures to protect user information</li>
        <li>Providing clear information about data collection and use</li>
        <li>Respecting user rights and providing mechanisms to exercise those rights</li>
        <li>Complying with data minimization principles</li>
      </ul>
      <p>
        We are committed to maintaining compliance with all applicable data protection laws and Meta&apos;s Platform Terms.
      </p>
    </div>
  );
}

