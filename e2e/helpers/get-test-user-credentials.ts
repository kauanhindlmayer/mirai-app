export function getTestUserCredentials() {
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  if (!email || !password) {
    throw new Error('Test user credentials are not set in environment variables.')
  }

  return {
    email,
    password,
  }
}
