const admin = require('firebase-admin');
const serviceAccount = {
  type: 'service_account',
  project_id: 'social-media-4c489',
  private_key_id: 'fe4ee349eaf7162d1d5c9f4aa331c2bc56cc2f5d',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7cXfLy8DZWDnC\nHdD0hUDyD39EuPyLqvi6nviXOzX/3p9MXaTFz+2UtZ4PZwzeyHfh21HWneLBPBmg\na5RWlbuAIKILLTuZRhZaTs/3r8CjBDKZIa+7N7/JlUv8kfhs8OjE6y2lMq2OC2ZQ\nrZJ78YFwAEeLcSf1dr/ezGAUp4y7Bop/lZknp1H1CUjyQT9zyUFh8XMDjYkW6vWg\nYW35jKtw/S2QQHr5qOb6QcGCFcc8CIxQQNJ8A6yGQiRBmb0ywJyQo+I4wFZwABJ9\nr9mtZ+c5h21b4IEbrUAcUSQT77IBpYYxVRuqf90R9rk21BXcgfKpYyoW3VXBG9x2\n5A96358tAgMBAAECggEAAmWTCJIUZzMPmgHTmCzUBcRY9kH/SLHo+EnsF9Lz/8+S\n7eEMqFLeUNZ5rOy+Z2Lc1ZB+XWYrbhkcosZ9YRYNDbhdGhN7/Zu90W3Mjvg6WFtH\nYlnh61ztIOC91f7v1ETIVSxEqyYYvgY7SrDNfLQ72XjHcWsC/cqE7Y5jdCAoVoPb\nRQkkcD6lJQgka4hqNR5PmgNsZ8U6GSvVG+ZVI9W5N5P+qWY7N6NovXPKGFhzwllP\nIUiykUPf0a4CQ0mj6qvkFWbEE9ZYWseK0hJxuo4cK4dbGZjxAmxXfgxIv3rPyunu\nVEsXglaBOBeUfC31ezVeR7ACy1wg32xDEweyhxTqgQKBgQDwphU6Hw+MwvF703f/\nywG9rm8jRHnIaIDOo5ngLnXqS06QfPkEG/KnO/oE6YcCKGhSBS8Am4iWR/RWWwXU\nt3hiTljR/YpEx7GXB6aBsxcd6M33x1jt7zSnJ0uc1RdA+dHTqdAKu91h7xlGXhzt\nu2FBbZlw0rxqIongrywujcoWXQKBgQDHZoL5zGLNPLKL2ES+4qn3sCQXyFqqkH9z\ncQk40O9UmzsQvD9VTVRgeRPxGU6VyV8DH74pQho4mCubZ4YZQ73qb9tp3GFjy8Zb\nMnFFV9gzvGbI/jdZ75JIzMPpEv1SkMVD361zeVKUAQRf+stsM876OnomNme5C5a4\nLYQUnwx/EQKBgGIPOx0Y5Qw1r5MGg6JexZHWT4EuePV55+rL7XrVU8Up9JSZ6BqN\njN4qaWGxCwuNDZ1GcXWs6wZZwa2in4ijTlG4nSbMSphmSu5A9s9o+6V7ZNpvh8RE\nsc7fC0eX6UbXxXGbg6OsE7TBaiorVVxl+2Ze06SOqqoQ8t/0YWuC6XMdAoGBAJgg\nzaxnEroipNWsmkZICATAjcjXQtT+iT457x85yF50UAvkky0xYj54IY7AEASXLbXk\nceBoXjjvX9Wgld6QoERMMsoBKQxKW3sYcPLGolxWUNTnnrMu5BxGnPElW7+yU84E\nyQBgf3ALlprjbG+Q10hxdN/Sgi/bd5Hsp+hTr+UBAoGALIpbjZ+upFvqH9ajyagk\nLRoNBGj2Ypu9yNepkUwxkAlacA+2JDIG9NFd3th9QuP2r6xutu8HXgAoetUqfQwR\n1l3R8mTghjKv0iqwxUqUiUxh2xz9waIzFQ2q8MTdLcGHSARMDgiXHukqYtWE4/N+\nPlBXEvXeRIyup2pqlMfQ5Eo=\n-----END PRIVATE KEY-----\n',
  client_email: 'social-media-4c489@appspot.gserviceaccount.com',
  client_id: '108590278418961979131',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/social-media-4c489%40appspot.gserviceaccount.com'
};
//{credential: admin.credential.cert(serviceAccount)}
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

module.exports = { admin, db };
